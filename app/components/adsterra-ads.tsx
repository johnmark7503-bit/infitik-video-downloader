"use client";

import { useEffect } from "react";

type AdsterraConfig = {
  enabled?: boolean;
  nativeBanner?: {
    scriptSrc?: string;
    containerId?: string;
  };
  socialBar?: {
    scriptSrc?: string;
  };
};

declare global {
  interface Window {
    INFITIK_ADS?: AdsterraConfig;
  }
}

function secureScriptUrl(value?: string) {
  if (!value) return "";

  try {
    const parsed = new URL(value.startsWith("//") ? `https:${value}` : value);
    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function safeContainerId(value?: string) {
  const id = value?.trim() || "";
  return /^[A-Za-z][A-Za-z0-9_:.-]{5,160}$/.test(id) ? id : "";
}

function loadAdScript(src: string, id: string, native = false) {
  if (!src || document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  script.type = "text/javascript";
  if (native) script.setAttribute("data-cfasync", "false");
  document.body.appendChild(script);
}

export default function AdsterraAds() {
  useEffect(() => {
    const config = window.INFITIK_ADS;
    if (!config?.enabled) return;

    const nativeScript = secureScriptUrl(config.nativeBanner?.scriptSrc);
    const nativeContainer = safeContainerId(config.nativeBanner?.containerId);
    if (nativeScript && nativeContainer) {
      const slot = document.getElementById("infitik-adsterra-native-slot");
      const container = document.getElementById("infitik-adsterra-native-container");
      if (slot && container) {
        container.id = nativeContainer;
        slot.hidden = false;
        loadAdScript(nativeScript, "infitik-adsterra-native-script", true);
      }
    }

    const socialScript = secureScriptUrl(config.socialBar?.scriptSrc);
    if (socialScript) loadAdScript(socialScript, "infitik-adsterra-social-bar");
  }, []);

  return (
    <section id="infitik-adsterra-native-slot" className="adsterra-section" aria-label="Advertisement" hidden>
      <div className="shell adsterra-shell">
        <span className="adsterra-label">Advertisement</span>
        <div className="adsterra-native-frame">
          <div id="infitik-adsterra-native-container" />
        </div>
      </div>
    </section>
  );
}
