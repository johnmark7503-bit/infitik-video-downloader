export default function handler(_request, response) {
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600");
  response.status(200).send(
    "google-site-verification: google113da79d0eaac6dd.html\n",
  );
}
