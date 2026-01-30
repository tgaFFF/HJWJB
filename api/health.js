import worker from '../cloudflare-worker.js';

// Vercel Function (Fetch API style) wrapper.
// We reuse the same logic from cloudflare-worker.js and just rewrite the pathname.
export default async function handler(request) {
    const rewritten = new URL(request.url);
    rewritten.pathname = '/__health';
    return worker.fetch(new Request(rewritten.toString(), request));
}

