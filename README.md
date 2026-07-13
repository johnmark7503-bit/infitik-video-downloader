# InfiTik Video Downloader

InfiTik is a responsive social media video downloader website with a secure server-side RapidAPI proxy, SEO metadata, legal pages, Firebase event tracking hooks, and ad-ready placements.

## Included

- Modern responsive landing page
- Secure video-link processing through `RAPIDAPI_KEY`
- TikTok, Instagram, Facebook, X, Pinterest, YouTube, and Threads link support
- Direct-source download links to avoid proxying large media files
- Privacy Policy, Terms of Service, Disclaimer, sitemap, and `app-ads.txt`
- Firebase Analytics/Firestore tracking helper
- Adsterra Native Banner and Social Bar integration placeholders
- Separate Vercel-ready static package under `vercel-static/`

## Project structure

```text
app/                    Main responsive application
public/                 Assets, legal pages, sitemap and client configuration
worker/                 Secure runtime API proxy used by the current live site
vercel-static/          Standalone Vercel frontend and /api/download function
tests/                  Rendered output checks
```

## Environment variables

The API credential must be configured in the hosting dashboard and must never be committed:

```text
RAPIDAPI_KEY=your_private_rapidapi_key
RAPIDAPI_HOST=auto-download-all-in-one.p.rapidapi.com
```

Firebase and Adsterra client configuration files contain disabled placeholders until account-specific values are supplied.

## Live website

[InfiTik Video Downloader](https://infitik-video-downloader.johnmark7503.chatgpt.site/)

Only download public content that you own or have permission to save.
