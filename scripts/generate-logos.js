import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const logosDir = path.join(process.cwd(), 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// 1. Vector Icon Mark (Square 1024x1024)
const iconMarkSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#ea580c" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="subtleBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#334155" stop-opacity="0.1"/>
    </linearGradient>
    <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Ambient Glow -->
  <circle cx="512" cy="512" r="440" fill="url(#portalGlow)"/>

  <!-- Outer Rounded Squircle Base -->
  <rect x="160" y="160" width="704" height="704" rx="192" fill="#090d16" fill-opacity="0.9" stroke="url(#subtleBorder)" stroke-width="12"/>

  <!-- Outer Geometric Aperture Guides -->
  <rect x="232" y="232" width="560" height="560" rx="140" stroke="#334155" stroke-opacity="0.4" stroke-width="8" stroke-dasharray="16 16"/>

  <!-- Portal Top-Right Aperture Bracket -->
  <path d="M 512 288 L 684 288 C 716 288 736 308 736 340 L 736 512" fill="none" stroke="url(#orangeGrad)" stroke-width="28" stroke-linecap="round"/>

  <!-- Portal Bottom-Left Aperture Bracket -->
  <path d="M 512 736 L 340 736 C 308 736 288 716 288 684 L 288 512" fill="none" stroke="url(#orangeGrad)" stroke-width="28" stroke-linecap="round"/>

  <!-- Complementary Secondary Brackets (Subtle) -->
  <path d="M 512 288 L 340 288 C 308 288 288 308 288 340 L 288 440" fill="none" stroke="#f97316" stroke-opacity="0.3" stroke-width="18" stroke-linecap="round"/>
  <path d="M 512 736 L 684 736 C 716 736 736 716 736 684 L 736 584" fill="none" stroke="#f97316" stroke-opacity="0.3" stroke-width="18" stroke-linecap="round"/>

  <!-- Inner Diamond Frame -->
  <rect x="420" y="420" width="184" height="184" rx="44" transform="rotate(45 512 512)" stroke="#f97316" stroke-opacity="0.6" stroke-width="10" fill="#0f172a"/>

  <!-- Radiant Core Pulse Energy Dot -->
  <circle cx="512" cy="512" r="32" fill="#ffffff" filter="url(#coreGlow)"/>
  <circle cx="512" cy="512" r="20" fill="#fb923c"/>
  <circle cx="512" cy="512" r="10" fill="#ffffff"/>
</svg>
`;

// 2. Full Horizontal Logo (Dark Background, 2000x500)
const fullDarkSvg = `
<svg width="2000" height="500" viewBox="0 0 2000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="portalGlowH" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#ea580c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="orangeGradH" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="textGradH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <filter id="coreGlowH" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Icon Mark Section -->
  <g transform="translate(40, 25)">
    <!-- Ambient Glow -->
    <circle cx="225" cy="225" r="200" fill="url(#portalGlowH)"/>

    <!-- Outer Rounded Squircle Base -->
    <rect x="75" y="75" width="300" height="300" rx="80" fill="#090d16" fill-opacity="0.95" stroke="#ffffff" stroke-opacity="0.2" stroke-width="6"/>

    <!-- Portal Top-Right Aperture Bracket -->
    <path d="M 225 130 L 300 130 C 314 130 325 141 325 155 L 325 225" fill="none" stroke="url(#orangeGradH)" stroke-width="14" stroke-linecap="round"/>

    <!-- Portal Bottom-Left Aperture Bracket -->
    <path d="M 225 320 L 150 320 C 136 320 125 309 125 295 L 125 225" fill="none" stroke="url(#orangeGradH)" stroke-width="14" stroke-linecap="round"/>

    <!-- Secondary Brackets -->
    <path d="M 225 130 L 150 130 C 136 130 125 141 125 155 L 125 190" fill="none" stroke="#f97316" stroke-opacity="0.3" stroke-width="8" stroke-linecap="round"/>
    <path d="M 225 320 L 300 320 C 314 320 325 309 325 295 L 325 260" fill="none" stroke="#f97316" stroke-opacity="0.3" stroke-width="8" stroke-linecap="round"/>

    <!-- Inner Core Dot -->
    <circle cx="225" cy="225" r="14" fill="#ffffff" filter="url(#coreGlowH)"/>
    <circle cx="225" cy="225" r="8" fill="#fb923c"/>
  </g>

  <!-- Typography Section -->
  <text x="490" y="270" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="140" font-weight="900" letter-spacing="-3" fill="url(#textGradH)">Portal<tspan fill="url(#orangeGradH)">Build</tspan></text>

  <text x="496" y="345" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="28" font-weight="700" letter-spacing="12" fill="#94a3b8" fill-opacity="0.9">MEMBER RETENTION PORTALS</text>
</svg>
`;

// 3. Full Horizontal Logo (Light Background, 2000x500)
const fullLightSvg = `
<svg width="2000" height="500" viewBox="0 0 2000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="portalGlowL" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.2"/>
      <stop offset="70%" stop-color="#ea580c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="orangeGradL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
  </defs>

  <!-- Icon Mark Section -->
  <g transform="translate(40, 25)">
    <!-- Ambient Glow -->
    <circle cx="225" cy="225" r="200" fill="url(#portalGlowL)"/>

    <!-- Outer Rounded Squircle Base -->
    <rect x="75" y="75" width="300" height="300" rx="80" fill="#0f172a" stroke="#ea580c" stroke-opacity="0.3" stroke-width="6"/>

    <!-- Portal Top-Right Aperture Bracket -->
    <path d="M 225 130 L 300 130 C 314 130 325 141 325 155 L 325 225" fill="none" stroke="url(#orangeGradL)" stroke-width="14" stroke-linecap="round"/>

    <!-- Portal Bottom-Left Aperture Bracket -->
    <path d="M 225 320 L 150 320 C 136 320 125 309 125 295 L 125 225" fill="none" stroke="url(#orangeGradL)" stroke-width="14" stroke-linecap="round"/>

    <!-- Secondary Brackets -->
    <path d="M 225 130 L 150 130 C 136 130 125 141 125 155 L 125 190" fill="none" stroke="#ea580c" stroke-opacity="0.3" stroke-width="8" stroke-linecap="round"/>
    <path d="M 225 320 L 300 320 C 314 320 325 309 325 295 L 325 260" fill="none" stroke="#ea580c" stroke-opacity="0.3" stroke-width="8" stroke-linecap="round"/>

    <!-- Inner Core Dot -->
    <circle cx="225" cy="225" r="12" fill="#ffffff"/>
    <circle cx="225" cy="225" r="7" fill="#ea580c"/>
  </g>

  <!-- Typography Section -->
  <text x="490" y="270" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="140" font-weight="900" letter-spacing="-3" fill="#0f172a">Portal<tspan fill="url(#orangeGradL)">Build</tspan></text>

  <text x="496" y="345" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="28" font-weight="700" letter-spacing="12" fill="#475569">MEMBER RETENTION PORTALS</text>
</svg>
`;

// 4. App Badge / Icon with solid luxury background (1024x1024)
const appBadgeSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="badgeBgGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="portalGlowB" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.45"/>
      <stop offset="70%" stop-color="#ea580c" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="orangeGradB" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <filter id="coreGlowB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Container Box -->
  <rect width="1024" height="1024" rx="240" fill="url(#badgeBgGlow)"/>
  <rect x="8" y="8" width="1008" height="1008" rx="232" stroke="#334155" stroke-width="16" stroke-opacity="0.6"/>

  <!-- Ambient Glow -->
  <circle cx="512" cy="460" r="360" fill="url(#portalGlowB)"/>

  <!-- Center Icon Frame -->
  <rect x="232" y="180" width="560" height="560" rx="150" fill="#090d16" stroke="#ffffff" stroke-opacity="0.15" stroke-width="10"/>

  <!-- Aperture Brackets -->
  <path d="M 512 280 L 650 280 C 674 280 692 298 692 322 L 692 460" fill="none" stroke="url(#orangeGradB)" stroke-width="24" stroke-linecap="round"/>
  <path d="M 512 640 L 374 640 C 350 640 332 622 332 598 L 332 460" fill="none" stroke="url(#orangeGradB)" stroke-width="24" stroke-linecap="round"/>

  <path d="M 512 280 L 374 280 C 350 280 332 298 332 322 L 332 390" fill="none" stroke="#f97316" stroke-opacity="0.3" stroke-width="14" stroke-linecap="round"/>
  <path d="M 512 640 L 650 640 C 674 640 692 622 692 598 L 692 530" fill="none" stroke="#f97316" stroke-opacity="0.3" stroke-width="14" stroke-linecap="round"/>

  <!-- Inner Glowing Center Core -->
  <circle cx="512" cy="460" r="26" fill="#ffffff" filter="url(#coreGlowB)"/>
  <circle cx="512" cy="460" r="16" fill="#fb923c"/>
  <circle cx="512" cy="460" r="8" fill="#ffffff"/>

  <!-- Badge Bottom Brand Text -->
  <text x="512" y="850" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="900" letter-spacing="-2" fill="#ffffff" text-anchor="middle">Portal<tspan fill="url(#orangeGradB)">Build</tspan></text>
</svg>
`;

async function generateAllLogos() {
  console.log('Writing vector SVGs...');
  fs.writeFileSync(path.join(logosDir, 'portalbuild-icon.svg'), iconMarkSvg);
  fs.writeFileSync(path.join(logosDir, 'portalbuild-logo-dark.svg'), fullDarkSvg);
  fs.writeFileSync(path.join(logosDir, 'portalbuild-logo-light.svg'), fullLightSvg);
  fs.writeFileSync(path.join(logosDir, 'portalbuild-badge.svg'), appBadgeSvg);

  console.log('Rendering High-Res PNGs & WebP...');

  // 1. Icon Mark PNGs (Transparent background)
  const iconBuf = Buffer.from(iconMarkSvg);
  await sharp(iconBuf).resize(2048, 2048).png().toFile(path.join(logosDir, 'portalbuild-icon-2048.png'));
  await sharp(iconBuf).resize(1024, 1024).png().toFile(path.join(logosDir, 'portalbuild-icon-1024.png'));
  await sharp(iconBuf).resize(512, 512).png().toFile(path.join(logosDir, 'portalbuild-icon-512.png'));
  await sharp(iconBuf).resize(256, 256).png().toFile(path.join(logosDir, 'portalbuild-icon-256.png'));
  await sharp(iconBuf).resize(64, 64).png().toFile(path.join(logosDir, 'favicon.png'));
  await sharp(iconBuf).resize(180, 180).png().toFile(path.join(logosDir, 'apple-touch-icon.png'));

  // Also copy favicon.png to /public for browser tab
  fs.copyFileSync(path.join(logosDir, 'favicon.png'), path.join(process.cwd(), 'public', 'favicon.png'));

  // 2. Full Horizontal Dark Logo PNGs (Transparent background)
  const fullDarkBuf = Buffer.from(fullDarkSvg);
  await sharp(fullDarkBuf).resize(2000, 500).png().toFile(path.join(logosDir, 'portalbuild-logo-dark-2000.png'));
  await sharp(fullDarkBuf).resize(1000, 250).png().toFile(path.join(logosDir, 'portalbuild-logo-dark-1000.png'));
  await sharp(fullDarkBuf).resize(600, 150).png().toFile(path.join(logosDir, 'portalbuild-logo-dark-600.png'));

  // 3. Full Horizontal Light Logo PNGs (Transparent background)
  const fullLightBuf = Buffer.from(fullLightSvg);
  await sharp(fullLightBuf).resize(2000, 500).png().toFile(path.join(logosDir, 'portalbuild-logo-light-2000.png'));
  await sharp(fullLightBuf).resize(1000, 250).png().toFile(path.join(logosDir, 'portalbuild-logo-light-1000.png'));
  await sharp(fullLightBuf).resize(600, 150).png().toFile(path.join(logosDir, 'portalbuild-logo-light-600.png'));

  // 4. App Badge PNGs (Solid dark background)
  const badgeBuf = Buffer.from(appBadgeSvg);
  await sharp(badgeBuf).resize(1024, 1024).png().toFile(path.join(logosDir, 'portalbuild-badge-1024.png'));
  await sharp(badgeBuf).resize(512, 512).png().toFile(path.join(logosDir, 'portalbuild-badge-512.png'));

  console.log('All logo assets generated successfully in /public/logos!');
}

generateAllLogos().catch(console.error);
