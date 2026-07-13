/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  RAPIDAPI_KEY?: string;
  RAPIDAPI_HOST?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

const downloadLimits = new Map<string, { count: number; resetAt: number }>();
const supportedHosts = [
  "tiktok.com", "instagram.com", "facebook.com", "fb.watch", "twitter.com",
  "x.com", "pinterest.com", "pin.it", "youtube.com", "youtu.be", "threads.net",
];

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function isSupportedVideoUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    if (url.username || url.password || url.port) return false;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return supportedHosts.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

async function handleDownload(request: Request, env: Env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) return json({ error: "Request is too large" }, 413);

  const clientId = request.headers.get("cf-connecting-ip") || "anonymous";
  const now = Date.now();
  const current = downloadLimits.get(clientId);
  if (!current || current.resetAt <= now) {
    downloadLimits.set(clientId, { count: 1, resetAt: now + 60_000 });
  } else {
    current.count += 1;
    if (current.count > 8) {
      return json({ error: "Too many requests. Please wait a minute and try again." }, 429, { "Retry-After": "60" });
    }
  }

  let payload: { url?: unknown };
  try {
    payload = (await request.json()) as { url?: unknown };
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const videoUrl = typeof payload.url === "string" ? payload.url.trim() : "";
  if (!videoUrl || videoUrl.length > 2048 || !isSupportedVideoUrl(videoUrl)) {
    return json({ error: "Enter a valid public link from a supported social platform." }, 400);
  }

  const apiKey = env.RAPIDAPI_KEY;
  const apiHost = env.RAPIDAPI_HOST || "auto-download-all-in-one.p.rapidapi.com";
  if (!apiKey) return json({ error: "The download service is not configured yet." }, 503);

  try {
    const upstream = await fetch(`https://${apiHost}/v1/social/autolink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": apiHost,
        "x-rapidapi-key": apiKey,
      },
      body: JSON.stringify({ url: videoUrl }),
      signal: AbortSignal.timeout(25_000),
    });

    const responseText = await upstream.text();
    if (responseText.length > 2_000_000) {
      return json({ error: "The download response was too large." }, 502);
    }
    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      return json({ error: "The download provider returned an invalid response." }, 502);
    }

    if (!upstream.ok) {
      const providerMessage = typeof responseData === "object" && responseData && "message" in responseData
        ? String((responseData as { message?: unknown }).message || "")
        : "";
      const safeMessage = /quota|limit/i.test(providerMessage)
        ? "The download service is temporarily busy. Please try again later."
        : "This video could not be prepared. Check that the link is public and try again.";
      return json({ error: safeMessage }, upstream.status >= 500 ? 502 : 400);
    }

    return json(responseData);
  } catch (error) {
    const timedOut = error instanceof Error && /abort|timeout/i.test(error.name + error.message);
    return json({ error: timedOut ? "The request timed out. Please try again." : "The download service is temporarily unavailable." }, 502);
  }
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/download") {
      return handleDownload(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
