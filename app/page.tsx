/* eslint-disable @next/next/no-img-element */

import Downloader from "./components/downloader";
import AdsterraAds from "./components/adsterra-ads";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.hammadawan.videodownloader";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 18v2h14v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m8 5 11 7-11 7V5Z" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 5 6v5c0 4.6 2.9 8.4 7 10 4.1-1.6 7-5.4 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 2c.8 5.7 4.3 9.2 10 10-5.7.8-9.2 4.3-10 10-.8-5.7-4.3-9.2-10-10 5.7-.8 9.2-4.3 10-10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function QualityIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9v6m8-6v6M8 12h3m5-3h-3v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src="/assets/infitik-logo.webp" alt="" width="72" height="72" />
    </span>
  );
}

function PlayStoreButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={`store-button${compact ? " store-button--compact" : ""}`}
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Download InfiTik on Google Play"
    >
      <span className="play-triangle" aria-hidden="true"><PlayIcon /></span>
      <span>
        <small>GET IT ON</small>
        <strong>Google Play</strong>
      </span>
    </a>
  );
}

const features = [
  {
    icon: <DownloadIcon />,
    title: "One-tap downloads",
    text: "Paste a supported video link, choose your option, and save it with a simple, focused flow.",
  },
  {
    icon: <QualityIcon />,
    title: "Quality that fits",
    text: "Choose from the available video quality options and keep the version that works for you.",
  },
  {
    icon: <SparkIcon />,
    title: "Clean experience",
    text: "A modern interface built to keep every step clear—from link to saved video.",
  },
  {
    icon: <ShieldIcon />,
    title: "Your files, your device",
    text: "Keep downloaded videos within reach and enjoy them from your device whenever you need them.",
  },
];

const faqs = [
  {
    question: "How do I download a video online?",
    answer: "Copy a public video link, paste it into the online downloader above, select an available format, and tap Download.",
  },
  {
    question: "Can I choose the video quality?",
    answer: "When multiple options are available, InfiTik lets you choose the quality that best suits your device and storage space.",
  },
  {
    question: "Where are downloaded videos saved?",
    answer: "Completed downloads are saved on your device, where you can find and play them with your usual media or file apps.",
  },
  {
    question: "Is InfiTik available for Android?",
    answer: "Yes. InfiTik Video Downloader is available for Android through Google Play.",
  },
  {
    question: "Can I download any video?",
    answer: "Only download content you own or have permission to save. Availability can vary by source, content, and local rules.",
  },
  {
    question: "Which social platforms are supported?",
    answer: "InfiTik accepts public links from popular platforms including TikTok, Instagram, Facebook, X, Pinterest, YouTube, and Threads. Results depend on the source and provider availability.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "InfiTik Online Video Downloader",
  url: "https://infitik-video-downloader.johnmark7503.chatgpt.site",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description: "A free online tool for preparing downloadable formats from supported public social video links.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Online video link processing",
    "Multiple available download formats",
    "TikTok, Instagram, Facebook, X and Pinterest support",
    "Android app available",
  ],
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="InfiTik home">
            <BrandMark />
            <span>InfiTik</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#online-downloader">Downloader</a>
            <a href="#features">Features</a>
            <a href="#reviews">Highlights</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className="header-cta" href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
            Get the app <ArrowIcon />
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow hero-glow--one" />
        <div className="hero-glow hero-glow--two" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Made for effortless saving</div>
            <h1>Download videos.<br /><em>Keep the quality.</em></h1>
            <p className="hero-lede">
              Paste a public social video link and prepare the available download
              formats online—fast, clean, and ready when you are.
            </p>
            <div className="hero-actions">
              <a className="online-cta" href="#online-downloader"><DownloadIcon /> Download online</a>
              <a className="text-link" href={PLAY_STORE_URL} target="_blank" rel="noreferrer">Get the Android app <ArrowIcon /></a>
            </div>
            <div className="trust-row" aria-label="Product benefits">
              <span><i>✓</i> Simple flow</span>
              <span><i>✓</i> Quality options</span>
              <span><i>✓</i> Android ready</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="InfiTik app preview">
            <div className="orbit orbit--one" />
            <div className="orbit orbit--two" />
            <div className="hero-logo-card">
              <span className="logo-pulse" />
              <img src="/assets/infitik-logo.webp" alt="InfiTik no watermark app logo" width="250" height="250" />
            </div>
            <div className="floating-card floating-card--quality">
              <span className="mini-icon"><QualityIcon /></span>
              <span><small>MORE THAN DOWNLOADS</small><strong>Audio · Wallpaper · Ringtone</strong></span>
            </div>
            <div className="floating-card floating-card--saved">
              <span className="status-dot">✓</span>
              <span><small>DOWNLOAD</small><strong>Saved to device</strong></span>
            </div>
            <div className="phone phone--hero">
              <div className="phone-screen phone-screen--real">
                <img src="/assets/app-home.webp" alt="InfiTik home screen" width="720" height="1601" />
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-note"><span /> Scroll to explore</div>
      </section>

      <section className="downloader-section section" id="online-downloader">
        <div className="shell downloader-shell">
          <div className="download-heading">
            <span className="section-kicker">FREE ONLINE TOOL</span>
            <h2>Online video downloader</h2>
            <p>Paste a supported public video URL below. InfiTik securely prepares the formats returned by the source provider, while the service credential stays protected on the server.</p>
          </div>
          <Downloader />
        </div>
      </section>

      <AdsterraAds />

      <section className="feature-section section" id="features">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="section-kicker">WHY INFITIK</span>
              <h2>Everything you need.<br /><em>Nothing you don’t.</em></h2>
            </div>
            <p>From copied link to saved video, every part of InfiTik is designed to stay quick, clear, and easy to understand.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-number">0{index + 1}</span>
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="steps-section section" id="how-it-works">
        <div className="shell steps-grid">
          <div className="steps-copy">
            <span className="section-kicker">HOW IT WORKS</span>
            <h2>Three taps.<br /><em>That’s it.</em></h2>
            <p>No complicated setup. InfiTik keeps the path from link to download refreshingly simple.</p>
          </div>
          <ol className="steps-list">
            <li><span>01</span><div><h3>Copy the link</h3><p>Copy a link to the video you have permission to save.</p></div></li>
            <li><span>02</span><div><h3>Paste it in InfiTik</h3><p>Open the app, paste your link, and let InfiTik prepare it.</p></div></li>
            <li><span>03</span><div><h3>Choose and download</h3><p>Select an available quality option and save it to your device.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="transform-section section" id="no-watermark">
        <div className="shell transform-grid">
          <div className="transform-copy">
            <span className="section-kicker">THE CLEAN-SAVE EFFECT</span>
            <h2>From distracting<br /><em>to beautifully clean.</em></h2>
            <p>Watch the animated reveal: the visual overlay disappears as the clean version takes over. Availability depends on the source and the content you have permission to save.</p>
            <div className="transform-points"><span>Before</span><i /><span>After</span></div>
          </div>
          <div className="watermark-demo" aria-label="Animated before and after watermark comparison">
            <div className="demo-label demo-label--before">BEFORE · WATERMARK</div>
            <div className="demo-label demo-label--after">AFTER · CLEAN SAVE</div>
            <div className="demo-scene demo-scene--before">
              <div className="scene-orb" /><div className="scene-card"><PlayIcon /></div>
              <strong className="sample-watermark">@sample_creator</strong>
            </div>
            <div className="demo-scene demo-scene--clean">
              <div className="scene-orb" /><div className="scene-card"><PlayIcon /></div>
            </div>
            <div className="reveal-line"><span><SparkIcon /></span></div>
            <div className="demo-caption"><b>InfiTik</b><span>Clean viewing experience</span></div>
          </div>
        </div>
      </section>

      <section className="screens-section section" id="screenshots">
        <div className="shell">
          <div className="section-heading section-heading--center">
            <div>
              <span className="section-kicker">APP PREVIEW</span>
              <h2>Simple at every step.</h2>
            </div>
            <p>Clean screens, clear actions, and no unnecessary clutter between you and your download.</p>
          </div>
          <div className="screens-grid">
            <article className="screen-item screen-item--low">
              <div className="screen-meta"><span>01</span><strong>Download home</strong></div>
              <div className="phone phone--shot"><div className="real-screen"><img src="/assets/app-home.webp" alt="InfiTik video download home screen" width="720" height="1601" loading="lazy" /></div></div>
            </article>
            <article className="screen-item">
              <div className="screen-meta"><span>02</span><strong>Smart history</strong></div>
              <div className="phone phone--shot"><div className="real-screen"><img src="/assets/app-history.webp" alt="InfiTik download history screen" width="720" height="1601" loading="lazy" /></div></div>
            </article>
            <article className="screen-item screen-item--low">
              <div className="screen-meta"><span>03</span><strong>Useful controls</strong></div>
              <div className="phone phone--shot"><div className="real-screen"><img src="/assets/app-settings.webp" alt="InfiTik settings screen" width="720" height="1601" loading="lazy" /></div></div>
            </article>
          </div>
        </div>
      </section>

      <section className="reviews-section section" id="reviews">
        <div className="shell">
          <div className="section-heading">
            <div><span className="section-kicker">WHY IT STANDS OUT</span><h2>Built around what<br /><em>users value.</em></h2></div>
            <p>Clear actions, useful extras, and a focused experience—these are the product qualities users notice first.</p>
          </div>
          <div className="review-grid">
            <article><span className="review-stars">PRODUCT HIGHLIGHT 01</span><blockquote>“The download action is visible immediately, so the app is easy to understand from the first screen.”</blockquote><div><b>Clear from the start</b><small>Ease-of-use highlight</small></div></article>
            <article><span className="review-stars">PRODUCT HIGHLIGHT 02</span><blockquote>“History keeps completed downloads easy to find, play, share, and reuse.”</blockquote><div><b>Everything stays organized</b><small>Workflow highlight</small></div></article>
            <article><span className="review-stars">PRODUCT HIGHLIGHT 03</span><blockquote>“Audio extraction, wallpaper, and ringtone tools make every saved video more useful.”</blockquote><div><b>More value in one app</b><small>Feature highlight</small></div></article>
          </div>
          <p className="review-disclaimer">Product highlights based on the current app experience. Verified Play Store reviews can be added when available.</p>
        </div>
      </section>

      <section className="faq-section section" id="faq">
        <div className="shell faq-grid">
          <div className="faq-intro">
            <span className="section-kicker">GOOD TO KNOW</span>
            <h2>Questions,<br /><em>answered.</em></h2>
            <p>Everything you need to know before you start downloading with InfiTik.</p>
            <a className="text-link" href={PLAY_STORE_URL} target="_blank" rel="noreferrer">View on Google Play <ArrowIcon /></a>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary><span>{faq.question}</span><i>+</i></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-glow" />
        <div className="shell cta-inner">
          <BrandMark />
          <span className="section-kicker">READY WHEN YOU ARE</span>
          <h2>Your videos.<br /><em>One tap away.</em></h2>
          <p>Download InfiTik for Android and make saving supported videos feel effortless.</p>
          <PlayStoreButton />
          <small>Available on Android</small>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <a className="brand" href="#top"><BrandMark /><span>InfiTik</span></a>
          <p>© 2026 InfiTik. Download responsibly.</p>
          <div><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/disclaimer.html">Disclaimer</a><a href={PLAY_STORE_URL} target="_blank" rel="noreferrer">Google Play</a></div>
        </div>
      </footer>
    </main>
  );
}
