// Vercel Edge proxy wrapper for cloudflare-worker.js
//
// This keeps the same public routes as the Cloudflare Worker:
//   /__health
//   /text-proxy?url=...
//   /audio-resolve?url=...
//   /audio-proxy?url=...
//
// Use with vercel.json rewrites so the public path stays at the root.

import worker from '../cloudflare-worker.js';

export const config = { runtime: 'edge' };

export default async function handler(request) {
    const url = new URL(request.url);
    const route = String(url.searchParams.get('__route') || '').trim();
    if (!route) {
        return new Response('Missing __route', { status: 400 });
    }

    // Map /api/proxy?__route=audio-proxy&url=... -> /audio-proxy?url=...
    const rewritten = new URL(request.url);
    rewritten.pathname = `/${route.replace(/^\/+/, '')}`;
    rewritten.searchParams.delete('__route');

    const nextRequest = new Request(rewritten.toString(), request);
    return worker.fetch(nextRequest);
}

