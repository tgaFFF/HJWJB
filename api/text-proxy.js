import worker from '../cloudflare-worker.js';

export default async function handler(request) {
    const rewritten = new URL(request.url);
    rewritten.pathname = '/text-proxy';
    return worker.fetch(new Request(rewritten.toString(), request));
}

