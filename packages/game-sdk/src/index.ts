import type { GamePlatformSDK, PlatformRequest, PlatformResponse } from "./types.js";

const DEFAULT_TIMEOUT_MS = 10_000;

function createRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type CreatePlatformSDKOptions = {
  /** Parent window origin. Defaults to document.referrer origin or "*". */
  targetOrigin?: string;
  timeoutMs?: number;
};

export function createPlatformSDK(
  options: CreatePlatformSDKOptions = {},
): GamePlatformSDK {
  if (typeof window === "undefined") {
    throw new Error("createPlatformSDK must be called in a browser context");
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const targetOrigin = options.targetOrigin ?? getParentOrigin();

  const pending = new Map<
    string,
    { resolve: (value: unknown) => void; reject: (reason: Error) => void }
  >();

  function handleMessage(event: MessageEvent<PlatformResponse>) {
    const data = event.data;
    if (!data || typeof data !== "object" || !("type" in data)) {
      return;
    }

    if (
      data.type !== "platform:user" &&
      data.type !== "platform:saveResult" &&
      data.type !== "platform:loadResult"
    ) {
      return;
    }

    const requestId = "requestId" in data ? data.requestId : undefined;
    if (!requestId) {
      return;
    }

    const entry = pending.get(requestId);
    if (!entry) {
      return;
    }

    pending.delete(requestId);

    if (data.type === "platform:user") {
      entry.resolve(data.user);
      return;
    }

    if (data.type === "platform:saveResult") {
      if (data.ok) {
        entry.resolve(undefined);
      } else {
        entry.reject(new Error(data.error ?? "Save failed"));
      }
      return;
    }

    if (data.type === "platform:loadResult") {
      if (data.error) {
        entry.reject(new Error(data.error));
      } else {
        entry.resolve(data.data);
      }
    }
  }

  window.addEventListener("message", handleMessage);

  function sendRequest<T>(message: PlatformRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = message.requestId;
      const timer = window.setTimeout(() => {
        pending.delete(requestId);
        reject(new Error(`Platform request timed out: ${message.type}`));
      }, timeoutMs);

      pending.set(requestId, {
        resolve: (value) => {
          window.clearTimeout(timer);
          resolve(value as T);
        },
        reject: (error) => {
          window.clearTimeout(timer);
          reject(error);
        },
      });

      window.parent.postMessage(message, targetOrigin);
    });
  }

  return {
    async getUser() {
      return sendRequest(messageWithId("platform:getUser"));
    },

    async save(data: unknown) {
      await sendRequest(
        { type: "platform:save", requestId: createRequestId(), data },
      );
    },

    async load() {
      return sendRequest(messageWithId("platform:load"));
    },

    onPause(callback) {
      const handler = () => {
        if (document.visibilityState === "hidden") {
          callback();
        }
      };
      document.addEventListener("visibilitychange", handler);
      return () => document.removeEventListener("visibilitychange", handler);
    },
  };
}

function messageWithId(type: "platform:getUser" | "platform:load"): PlatformRequest {
  return { type, requestId: createRequestId() };
}

function getParentOrigin(): string {
  try {
    if (document.referrer) {
      return new URL(document.referrer).origin;
    }
  } catch {
    // fall through
  }
  return window.location.origin;
}

export type {
  GamePlatformSDK,
  PlatformRequest,
  PlatformResponse,
  PlatformUser,
} from "./types.js";
