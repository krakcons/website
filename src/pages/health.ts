import type { APIRoute } from "astro";

// Liveness only: database and storage readiness should be checked separately.
export const GET: APIRoute = () =>
  new Response("OK", {
    headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
  });
