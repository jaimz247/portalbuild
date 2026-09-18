/**
 * Favicon Verification Utility
 * 
 * Verifies that all declared favicon and touch icon files exist in the public directory
 * and resolve cleanly without 404s to ensure zero broken icons across all browsers.
 */

export interface FaviconAsset {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  purpose: string;
}

export const DEFINED_FAVICONS: FaviconAsset[] = [
  {
    rel: 'icon',
    href: '/favicon.svg',
    type: 'image/svg+xml',
    purpose: 'Modern scalable vector icon (Safari 16.4+, Chrome, Firefox)'
  },
  {
    rel: 'icon',
    href: '/favicon-32x32.png',
    type: 'image/png',
    sizes: '32x32',
    purpose: 'Standard high-density desktop browser tab icon'
  },
  {
    rel: 'icon',
    href: '/favicon-16x16.png',
    type: 'image/png',
    sizes: '16x16',
    purpose: 'Legacy desktop browser tab & bookmark icon'
  },
  {
    rel: 'apple-touch-icon',
    href: '/apple-touch-icon.png',
    sizes: '180x180',
    purpose: 'iOS Safari touch icon & PWA home screen icon'
  },
  {
    rel: 'shortcut icon',
    href: '/favicon.ico',
    purpose: 'Legacy IE/Edge, Windows taskbar shortcuts, and bot crawler default'
  }
];

/**
 * Checks all defined favicon assets against the origin to confirm they load successfully.
 */
export async function verifyFaviconsRuntime(): Promise<{
  allExist: boolean;
  results: { href: string; exists: boolean; status?: number }[];
}> {
  if (typeof window === 'undefined') {
    return { allExist: true, results: [] };
  }

  const results = await Promise.all(
    DEFINED_FAVICONS.map(async (asset) => {
      try {
        const response = await fetch(asset.href, { method: 'HEAD' });
        return {
          href: asset.href,
          exists: response.ok,
          status: response.status
        };
      } catch {
        return {
          href: asset.href,
          exists: false,
          status: 0
        };
      }
    })
  );

  const allExist = results.every(r => r.exists);
  return { allExist, results };
}
