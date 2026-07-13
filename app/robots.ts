import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://infitik-video-downloader.johnmark7503.chatgpt.site/sitemap.xml",
  };
}
