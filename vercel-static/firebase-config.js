import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics, isSupported, logEvent } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import { addDoc, collection, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Replace every PASTE_... value with the Firebase Web App configuration
// shown in Firebase Console > Project settings > Your apps > Web app.
const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_FIREBASE_APP_ID",
  measurementId: "G-XXXXXX"
};

const configured = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value && !value.includes("PASTE_") && value !== "G-XXXXXX"
);

let app = null;
let analytics = null;
let db = null;

if (configured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {
      analytics = null;
    });
}

function safeLabel(value, fallback = "unknown") {
  if (typeof value !== "string") return fallback;
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 40) || fallback;
}

function detectPlatform(input) {
  try {
    const host = new URL(input).hostname.toLowerCase();
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("facebook") || host.includes("fb.watch")) return "facebook";
    if (host.includes("pinterest") || host.includes("pin.it")) return "pinterest";
    if (host.includes("youtube") || host.includes("youtu.be")) return "youtube";
    if (host === "x.com" || host.endsWith(".x.com") || host.includes("twitter")) return "x";
    if (host.includes("threads")) return "threads";
  } catch {
    return "unknown";
  }
  return "other";
}

/**
 * Track a download-button interaction without storing the full submitted URL.
 * Usage:
 *   window.trackDownloadEvent({ url, status: "started", format: "mp4" });
 */
export async function trackDownloadEvent({
  url = "",
  platform = "",
  status = "started",
  format = "unknown"
} = {}) {
  if (!configured) return false;

  const eventData = {
    platform: safeLabel(platform || detectPlatform(url)),
    status: safeLabel(status),
    format: safeLabel(format),
    page_path: window.location.pathname
  };

  try {
    if (analytics) logEvent(analytics, "video_download", eventData);

    if (db) {
      await addDoc(collection(db, "download_events"), {
        ...eventData,
        createdAt: serverTimestamp()
      });
    }

    return true;
  } catch (error) {
    console.warn("Download analytics could not be recorded.", error);
    return false;
  }
}

window.trackDownloadEvent = trackDownloadEvent;
window.InfiTikFirebase = { app, analytics, db, configured };

export { app, analytics, db };
