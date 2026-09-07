export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StreamCallbacks {
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Streams a chat reply from the backend, which proxies to Anthropic's
 * streaming API server-side (keeping the API key off the client entirely).
 * Returns an abort function so the caller can cancel an in-flight stream
 * (e.g. if the widget is closed mid-response).
 */
export function streamChat(messages: ChatMessage[], callbacks: StreamCallbacks): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_URL}/public/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => null);
        callbacks.onError(body?.message || "The chat assistant is temporarily unavailable.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by a blank line; a frame may arrive
        // split across multiple network chunks, so only process complete
        // frames and keep any trailing partial frame in the buffer.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;

          const json = dataLine.slice(5).trim();
          if (!json) continue;

          try {
            const parsed = JSON.parse(json) as { type: string; text?: string };
            if (parsed.type === "delta" && parsed.text) {
              callbacks.onDelta(parsed.text);
            } else if (parsed.type === "error") {
              callbacks.onError(parsed.text || "Something went wrong.");
              return;
            } else if (parsed.type === "done") {
              callbacks.onDone();
              return;
            }
          } catch {
            // ignore a malformed frame rather than breaking the whole stream
          }
        }
      }

      callbacks.onDone();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      callbacks.onError("Couldn't reach the chat assistant. Please check your connection.");
    }
  })();

  return () => controller.abort();
}
