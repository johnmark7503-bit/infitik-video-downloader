"use strict";

const RAPIDAPI_HOST =
  process.env.RAPIDAPI_HOST || "auto-download-all-in-one.p.rapidapi.com";
const RAPIDAPI_ENDPOINT = `https://${RAPIDAPI_HOST}/v1/social/autolink`;

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toHttpUrl(value) {
  if (typeof value !== "string" || value.length > 10000) return "";

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}

function firstText(value, keys, depth = 0) {
  if (depth > 6) return "";

  if (Array.isArray(value)) {
    for (const item of value.slice(0, 30)) {
      const result = firstText(item, keys, depth + 1);
      if (result) return result;
    }
    return "";
  }

  if (!isRecord(value)) return "";

  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim().slice(0, 300);
    }
  }

  for (const child of Object.values(value)) {
    const result = firstText(child, keys, depth + 1);
    if (result) return result;
  }

  return "";
}

function findBestVideo(payload, submittedUrl) {
  const candidates = [];
  const seen = new Set();
  const normalizedSubmittedUrl = toHttpUrl(submittedUrl);

  function visit(value, path = [], context = "", depth = 0) {
    if (depth > 8 || candidates.length > 160) return;

    if (Array.isArray(value)) {
      value.slice(0, 60).forEach((item, index) =>
        visit(item, [...path, String(index)], context, depth + 1)
      );
      return;
    }

    if (!isRecord(value)) return;

    const localContext = [
      context,
      value.type,
      value.mime,
      value.mimeType,
      value.format,
      value.extension,
      value.ext,
      value.quality,
      value.resolution,
      value.label,
      value.name,
    ]
      .filter((item) => typeof item === "string")
      .join(" ")
      .toLowerCase();

    for (const [key, child] of Object.entries(value)) {
      const currentPath = [...path, key].join(".").toLowerCase();
      const candidateUrl = toHttpUrl(child);

      if (
        candidateUrl &&
        candidateUrl !== normalizedSubmittedUrl &&
        !seen.has(candidateUrl)
      ) {
        const hints = `${currentPath} ${localContext} ${candidateUrl}`.toLowerCase();
        let score = 0;

        if (/\.mp4(?:$|[?#])/i.test(candidateUrl)) score += 120;
        if (/video\/mp4|\bmp4\b/.test(hints)) score += 90;
        if (/\bvideo\b|play|download|media|source|src/.test(hints)) score += 45;
        if (/no.?watermark|nowm|without.?watermark/.test(hints)) score += 30;
        if (/hd|1080|720|high/.test(hints)) score += 12;
        if (/audio|mp3|m4a|aac|music/.test(hints)) score -= 90;
        if (/thumbnail|thumb|cover|avatar|profile|poster|image|picture/.test(hints)) score -= 150;
        if (/\.m3u8(?:$|[?#])|application\/x-mpegurl/.test(hints)) score -= 80;

        if (score > 0) {
          seen.add(candidateUrl);
          candidates.push({ url: candidateUrl, score });
        }
      }

      visit(child, [...path, key], localContext, depth + 1);
    }
  }

  visit(payload);
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.url || "";
}

function parseBody(body) {
  if (isRecord(body)) return body;
  if (typeof body !== "string") return {};

  try {
    const parsed = JSON.parse(body);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export default async function downloadHandler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Send a POST request.",
    });
  }

  const body = parseBody(req.body);
  const submittedUrl = typeof body.url === "string" ? body.url.trim() : "";
  const validUrl = toHttpUrl(submittedUrl);

  if (!validUrl || validUrl.length > 2048) {
    return res.status(400).json({
      success: false,
      error: "Enter a valid public social media URL.",
    });
  }

  if (!process.env.RAPIDAPI_KEY) {
    return res.status(500).json({
      success: false,
      error: "The download service is not configured.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const rapidResponse = await fetch(RAPIDAPI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
      body: JSON.stringify({ url: validUrl }),
      signal: controller.signal,
    });

    const rawText = await rapidResponse.text();
    let payload = {};

    try {
      payload = rawText ? JSON.parse(rawText) : {};
    } catch {
      payload = {};
    }

    if (!rapidResponse.ok) {
      const providerMessage = firstText(payload, ["message", "error", "detail"]);
      return res.status(rapidResponse.status >= 500 ? 502 : 422).json({
        success: false,
        error: providerMessage || "The provider could not process this link.",
      });
    }

    const videoUrl = findBestVideo(payload, validUrl);
    if (!videoUrl) {
      return res.status(422).json({
        success: false,
        error: "No downloadable MP4 video was found for this public link.",
      });
    }

    const title =
      firstText(payload, ["title", "caption", "description", "text", "name"]) ||
      "InfiTik video";

    return res.status(200).json({
      success: true,
      title,
      videoUrl,
      format: "mp4",
    });
  } catch (error) {
    const timedOut = error && error.name === "AbortError";
    return res.status(timedOut ? 504 : 502).json({
      success: false,
      error: timedOut
        ? "The provider took too long to respond. Please try again."
        : "The download service is temporarily unavailable.",
    });
  } finally {
    clearTimeout(timeout);
  }
};
