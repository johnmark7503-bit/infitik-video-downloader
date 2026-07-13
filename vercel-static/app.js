"use strict";

const form = document.getElementById("downloadForm");
const urlInput = document.getElementById("videoUrl");
const pasteButton = document.getElementById("pasteButton");
const downloadButton = document.getElementById("downloadButton");
const buttonText = document.getElementById("buttonText");
const statusText = document.getElementById("statusText");
const errorBox = document.getElementById("errorBox");
const resultBox = document.getElementById("resultBox");
const videoTitle = document.getElementById("videoTitle");
const directDownload = document.getElementById("directDownload");

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function setLoading(loading) {
  downloadButton.disabled = loading;
  downloadButton.classList.toggle("is-loading", loading);
  buttonText.textContent = loading ? "Preparing Video…" : "Download Video";
  form.setAttribute("aria-busy", String(loading));
}

function clearMessages() {
  statusText.textContent = "";
  errorBox.textContent = "";
  errorBox.classList.remove("is-visible");
  resultBox.classList.remove("is-visible");
  directDownload.removeAttribute("href");
}

function showError(message) {
  statusText.textContent = "";
  errorBox.textContent = message;
  errorBox.classList.add("is-visible");
}

function showResult(title, sourceUrl) {
  videoTitle.textContent = title || "Your video is ready";
  directDownload.href = sourceUrl;
  resultBox.classList.add("is-visible");
  statusText.textContent = "Download link prepared successfully.";
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

pasteButton.addEventListener("click", async () => {
  clearMessages();

  try {
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText) {
      urlInput.value = clipboardText.trim();
      urlInput.focus();
    }
  } catch {
    showError("Paste the copied video link into the field above.");
    urlInput.focus();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessages();

  const submittedUrl = urlInput.value.trim();
  if (!isValidHttpUrl(submittedUrl)) {
    showError("Enter a valid public video link beginning with http:// or https://.");
    urlInput.focus();
    return;
  }

  setLoading(true);
  statusText.textContent = "Contacting the video provider securely…";

  try {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: submittedUrl }),
    });

    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || "The video could not be prepared right now.");
    }

    if (!isValidHttpUrl(payload.videoUrl)) {
      throw new Error("The provider returned an invalid video source URL.");
    }

    showResult(payload.title, payload.videoUrl);

    if (typeof window.trackDownloadEvent === "function") {
      void window.trackDownloadEvent({
        url: submittedUrl,
        status: "ready",
        format: payload.format || "mp4",
      });
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
});

directDownload.addEventListener("click", () => {
  statusText.textContent = "Opening the direct video source in a new tab…";
});
