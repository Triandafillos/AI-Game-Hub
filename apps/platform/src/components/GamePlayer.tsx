"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PlatformRequest, PlatformResponse } from "@ai-game-hub/game-sdk";

type GamePlayerProps = {
  slug: string;
  entryPath: string;
  user: { id: string; email?: string } | null;
};

export function GamePlayer({ slug, entryPath, user }: GamePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleMessage = useCallback(
    async (event: MessageEvent<PlatformRequest>) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const iframe = iframeRef.current;
      if (!iframe?.contentWindow || event.source !== iframe.contentWindow) {
        return;
      }

      const data = event.data;
      if (!data || typeof data !== "object" || !("type" in data)) {
        return;
      }

      const reply = (payload: PlatformResponse) => {
        iframe.contentWindow?.postMessage(payload, window.location.origin);
      };

      if (data.type === "platform:getUser") {
        reply({
          type: "platform:user",
          requestId: data.requestId,
          user: user ? { id: user.id, email: user.email } : null,
        });
        return;
      }

      if (data.type === "platform:load") {
        try {
          const response = await fetch(`/api/games/${slug}/save`);
          if (response.status === 401) {
            reply({
              type: "platform:loadResult",
              requestId: data.requestId,
              data: null,
              error: "Not authenticated",
            });
            return;
          }

          const body = (await response.json()) as { data: unknown | null };
          reply({
            type: "platform:loadResult",
            requestId: data.requestId,
            data: body.data,
          });
        } catch {
          reply({
            type: "platform:loadResult",
            requestId: data.requestId,
            data: null,
            error: "Failed to load save",
          });
        }
        return;
      }

      if (data.type === "platform:save") {
        try {
          const response = await fetch(`/api/games/${slug}/save`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: data.data }),
          });

          if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as { error?: string };
            reply({
              type: "platform:saveResult",
              requestId: data.requestId,
              ok: false,
              error: body.error ?? "Save failed",
            });
            return;
          }

          reply({
            type: "platform:saveResult",
            requestId: data.requestId,
            ok: true,
          });
        } catch {
          reply({
            type: "platform:saveResult",
            requestId: data.requestId,
            ok: false,
            error: "Failed to save",
          });
        }
      }
    },
    [slug, user],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <iframe
      ref={iframeRef}
      src={entryPath}
      title={`Game: ${slug}`}
      sandbox="allow-scripts allow-same-origin"
      className="h-[70vh] w-full rounded-lg border border-zinc-800 bg-black"
    />
  );
}
