import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicImagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// -------------------------------------------------------------
// 1. HERO SAMPLE PORTAL SVG GENERATOR
// -------------------------------------------------------------
function generateHeroPortalSvg({
  mode = 'dark',
  brandName = 'Harbourline',
  brandInitials = 'HI',
  cohortTag = 'EXECUTIVE COHORT 4',
  tagline = 'A 10-week program for senior managers stepping into executive roles',
  domain = 'leadership.cohortroom.com',
  accentColor = '#ea580c',
  accentLight = '#fb923c',
  accentBadgeBg = 'rgba(234, 88, 12, 0.15)',
  accentBadgeBorder = 'rgba(234, 88, 12, 0.4)',
  memberName = 'Priya Raman',
  memberInitials = 'PR',
  memberRole = 'VP Operations · Pod B Lead',
  welcomeHeadline = 'Welcome back, Priya',
  currentModule = 'Module 4: Strategic Prioritization & Executive Influence',
  weekBadge = 'WEEK 4 OF 10 · LIVE',
  stat1Title = 'CURRICULUM PROGRESS',
  stat1Val = '70%',
  stat1Sub = '4 of 10 modules completed · On Pace',
  stat1Progress = 0.70,
  stat2Title = 'NEXT LIVE MASTERMIND',
  stat2Val = 'Thu @ 11:00 AM ET',
  stat2Sub = 'Strategic Prioritization Hall',
  stat3Title = 'PEER REVIEW SCORE',
  stat3Val = '9.4',
  stat3Max = '/10',
  stat3Sub = '⭐ Top Rated in Executive Pod B',
  action1Title = '1. Strategic Decision Matrix & Executive Trade-Off Worksheet',
  action1Sub = 'Module 4 Core Deliverable · Submitted yesterday at 4:18 PM',
  action1Status = 'Submitted',
  action2Title = '2. 360 Stakeholder Feedback Assessment Upload',
  action2Sub = '● Due in 2 days (Thursday midnight) · In Progress',
  action2Status = 'In Progress',
  action3Title = '3. Leadership Pod B Peer Coaching Synthesis',
  action3Sub = 'Unlocks after Thursday live session concludes',
  action3Status = 'Locked',
}) {
  const isLight = mode === 'light';

  // Palette definitions
  const bgMain = isLight ? '#f8fafc' : '#030712';
  const bgGrad1 = isLight ? '#f1f5f9' : '#060913';
  const bgGrad2 = isLight ? '#ffffff' : '#020408';
  const chromeBg = isLight ? '#ffffff' : '#0b0f19';
  const chromeBorder = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';
  const urlBg = isLight ? '#f1f5f9' : '#03060f';
  const urlBorder = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)';
  const urlText = isLight ? '#0f172a' : '#f8fafc';
  const urlSubText = isLight ? '#64748b' : '#94a3b8';

  const cardBg = isLight ? '#ffffff' : '#0a0f1d';
  const cardBorder = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';
  const cardShadow = isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(0, 0, 0, 0.5)';

  const textPrimary = isLight ? '#0f172a' : '#ffffff';
  const textSecondary = isLight ? '#475569' : '#cbd5e1';
  const textMuted = isLight ? '#64748b' : '#94a3b8';
  const textSubtle = isLight ? '#94a3b8' : '#64748b';

  const innerItemBg = isLight ? '#f8fafc' : '#050813';
  const innerItemBorder = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.06)';

  const bannerBgStart = isLight ? '#ffffff' : '#141824';
  const bannerBgEnd = isLight ? '#fff7ed' : '#0d111d';

  const roleBadge = memberRole.includes('·') ? memberRole.split('·')[1].trim() : memberRole;

  return `
<svg width="2400" height="1350" viewBox="0 0 2400 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad_${mode}_${brandInitials}" x1="0" y1="0" x2="2400" y2="1350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${bgGrad1}"/>
      <stop offset="50%" stop-color="${bgMain}"/>
      <stop offset="100%" stop-color="${bgGrad2}"/>
    </linearGradient>

    <radialGradient id="ambientGlow_${mode}_${brandInitials}" cx="85%" cy="15%" r="55%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="${isLight ? '0.12' : '0.22'}"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="subtleBlue_${mode}_${brandInitials}" cx="10%" cy="90%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="${isLight ? '0.06' : '0.10'}"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="bannerGrad_${mode}_${brandInitials}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bannerBgStart}"/>
      <stop offset="100%" stop-color="${bannerBgEnd}"/>
    </linearGradient>

    <linearGradient id="accentBarGrad_${mode}_${brandInitials}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accentLight}"/>
      <stop offset="100%" stop-color="${accentColor}"/>
    </linearGradient>

    
  </defs>

  <!-- Background Base -->
  <rect width="2400" height="1350" fill="url(#bgGrad_${mode}_${brandInitials})"/>
  <rect width="2400" height="1350" fill="url(#ambientGlow_${mode}_${brandInitials})"/>
  <rect width="2400" height="1350" fill="url(#subtleBlue_${mode}_${brandInitials})"/>

  <!-- Top Browser Chrome Bar -->
  <rect x="0" y="0" width="2400" height="96" fill="${chromeBg}"/>
  <line x1="0" y1="96" x2="2400" y2="96" stroke="${chromeBorder}" stroke-width="1.5"/>

  <!-- Window Traffic Lights -->
  <circle cx="64" cy="48" r="13" fill="#f43f5e" fill-opacity="0.9"/>
  <circle cx="104" cy="48" r="13" fill="#f59e0b" fill-opacity="0.9"/>
  <circle cx="144" cy="48" r="13" fill="#10b981" fill-opacity="0.9"/>

  <!-- Center Active URL Bar -->
  <rect x="700" y="24" width="1000" height="48" rx="10" fill="${urlBg}" stroke="${urlBorder}" stroke-width="1.5"/>
  <circle cx="730" cy="48" r="6" fill="#10b981"/>
  <text x="752" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="500" fill="${urlSubText}" letter-spacing="0.2">
    https://<tspan fill="${urlText}" font-weight="700">${esc(domain)}</tspan>
  </text>

  <!-- Right Live Badge -->
  <rect x="1980" y="24" width="370" height="48" rx="10" fill="${accentBadgeBg}" stroke="${accentBadgeBorder}" stroke-width="1.5"/>
  <circle cx="2010" cy="48" r="6" fill="${accentColor}"/>
  <text x="2030" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="15" font-weight="800" fill="${accentColor}" letter-spacing="1">
    LIVE PORTAL · ${esc(brandInitials)}
  </text>

  <!-- Left Sidebar Navigation Rail -->
  <g transform="translate(48, 136)">
    <rect width="480" height="1166" rx="20" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
    
    <!-- Brand Lockup -->
    <rect x="32" y="36" width="68" height="68" rx="16" fill="${accentColor}"/>
    <text x="66" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">${esc(brandInitials)}</text>
    
    <text x="120" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="800" fill="${textPrimary}" letter-spacing="-0.5">${esc(brandName)}</text>
    <text x="120" y="94" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="13" font-weight="700" fill="${accentColor}" letter-spacing="0.5">${esc(cohortTag)}</text>

    <!-- Nav Items -->
    <!-- Item 1: Active -->
    <rect x="24" y="148" width="432" height="64" rx="12" fill="${accentBadgeBg}" stroke="${accentBadgeBorder}" stroke-width="1.5"/>
    <rect x="42" y="168" width="24" height="24" rx="6" fill="${accentColor}"/>
    <text x="82" y="188" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="${accentColor}">Cohort Hub &amp; Home</text>

    <!-- Item 2 -->
    <rect x="24" y="228" width="432" height="64" rx="12" fill="transparent"/>
    <text x="82" y="268" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="${textMuted}">Curriculum Modules</text>

    <!-- Item 3 -->
    <rect x="24" y="308" width="432" height="64" rx="12" fill="transparent"/>
    <text x="82" y="348" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="${textMuted}">Peer Pods &amp; Mastermind</text>

    <!-- Item 4 -->
    <rect x="24" y="388" width="432" height="64" rx="12" fill="transparent"/>
    <text x="82" y="428" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="${textMuted}">Live Sessions &amp; Replays</text>

    <!-- Item 5 -->
    <rect x="24" y="468" width="432" height="64" rx="12" fill="transparent"/>
    <text x="82" y="508" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="${textMuted}">Resource Vault &amp; SOPs</text>

    <!-- Bottom Member Profile Card -->
    <rect x="24" y="1030" width="432" height="106" rx="16" fill="${innerItemBg}" stroke="${innerItemBorder}" stroke-width="1.5"/>
    <circle cx="76" cy="1083" r="32" fill="${accentBadgeBg}" stroke="${accentColor}" stroke-width="2"/>
    <text x="76" y="1092" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="${accentColor}" text-anchor="middle">${esc(memberInitials)}</text>
    <text x="124" y="1075" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="${textPrimary}">${esc(memberName)}</text>
    <text x="124" y="1103" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="${textMuted}">${esc(memberRole)}</text>
  </g>

  <!-- Main Content Stage -->
  <g transform="translate(568, 136)">
    <!-- Welcome Hero Banner -->
    <rect width="1784" height="280" rx="20" fill="url(#bannerGrad_${mode}_${brandInitials})" stroke="${isLight ? '#e2e8f0' : accentColor}" stroke-opacity="${isLight ? '1' : '0.4'}" stroke-width="1.5" />
    
    <!-- Week Tag -->
    <rect x="48" y="40" width="240" height="36" rx="8" fill="${accentBadgeBg}" stroke="${accentBadgeBorder}" stroke-width="1.5"/>
    <text x="168" y="64" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="14" font-weight="800" fill="${accentColor}" text-anchor="middle" letter-spacing="1">${esc(weekBadge)}</text>

    <text x="48" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" fill="${textPrimary}" letter-spacing="-1">${esc(welcomeHeadline)}</text>
    <text x="48" y="186" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="600" fill="${textSecondary}">${esc(currentModule)}</text>

    <!-- Status Badges -->
    <rect x="48" y="216" width="310" height="40" rx="20" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1.5"/>
    <circle cx="70" cy="236" r="6" fill="#10b981"/>
    <text x="86" y="242" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#10b981">Active Member · On Track</text>

    <rect x="376" y="216" width="280" height="40" rx="20" fill="rgba(59, 130, 246, 0.12)" stroke="rgba(59, 130, 246, 0.35)" stroke-width="1.5"/>
    <text x="516" y="242" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#3b82f6" text-anchor="middle">${esc(roleBadge)}</text>

    <!-- Quick Action Launch Button -->
    <rect x="1390" y="96" width="344" height="78" rx="16" fill="${accentColor}" />
    <text x="1562" y="145" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">Join Live Room ↗</text>

    <!-- 3 Metrics Bento Cards -->
    <!-- Metric 1: Stat 1 -->
    <g transform="translate(0, 316)">
      <rect width="568" height="236" rx="18" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
      <text x="40" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="15" font-weight="800" fill="${textMuted}" letter-spacing="1">${esc(stat1Title)}</text>
      <text x="40" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="68" font-weight="900" fill="${accentColor}">${esc(stat1Val)}</text>
      
      <!-- Progress Bar Track -->
      <rect x="40" y="160" width="488" height="16" rx="8" fill="${isLight ? '#e2e8f0' : '#1e293b'}"/>
      <rect x="40" y="160" width="${Math.round(488 * stat1Progress)}" height="16" rx="8" fill="url(#accentBarGrad_${mode}_${brandInitials})"/>
      <text x="40" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="${textSubtle}">${esc(stat1Sub)}</text>
    </g>

    <!-- Metric 2: Stat 2 -->
    <g transform="translate(608, 316)">
      <rect width="568" height="236" rx="18" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
      <text x="40" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="15" font-weight="800" fill="${textMuted}" letter-spacing="1">${esc(stat2Title)}</text>
      <text x="40" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#10b981">${esc(stat2Val)}</text>
      <text x="40" y="156" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="${textPrimary}">${esc(stat2Sub.split('·')[0])}</text>
      
      <rect x="40" y="180" width="270" height="34" rx="8" fill="${innerItemBg}" stroke="${innerItemBorder}" stroke-width="1"/>
      <circle cx="56" cy="197" r="5" fill="#10b981"/>
      <text x="70" y="203" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="${textMuted}">Cal Sync &amp; Replay Archive</text>
    </g>

    <!-- Metric 3: Stat 3 -->
    <g transform="translate(1216, 316)">
      <rect width="568" height="236" rx="18" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
      <text x="40" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="15" font-weight="800" fill="${textMuted}" letter-spacing="1">${esc(stat3Title)}</text>
      <text x="40" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="68" font-weight="900" fill="${textPrimary}">
        ${esc(stat3Val)}<tspan font-size="36" fill="${textMuted}">${esc(stat3Max || '')}</tspan>
      </text>
      
      <rect x="40" y="180" width="360" height="34" rx="8" fill="${accentBadgeBg}" stroke="${accentBadgeBorder}" stroke-width="1"/>
      <text x="220" y="202" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="${accentColor}" text-anchor="middle">${esc(stat3Sub)}</text>
    </g>

    <!-- Action Items & Deliverables Section -->
    <g transform="translate(0, 588)">
      <rect width="1784" height="578" rx="20" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
      
      <text x="48" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="${textPrimary}">Current Action Items &amp; Deliverables</text>
      <text x="48" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="${textMuted}">Submitted deliverables clear directly to your operator retention radar in real time.</text>

      <!-- Deliverable 1 -->
      <g transform="translate(48, 122)">
        <rect width="1688" height="106" rx="14" fill="${innerItemBg}" stroke="${innerItemBorder}" stroke-width="1.5"/>
        <circle cx="50" cy="53" r="22" fill="rgba(16, 185, 129, 0.15)"/>
        <text x="50" y="61" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#10b981" text-anchor="middle">✓</text>
        
        <text x="96" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="700" fill="${textPrimary}">${esc(action1Title)}</text>
        <text x="96" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="${textSubtle}">${esc(action1Sub)}</text>
        
        <rect x="1490" y="30" width="160" height="46" rx="10" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5"/>
        <text x="1570" y="59" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#10b981" text-anchor="middle">${esc(action1Status)}</text>
      </g>

      <!-- Deliverable 2 -->
      <g transform="translate(48, 248)">
        <rect width="1688" height="106" rx="14" fill="${innerItemBg}" stroke="${accentBadgeBorder}" stroke-width="1.5"/>
        <circle cx="50" cy="53" r="22" fill="${accentBadgeBg}"/>
        <text x="50" y="61" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="${accentColor}" text-anchor="middle">⏳</text>
        
        <text x="96" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="700" fill="${textPrimary}">${esc(action2Title)}</text>
        <text x="96" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="${accentColor}">${esc(action2Sub)}</text>
        
        <rect x="1490" y="30" width="160" height="46" rx="10" fill="${accentBadgeBg}" stroke="${accentColor}" stroke-width="1.5"/>
        <text x="1570" y="59" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="${accentColor}" text-anchor="middle">${esc(action2Status)}</text>
      </g>

      <!-- Deliverable 3 -->
      <g transform="translate(48, 374)">
        <rect width="1688" height="106" rx="14" fill="${innerItemBg}" stroke="${innerItemBorder}" stroke-width="1.5"/>
        <circle cx="50" cy="53" r="22" fill="${isLight ? '#e2e8f0' : '#1e293b'}"/>
        <text x="50" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="${textMuted}" text-anchor="middle">🔒</text>
        
        <text x="96" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="700" fill="${textMuted}">${esc(action3Title)}</text>
        <text x="96" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="${textSubtle}">${esc(action3Sub)}</text>
        
        <rect x="1490" y="30" width="160" height="46" rx="10" fill="${isLight ? '#f1f5f9' : '#1e293b'}" stroke="${innerItemBorder}" stroke-width="1"/>
        <text x="1570" y="59" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="${textMuted}" text-anchor="middle">${esc(action3Status)}</text>
      </g>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 2. OPERATOR RADAR COCKPIT SVG GENERATOR
// -------------------------------------------------------------
function generateOperatorRadarSvg({ mode = 'dark' }) {
  const isLight = mode === 'light';

  const bgGrad1 = isLight ? '#f8fafc' : '#080c16';
  const bgGrad2 = isLight ? '#f1f5f9' : '#04070e';
  const cardBg = isLight ? '#ffffff' : '#0b101d';
  const cardBorder = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';
  const innerBg = isLight ? '#f8fafc' : '#070a13';
  const innerBorder = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.06)';

  const textPrimary = isLight ? '#0f172a' : '#ffffff';
  const textSecondary = isLight ? '#334155' : '#cbd5e1';
  const textMuted = isLight ? '#64748b' : '#94a3b8';
  const textSubtle = isLight ? '#94a3b8' : '#64748b';
  const cardShadow = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(0, 0, 0, 0.5)';

  return `
<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="opBg_${mode}" x1="0" y1="0" x2="1600" y2="1000" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${bgGrad1}"/>
      <stop offset="100%" stop-color="${bgGrad2}"/>
    </linearGradient>

    <radialGradient id="opGlow_${mode}" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="${isLight ? '0.1' : '0.18'}"/>
      <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>

    
  </defs>

  <rect width="1600" height="1000" fill="url(#opBg_${mode})"/>
  <rect width="1600" height="1000" fill="url(#opGlow_${mode})"/>

  <!-- Top Console Header Bar -->
  <g transform="translate(40, 36)">
    <rect width="1520" height="100" rx="16" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
    
    <circle cx="56" cy="50" r="10" fill="rgba(16, 185, 129, 0.2)"/>
    <circle cx="56" cy="50" r="5" fill="#10b981"/>
    
    <text x="82" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="${textPrimary}">
      Cohort Operator Radar · Real-Time Intervention Cockpit
    </text>
    <text x="82" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="14" font-weight="600" fill="${textMuted}">
      Monitoring 3 Live Cohorts · 66 Active Executives &amp; Founders · Week 3 Retention Radar
    </text>

    <!-- Top Status Badges -->
    <rect x="1080" y="32" width="180" height="38" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
    <circle cx="1102" cy="51" r="4" fill="#10b981"/>
    <text x="1116" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#10b981">64 On Track</text>

    <rect x="1280" y="32" width="200" height="38" rx="8" fill="rgba(244, 63, 94, 0.15)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1.5"/>
    <text x="1380" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f43f5e" text-anchor="middle">⚠️ 2 Flagged at Risk</text>
  </g>

  <!-- 3 Metrics KPI Cards -->
  <!-- KPI 1 -->
  <g transform="translate(40, 160)">
    <rect width="480" height="170" rx="16" fill="${cardBg}" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.5" />
    <text x="36" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="14" font-weight="700" fill="${textMuted}" letter-spacing="1">ACTIVE COHORT RETENTION</text>
    <text x="36" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="54" font-weight="900" fill="#10b981">94.2%</text>
    <text x="36" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="${textSubtle}">+4.2% higher retention vs historic baseline</text>
  </g>

  <!-- KPI 2 -->
  <g transform="translate(560, 160)">
    <rect width="480" height="170" rx="16" fill="${cardBg}" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1.5" />
    <text x="36" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="14" font-weight="700" fill="${textMuted}" letter-spacing="1">DELIVERABLE VELOCITY</text>
    <text x="36" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="54" font-weight="900" fill="#f59e0b">8.8<tspan font-size="28" fill="${textMuted}">/10</tspan></text>
    <text x="36" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="${textSubtle}">88% of core worksheets submitted on schedule</text>
  </g>

  <!-- KPI 3 -->
  <g transform="translate(1080, 160)">
    <rect width="480" height="170" rx="16" fill="${cardBg}" stroke="rgba(244, 63, 94, 0.35)" stroke-width="1.5" />
    <text x="36" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="14" font-weight="700" fill="${textMuted}" letter-spacing="1">INTERVENTIONS DRAFTED</text>
    <text x="36" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="54" font-weight="900" fill="#f43f5e">2 <tspan font-size="22" font-weight="700" fill="#f43f5e">Ready to Dispatch</tspan></text>
    <text x="36" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="${textSubtle}">Auto-flagged before drop-off window</text>
  </g>

  <!-- Flagged Members Ledger Container -->
  <g transform="translate(40, 354)">
    <rect width="1520" height="606" rx="18" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
    
    <text x="40" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="${textPrimary}">Automated Operator Health Alerts (Week 3 Inactivity Flags)</text>
    <text x="40" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="${textMuted}">The system continuously analyzes LMS telemetry, attendance, assignment velocity, and pod participation.</text>

    <!-- Alert Row 1: High Priority Flag -->
    <g transform="translate(40, 110)">
      <rect width="1440" height="136" rx="14" fill="${isLight ? '#fff1f2' : '#140a10'}" stroke="#f43f5e" stroke-opacity="0.5" stroke-width="1.5"/>
      <circle cx="68" cy="68" r="34" fill="rgba(244, 63, 94, 0.18)" stroke="#f43f5e" stroke-width="2"/>
      <text x="68" y="77" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#f43f5e" text-anchor="middle">MT</text>
      
      <text x="124" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="${textPrimary}">Marcus Thorne</text>
      <text x="124" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="${textMuted}">Harbourline Institute · VP Product · Inactivity threshold exceeded</text>
      
      <!-- Flag Badge -->
      <rect x="640" y="48" width="450" height="42" rx="8" fill="rgba(244, 63, 94, 0.15)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1"/>
      <text x="660" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#f43f5e">⚠️ Inactive 5 days · Missed 360 Stakeholder Upload</text>

      <!-- Action Button -->
      <rect x="1170" y="44" width="234" height="48" rx="10" fill="#ea580c"/>
      <text x="1287" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">Send Check-in DM ↗</text>
    </g>

    <!-- Alert Row 2: Medium Priority Nudge -->
    <g transform="translate(40, 268)">
      <rect width="1440" height="136" rx="14" fill="${isLight ? '#fffbeb' : '#131008'}" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1.5"/>
      <circle cx="68" cy="68" r="34" fill="rgba(245, 158, 11, 0.18)" stroke="#f59e0b" stroke-width="2"/>
      <text x="68" y="77" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#f59e0b" text-anchor="middle">ER</text>
      
      <text x="124" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="${textPrimary}">Elena Rostova</text>
      <text x="124" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="${textMuted}">Aldermoor Coaching · Dir. People · Missed Mentor Session</text>
      
      <!-- Flag Badge -->
      <rect x="640" y="48" width="450" height="42" rx="8" fill="rgba(245, 158, 11, 0.15)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1"/>
      <text x="660" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#f59e0b">⚡ Module 3 video unopened · Missed Office Hours</text>

      <!-- Action Button -->
      <rect x="1170" y="44" width="234" height="48" rx="10" fill="${isLight ? '#0f172a' : '#1e293b'}" stroke="${cardBorder}" stroke-width="1"/>
      <text x="1287" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">Nudge Member</text>
    </g>

    <!-- Alert Row 3: High Performer -->
    <g transform="translate(40, 426)">
      <rect width="1440" height="136" rx="14" fill="${isLight ? '#f0fdf4' : '#08140f'}" stroke="#10b981" stroke-opacity="0.35" stroke-width="1.5"/>
      <circle cx="68" cy="68" r="34" fill="rgba(16, 185, 129, 0.18)" stroke="#10b981" stroke-width="2"/>
      <text x="68" y="77" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#10b981" text-anchor="middle">PR</text>
      
      <text x="124" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="${textPrimary}">Priya Raman</text>
      <text x="124" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="${textMuted}">Northline Collective · Pod Lead · 100% Attendance</text>
      
      <!-- Flag Badge -->
      <rect x="640" y="48" width="450" height="42" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
      <text x="660" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#10b981">✓ All deliverables submitted early · 9.4 Peer Score</text>

      <!-- Action Button -->
      <rect x="1170" y="44" width="234" height="48" rx="10" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1"/>
      <text x="1287" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#10b981" text-anchor="middle">⭐ Star Performer</text>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// MAIN BATCH BUILD PROCESS
// -------------------------------------------------------------
async function buildAssets() {
  console.log('Generating high-resolution sample assets with Sharp...');

  const samples = [
    {
      id: 'harbourline',
      options: {
        brandName: 'Harbourline Institute',
        brandInitials: 'HI',
        cohortTag: 'EXECUTIVE LEADERSHIP · COHORT 4',
        domain: 'leadership.cohortroom.com',
        accentColor: '#ea580c',
        accentLight: '#fb923c',
        accentBadgeBg: 'rgba(234, 88, 12, 0.15)',
        accentBadgeBorder: 'rgba(234, 88, 12, 0.4)',
        memberName: 'Priya Raman',
        memberInitials: 'PR',
        memberRole: 'VP Operations · Pod B Lead',
        welcomeHeadline: 'Welcome back, Priya',
        currentModule: 'Module 4: Strategic Prioritization & Executive Influence',
        weekBadge: 'WEEK 4 OF 10 · LIVE',
        stat1Title: 'CURRICULUM PROGRESS',
        stat1Val: '70%',
        stat1Sub: '4 of 10 modules completed · On Pace',
        stat1Progress: 0.70,
        stat2Title: 'NEXT LIVE MASTERMIND',
        stat2Val: 'Thu @ 11:00 AM ET',
        stat2Sub: 'Strategic Prioritization Hall',
        stat3Title: 'PEER REVIEW SCORE',
        stat3Val: '9.4',
        stat3Max: '/10',
        stat3Sub: '⭐ Top Rated in Executive Pod B',
        action1Title: '1. Strategic Decision Matrix & Executive Trade-Off Worksheet',
        action1Sub: 'Module 4 Core Deliverable · Submitted yesterday at 4:18 PM',
        action1Status: 'Submitted',
        action2Title: '2. 360 Stakeholder Feedback Assessment Upload',
        action2Sub: '● Due in 2 days (Thursday midnight) · In Progress',
        action2Status: 'In Progress',
        action3Title: '3. Leadership Pod B Peer Coaching Synthesis',
        action3Sub: 'Unlocks after Thursday live session concludes',
        action3Status: 'Locked',
      },
    },
    {
      id: 'aldermoor',
      options: {
        brandName: 'Aldermoor Coaching',
        brandInitials: 'ACI',
        cohortTag: 'ICF CREDENTIAL PATHWAY · COHORT 14',
        domain: 'certification.cohortroom.com',
        accentColor: '#059669',
        accentLight: '#34d399',
        accentBadgeBg: 'rgba(5, 150, 105, 0.15)',
        accentBadgeBorder: 'rgba(5, 150, 105, 0.4)',
        memberName: 'Rachel Kim',
        memberInitials: 'RK',
        memberRole: 'PCC Candidate · VP People',
        welcomeHeadline: 'Welcome back, Rachel',
        currentModule: 'Module 5: Building Your Coaching Practice & Client Acquisition',
        weekBadge: 'WEEK 15 OF 30 · LIVE',
        stat1Title: 'ICF PCC READINESS',
        stat1Val: '34%',
        stat1Sub: 'Training: 68/125 hrs · Evaluation: 72%',
        stat1Progress: 0.34,
        stat2Title: 'GROUP MENTORING',
        stat2Val: 'Tue @ 12:00 PM ET',
        stat2Sub: 'With Tom Whitaker, PCC',
        stat3Title: 'COACHING HOURS LOGGED',
        stat3Val: '212',
        stat3Max: ' / 500h',
        stat3Sub: '✓ On Pace · 9.5 hrs/week logged',
        action1Title: '1. Recorded Client Coaching Audio Submission (Evaluation #3)',
        action1Sub: 'PCC Competency Core Marker · Submitted yesterday at 2:30 PM',
        action1Status: 'Submitted',
        action2Title: '2. ICF Core Competency Reflection Log #14',
        action2Sub: '● Due in 3 days (Friday 5:00 PM) · In Progress',
        action2Status: 'In Progress',
        action3Title: '3. Triad Peer Practice Session with Mentor Observation',
        action3Sub: 'Unlocks after Tuesday mentor session concludes',
        action3Status: 'Locked',
      },
    },
    {
      id: 'northline',
      options: {
        brandName: 'Northline Collective',
        brandInitials: 'NC',
        cohortTag: 'AGENCY MASTERMIND · COHORT 6',
        domain: 'agency.cohortroom.com',
        accentColor: '#6366f1',
        accentLight: '#818cf8',
        accentBadgeBg: 'rgba(99, 102, 241, 0.15)',
        accentBadgeBorder: 'rgba(99, 102, 241, 0.4)',
        memberName: 'Nate Calloway',
        memberInitials: 'NC',
        memberRole: 'Founder & CEO · Pod B Lead',
        welcomeHeadline: 'Welcome back, Nate',
        currentModule: 'Week 4: Delegation Systems, Margin Health & Hiring Matrix',
        weekBadge: 'WEEK 4 OF 16 · LIVE',
        stat1Title: 'MONTHLY RECURRING REVENUE',
        stat1Val: '$47K',
        stat1Sub: '+38% growth since program onboarding',
        stat1Progress: 0.85,
        stat2Title: 'NEXT MASTERMIND SPRINT',
        stat2Val: 'Wed @ 12:00 PM ET',
        stat2Sub: 'Agency War Room & Hotseat',
        stat3Title: 'AGENCY MARGIN HEALTH',
        stat3Val: '44%',
        stat3Max: '',
        stat3Sub: '⭐ Up 11% from Baseline Audit',
        action1Title: '1. Operator-to-Owner Delegation Audit & Org Chart',
        action1Sub: 'Week 4 Core Sprint · Submitted Wednesday at 11:20 AM',
        action1Status: 'Submitted',
        action2Title: '2. Client Profitability Scorecard & Margin Matrix',
        action2Sub: '● Due in 2 days (Thursday midnight) · In Progress',
        action2Status: 'In Progress',
        action3Title: '3. Key Executive Hire Spec & Compensation Model',
        action3Sub: 'Unlocks after Wednesday live war room sprint',
        action3Status: 'Locked',
      },
    },
  ];

  for (const sample of samples) {
    for (const mode of ['dark', 'light']) {
      const svgContent = generateHeroPortalSvg({ mode, ...sample.options });
      const buffer = Buffer.from(svgContent);

      const filenameBase = `hero-${sample.id}-${mode}`;
      await sharp(buffer)
        .resize(1200, 675)
        .webp({ quality: 90 })
        .toFile(path.join(publicImagesDir, `${filenameBase}.webp`));

      await sharp(buffer)
        .resize(2400, 1350)
        .webp({ quality: 92 })
        .toFile(path.join(publicImagesDir, `${filenameBase}-2x.webp`));

      console.log(`Generated ${filenameBase}.webp and @2x`);

      // If it's harbourline dark, also update the default hero-portal.webp
      if (sample.id === 'harbourline' && mode === 'dark') {
        await sharp(buffer)
          .resize(1200, 675)
          .webp({ quality: 90 })
          .toFile(path.join(publicImagesDir, 'hero-portal.webp'));

        await sharp(buffer)
          .resize(2400, 1350)
          .webp({ quality: 92 })
          .toFile(path.join(publicImagesDir, 'hero-portal-2x.webp'));

        console.log('Updated legacy hero-portal.webp and @2x');
      }
    }
  }

  // Generate Operator Radar in dark and light
  for (const mode of ['dark', 'light']) {
    const opSvg = generateOperatorRadarSvg({ mode });
    const opBuffer = Buffer.from(opSvg);

    const filenameBase = `operator-radar-${mode}`;
    await sharp(opBuffer)
      .resize(800, 500)
      .webp({ quality: 90 })
      .toFile(path.join(publicImagesDir, `${filenameBase}.webp`));

    await sharp(opBuffer)
      .resize(1600, 1000)
      .webp({ quality: 92 })
      .toFile(path.join(publicImagesDir, `${filenameBase}-2x.webp`));

    console.log(`Generated ${filenameBase}.webp and @2x`);

    if (mode === 'dark') {
      await sharp(opBuffer)
        .resize(800, 500)
        .webp({ quality: 90 })
        .toFile(path.join(publicImagesDir, 'operator-radar.webp'));

      await sharp(opBuffer)
        .resize(1600, 1000)
        .webp({ quality: 92 })
        .toFile(path.join(publicImagesDir, 'operator-radar-2x.webp'));

      console.log('Updated legacy operator-radar.webp and @2x');
    }
  }

  console.log('All sample assets generated successfully!');
}

buildAssets().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
