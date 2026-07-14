export function GET() {
  return new Response(
    "google-site-verification: google113da79d0eaac6dd.html\n",
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
