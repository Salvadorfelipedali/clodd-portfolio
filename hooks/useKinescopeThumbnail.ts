'use client';

import { useState, useEffect } from 'react';

const CANDIDATES = (id: string) => [
  `https://kinescope.io/${id}/thumbnail.jpg`,
  `https://api.kinescope.io/v1/video/${id}/thumbnail`,
];

function testUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export function useKinescopeThumbnail(kinescopeId: string | undefined): string {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!kinescopeId) return;

    let cancelled = false;

    async function resolve() {
      // Try static candidates first (no network overhead)
      for (const candidate of CANDIDATES(kinescopeId!)) {
        const ok = await testUrl(candidate);
        if (cancelled) return;
        if (ok) {
          setUrl(candidate);
          return;
        }
      }

      // Fall back to oEmbed API via our proxy (avoids CORS)
      try {
        const res = await fetch(`/api/kinescope-thumb?id=${kinescopeId}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.url) setUrl(data.url);
        }
      } catch {
        // leave url empty — gradient fallback shows
      }
    }

    resolve();
    return () => { cancelled = true; };
  }, [kinescopeId]);

  return url;
}
