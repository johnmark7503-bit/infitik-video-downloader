"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useState } from "react";

declare global {
  interface Window {
    trackDownloadEvent?: (details?: {
      url?: string;
      platform?: string;
      status?: string;
      format?: string;
    }) => Promise<boolean>;
  }
}

type MediaItem = {
  url: string;
  label: string;
  type: string;
  size?: string;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeHttpUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function firstText(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function findFirstText(value: unknown, keys: string[], depth = 0): string {
  if (depth > 4) return "";
  if (isRecord(value)) {
    const direct = firstText(value, keys);
    if (direct) return direct;
    for (const child of Object.values(value)) {
      const found = findFirstText(child, keys, depth + 1);
      if (found) return found;
    }
  }
  if (Array.isArray(value)) {
    for (const child of value.slice(0, 12)) {
      const found = findFirstText(child, keys, depth + 1);
      if (found) return found;
    }
  }
  return "";
}

function extractMedia(payload: unknown, sourceUrl: string) {
  const results: MediaItem[] = [];
  const seen = new Set<string>();
  const normalizedSource = safeHttpUrl(sourceUrl);
  const urlKeys = /(^|_)(url|link|src|download|downloadurl|download_url|play|play_url|video|audio)($|_)/i;
  const excludeKeys = /(thumbnail|thumb|cover|avatar|profile|image|picture|author)/i;

  function visit(value: unknown, path: string[], depth: number) {
    if (depth > 7 || results.length >= 12) return;
    if (Array.isArray(value)) {
      value.slice(0, 40).forEach((item, index) => visit(item, [...path, String(index)], depth + 1));
      return;
    }
    if (!isRecord(value)) return;

    const type = firstText(value, ["type", "mime", "format", "extension", "ext"]);
    const quality = firstText(value, ["quality", "resolution", "label", "name", "format"]);
    const size = firstText(value, ["formattedSize", "formatted_size", "size", "filesize", "file_size"]);

    for (const [key, child] of Object.entries(value)) {
      const mediaUrl = safeHttpUrl(child);
      const currentPath = [...path, key].join(".");
      const isMediaContext = urlKeys.test(key) || /(media|video|audio|formats|downloads)/i.test(currentPath);
      if (
        mediaUrl &&
        isMediaContext &&
        !excludeKeys.test(currentPath) &&
        mediaUrl !== normalizedSource &&
        !seen.has(mediaUrl)
      ) {
        seen.add(mediaUrl);
        const inferredType = type || (/audio|mp3|m4a/i.test(currentPath + mediaUrl) ? "Audio" : "Video");
        results.push({
          url: mediaUrl,
          label: quality || (inferredType.toLowerCase().includes("audio") ? "Audio" : "Download video"),
          type: inferredType,
          size: size || undefined,
        });
      }
      visit(child, [...path, key], depth + 1);
    }
  }

  visit(payload, [], 0);
  return results;
}

function extractThumbnail(payload: unknown) {
  function visit(value: unknown, depth: number): string {
    if (depth > 5) return "";
    if (isRecord(value)) {
      for (const [key, child] of Object.entries(value)) {
        if (/(thumbnail|thumb|cover|image|picture)/i.test(key)) {
          const url = safeHttpUrl(child);
          if (url) return url;
        }
      }
      for (const child of Object.values(value)) {
        const found = visit(child, depth + 1);
        if (found) return found;
      }
    }
    if (Array.isArray(value)) {
      for (const child of value.slice(0, 12)) {
        const found = visit(child, depth + 1);
        if (found) return found;
      }
    }
    return "";
  }
  return visit(payload, 0);
}

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  async function pasteFromClipboard() {
    try {
      const value = await navigator.clipboard.readText();
      if (value) setUrl(value.trim());
    } catch {
      setError("Paste your copied link into the field.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMedia([]);
    setTitle("");
    setThumbnail("");

    const cleanUrl = url.trim();
    if (!safeHttpUrl(cleanUrl)) {
      setError("Enter a valid public video link beginning with http:// or https://.");
      return;
    }

    setLoading(true);
    void window.trackDownloadEvent?.({ url: cleanUrl, status: "started" });
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });
      const payload = (await response.json()) as unknown;
      if (!response.ok) {
        const message = isRecord(payload) && typeof payload.error === "string"
          ? payload.error
          : "The video could not be prepared right now.";
        throw new Error(message);
      }

      const options = extractMedia(payload, cleanUrl);
      if (!options.length) {
        throw new Error("No downloadable format was returned for this link. Try another public video.");
      }
      setMedia(options);
      setTitle(findFirstText(payload, ["title", "caption", "description", "text"]));
      setThumbnail(extractThumbnail(payload));
      void window.trackDownloadEvent?.({
        url: cleanUrl,
        status: "ready",
        format: options[0]?.type || "video",
      });
    } catch (caught) {
      void window.trackDownloadEvent?.({ url: cleanUrl, status: "failed" });
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="downloader-app">
      <form onSubmit={submit} className="download-form">
        <div className="download-input-wrap">
          <span className="input-link-icon" aria-hidden="true">↗</span>
          <input
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="Paste a TikTok, Instagram, Facebook, X or Pinterest link"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            aria-label="Video URL"
            maxLength={2048}
          />
          <button type="button" className="paste-button" onClick={pasteFromClipboard}>Paste</button>
        </div>
        <button type="submit" className="prepare-button" disabled={loading}>
          <span aria-hidden="true">↓</span>
          {loading ? "Preparing…" : "Download"}
        </button>
      </form>

      <div className="platform-row" aria-label="Supported platforms">
        <span>TikTok</span><span>Instagram</span><span>Facebook</span><span>X</span><span>Pinterest</span><span>YouTube</span>
      </div>

      {loading && (
        <div className="download-status" role="status">
          <span className="status-spinner" />
          <div><strong>Preparing your download</strong><small>Fetching the available formats securely…</small></div>
        </div>
      )}

      {error && <p className="download-error" role="alert">{error}</p>}

      {media.length > 0 && (
        <div className="download-result" aria-live="polite">
          <div className="result-preview">
            {thumbnail ? <img src={thumbnail} alt="Video preview" referrerPolicy="no-referrer" /> : <span>▶</span>}
          </div>
          <div className="result-content">
            <span className="result-kicker">READY TO DOWNLOAD</span>
            <h3>{title || "Your video is ready"}</h3>
            <div className="format-list">
              {media.map((item, index) => (
                <a key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noopener noreferrer nofollow">
                  <span><b>{item.label}</b><small>{item.type}{item.size ? ` · ${item.size}` : ""}</small></span>
                  <strong>Download <i>↓</i></strong>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="legal-note">Download only content you own or have permission to save. Private or restricted videos are not supported.</p>
    </div>
  );
}
