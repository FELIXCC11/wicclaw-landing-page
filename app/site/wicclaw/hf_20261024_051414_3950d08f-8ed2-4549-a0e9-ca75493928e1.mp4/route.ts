const source = "https://raw.githubusercontent.com/FELIXCC11/wicclaw-landing-page/f7ee099586d207e07b2d394537a3bdcf934d2b87/public/site/wicclaw/hf_20261024_051414_3950d08f-8ed2-4549-a0e9-ca75493928e1.mp4";

export const runtime = "nodejs";

async function serveVideo(request: Request, method: "GET" | "HEAD") {
  const upstreamHeaders = new Headers();
  for (const name of ["range", "if-none-match", "if-modified-since"]) {
    const value = request.headers.get(name);
    if (value) upstreamHeaders.set(name, value);
  }

  const upstream = await fetch(source, { method, headers: upstreamHeaders });
  const headers = new Headers();
  for (const name of ["accept-ranges", "content-length", "content-range", "etag", "last-modified"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("Content-Type", "video/mp4");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export function GET(request: Request) {
  return serveVideo(request, "GET");
}

export function HEAD(request: Request) {
  return serveVideo(request, "HEAD");
}
