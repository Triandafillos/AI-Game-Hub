export type PlatformUser = {
  id: string;
  email?: string;
};

export type GamePlatformSDK = {
  getUser(): Promise<PlatformUser | null>;
  save(data: unknown): Promise<void>;
  load(): Promise<unknown | null>;
  onPause(callback: () => void): () => void;
};

export type PlatformMessageType =
  | "platform:ready"
  | "platform:getUser"
  | "platform:save"
  | "platform:load"
  | "platform:user"
  | "platform:saveResult"
  | "platform:loadResult";

export type PlatformRequest =
  | { type: "platform:getUser"; requestId: string }
  | { type: "platform:save"; requestId: string; data: unknown }
  | { type: "platform:load"; requestId: string };

export type PlatformResponse =
  | { type: "platform:user"; requestId: string; user: PlatformUser | null }
  | { type: "platform:saveResult"; requestId: string; ok: boolean; error?: string }
  | { type: "platform:loadResult"; requestId: string; data: unknown | null; error?: string }
  | { type: "platform:ready" };
