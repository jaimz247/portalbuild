import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicImagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// 1. Hero Portal Graphic
const heroSvg = `
<svg width="2400" height="1350" viewBox="0 0 2400 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="2400" height="1350" rx="32" fill="#020617"/>
  <rect x="2" y="2" width="2396" height="1346" rx="30" stroke="#334155" stroke-width="4"/>
  
  <!-- Header Bar -->
  <rect x="0" y="0" width="2400" height="100" fill="#0f172a" rx="32"/>
  <circle cx="80" cy="50" r="16" fill="#f43f5e"/>
  <circle cx="130" cy="50" r="16" fill="#f59e0b"/>
  <circle cx="180" cy="50" r="16" fill="#10b981"/>
  
  <rect x="700" y="25" width="1000" height="50" rx="12" fill="#020617" stroke="#334155" stroke-width="2"/>
  <text x="1200" y="58" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#10b981" text-anchor="middle">🔒 portal.thegrowthcollective.com</text>

  <!-- Sidebar -->
  <rect x="60" y="160" width="440" height="1130" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <rect x="100" y="200" width="80" height="80" rx="16" fill="#ea580c"/>
  <text x="140" y="250" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#ffffff" text-anchor="middle">GC</text>
  <text x="200" y="235" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff">Growth Collective</text>
  <text x="200" y="270" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#f97316">Cohort 8 · Live Portal</text>

  <rect x="100" y="330" width="360" height="70" rx="14" fill="#ea580c"/>
  <text x="140" y="373" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Welcome / Home</text>

  <rect x="100" y="420" width="360" height="70" rx="14" fill="#1e293b"/>
  <text x="140" y="463" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#94a3b8">Your Cohort (32)</text>

  <rect x="100" y="510" width="360" height="70" rx="14" fill="#1e293b"/>
  <text x="140" y="553" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#94a3b8">Program Roadmap</text>

  <rect x="100" y="600" width="360" height="70" rx="14" fill="#1e293b"/>
  <text x="140" y="643" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#94a3b8">Live Sessions &amp; Calls</text>

  <!-- Main Content Area -->
  <rect x="540" y="160" width="1800" height="1130" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  
  <!-- Banner Card -->
  <rect x="580" y="200" width="1720" height="240" rx="20" fill="url(#grad1)" stroke="#ea580c" stroke-width="2"/>
  <text x="630" y="270" font-family="system-ui, sans-serif" font-size="42" font-weight="800" fill="#ffffff">Welcome back, Sarah 👋</text>
  <text x="630" y="320" font-family="system-ui, sans-serif" font-size="26" font-weight="500" fill="#cbd5e1">Week 3: Client Acquisition Engine &amp; Funnel Optimization</text>
  <rect x="630" y="360" width="320" height="50" rx="25" fill="#10b981"/>
  <text x="790" y="393" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">✓ Active Member · On Track</text>

  <!-- Metrics Grid -->
  <rect x="580" y="470" width="540" height="240" rx="16" fill="#020617" stroke="#334155" stroke-width="2"/>
  <text x="620" y="520" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#94a3b8">Curriculum Progress</text>
  <text x="620" y="590" font-family="system-ui, sans-serif" font-size="64" font-weight="800" fill="#f97316">75%</text>
  <rect x="620" y="620" width="460" height="20" rx="10" fill="#1e293b"/>
  <rect x="620" y="620" width="345" height="20" rx="10" fill="#f97316"/>

  <rect x="1160" y="470" width="540" height="240" rx="16" fill="#020617" stroke="#334155" stroke-width="2"/>
  <text x="1200" y="520" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#94a3b8">Next Q&amp;A Mastermind</text>
  <text x="1200" y="580" font-family="system-ui, sans-serif" font-size="40" font-weight="800" fill="#10b981">Thursday @ 2:00 PM EST</text>
  <text x="1200" y="640" font-family="system-ui, sans-serif" font-size="22" font-weight="500" fill="#64748b">Zoom link synced to your calendar</text>

  <rect x="1740" y="470" width="560" height="240" rx="16" fill="#020617" stroke="#334155" stroke-width="2"/>
  <text x="1780" y="520" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#94a3b8">Required Deliverables</text>
  <text x="1780" y="580" font-family="system-ui, sans-serif" font-size="40" font-weight="800" fill="#ffffff">Funnel Review SOP</text>
  <text x="1780" y="640" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#f59e0b">● Due in 2 days</text>

  <!-- Deliverables List -->
  <rect x="580" y="740" width="1720" height="510" rx="16" fill="#020617" stroke="#334155" stroke-width="2"/>
  <text x="630" y="800" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff">Current Action Items &amp; Submissions</text>
  
  <rect x="630" y="840" width="1620" height="100" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <text x="670" y="900" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#ffffff">1. Organic Client Acquisition SOP Submission</text>
  <rect x="2000" y="865" width="200" height="50" rx="10" fill="#10b981"/>
  <text x="2100" y="898" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">Submitted</text>

  <rect x="630" y="960" width="1620" height="100" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <text x="670" y="1020" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#ffffff">2. High-Ticket Offer Stack &amp; Pricing Worksheet</text>
  <rect x="2000" y="985" width="200" height="50" rx="10" fill="#ea580c"/>
  <text x="2100" y="1018" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">In Progress</text>

  <rect x="630" y="1080" width="1620" height="100" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <text x="670" y="1140" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#ffffff">3. Cohort Peer Feedback Exchange</text>
  <rect x="2000" y="1105" width="200" height="50" rx="10" fill="#334155"/>
  <text x="2100" y="1138" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#94a3b8" text-anchor="middle">Locked</text>

  <defs>
    <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
</svg>
`;

// 2. Operator Radar Graphic
const operatorSvg = `
<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="1000" rx="24" fill="#020617" stroke="#334155" stroke-width="4"/>
  
  <rect x="40" y="40" width="1520" height="100" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <text x="80" y="100" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#ffffff">⚡ Operator Radar Dashboard</text>
  <rect x="1260" y="65" width="260" height="50" rx="10" fill="#f43f5e" fill-opacity="0.2" stroke="#f43f5e" stroke-width="2"/>
  <text x="1390" y="98" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#f43f5e" text-anchor="middle">⚠️ 3 At-Risk Members</text>

  <rect x="40" y="180" width="480" height="180" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
  <text x="80" y="230" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#94a3b8">Active Cohort Health</text>
  <text x="80" y="300" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="#10b981">91.2%</text>

  <rect x="560" y="180" width="480" height="180" rx="16" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
  <text x="600" y="230" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#94a3b8">Avg. Module Completion</text>
  <text x="600" y="300" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="#f59e0b">8.4 / 10</text>

  <rect x="1080" y="180" width="480" height="180" rx="16" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
  <text x="1120" y="230" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#94a3b8">Interventions Triggered</text>
  <text x="1120" y="300" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="#f43f5e">3 Saved</text>

  <!-- Alert Table -->
  <rect x="40" y="400" width="1520" height="560" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <text x="80" y="460" font-family="system-ui, sans-serif" font-size="26" font-weight="700" fill="#ffffff">Automated Operator Health Alerts (Week 3)</text>

  <!-- Row 1 -->
  <rect x="80" y="500" width="1440" height="120" rx="12" fill="#020617" stroke="#f43f5e" stroke-width="2"/>
  <circle cx="140" cy="560" r="30" fill="#f43f5e" fill-opacity="0.2"/>
  <text x="140" y="568" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#f43f5e" text-anchor="middle">JD</text>
  <text x="200" y="548" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#ffffff">John Doe</text>
  <text x="200" y="582" font-family="system-ui, sans-serif" font-size="18" font-weight="500" fill="#94a3b8">john@enterprise.com · Joined 21 days ago</text>
  <text x="750" y="565" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#f43f5e">⚠️ Inactive 5 days · Missed 2 worksheets</text>
  <rect x="1260" y="535" width="220" height="50" rx="10" fill="#ea580c"/>
  <text x="1370" y="568" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">Send Check-in DM</text>

  <!-- Row 2 -->
  <rect x="80" y="640" width="1440" height="120" rx="12" fill="#020617" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="140" cy="700" r="30" fill="#f59e0b" fill-opacity="0.2"/>
  <text x="140" y="708" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#f59e0b" text-anchor="middle">AS</text>
  <text x="200" y="688" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Alice Smith</text>
  <text x="200" y="722" font-family="system-ui, sans-serif" font-size="18" font-weight="500" fill="#94a3b8">alice@growth.io · Joined 21 days ago</text>
  <text x="750" y="705" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#f59e0b">⚡ Module 3 video uncompleted</text>
  <rect x="1260" y="675" width="220" height="50" rx="10" fill="#334155"/>
  <text x="1370" y="708" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">Nudge Member</text>

  <!-- Row 3 -->
  <rect x="80" y="780" width="1440" height="120" rx="12" fill="#020617" stroke="#10b981" stroke-width="2"/>
  <circle cx="140" cy="840" r="30" fill="#10b981" fill-opacity="0.2"/>
  <text x="140" y="848" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#10b981" text-anchor="middle">MK</text>
  <text x="200" y="828" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Michael Knight</text>
  <text x="200" y="862" font-family="system-ui, sans-serif" font-size="18" font-weight="500" fill="#94a3b8">michael@tech.com · Joined 21 days ago</text>
  <text x="750" y="845" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#10b981">✓ All deliverables submitted on time</text>
  <rect x="1260" y="815" width="220" height="50" rx="10" fill="#10b981" fill-opacity="0.2"/>
  <text x="1370" y="848" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#10b981" text-anchor="middle">Star Performer</text>
</svg>
`;

async function generate() {
  console.log('Generating AVIF & WebP assets...');

  // Hero Portal
  const heroBuffer = Buffer.from(heroSvg);
  await sharp(heroBuffer).resize(2400, 1350).webp({ quality: 90 }).toFile(path.join(publicImagesDir, 'hero-portal-2x.webp'));
  await sharp(heroBuffer).resize(1200, 675).webp({ quality: 85 }).toFile(path.join(publicImagesDir, 'hero-portal.webp'));
  await sharp(heroBuffer).resize(2400, 1350).avif({ quality: 85 }).toFile(path.join(publicImagesDir, 'hero-portal-2x.avif'));
  await sharp(heroBuffer).resize(1200, 675).avif({ quality: 80 }).toFile(path.join(publicImagesDir, 'hero-portal.avif'));

  // Dashboard Preview
  await sharp(heroBuffer).resize(2400, 1600, { fit: 'cover' }).webp({ quality: 90 }).toFile(path.join(publicImagesDir, 'dashboard-preview-2x.webp'));
  await sharp(heroBuffer).resize(1200, 800, { fit: 'cover' }).webp({ quality: 85 }).toFile(path.join(publicImagesDir, 'dashboard-preview.webp'));
  await sharp(heroBuffer).resize(2400, 1600, { fit: 'cover' }).avif({ quality: 85 }).toFile(path.join(publicImagesDir, 'dashboard-preview-2x.avif'));
  await sharp(heroBuffer).resize(1200, 800, { fit: 'cover' }).avif({ quality: 80 }).toFile(path.join(publicImagesDir, 'dashboard-preview.avif'));

  // Operator Radar
  const opBuffer = Buffer.from(operatorSvg);
  await sharp(opBuffer).resize(1600, 1000).webp({ quality: 90 }).toFile(path.join(publicImagesDir, 'operator-radar-2x.webp'));
  await sharp(opBuffer).resize(800, 500).webp({ quality: 85 }).toFile(path.join(publicImagesDir, 'operator-radar.webp'));
  await sharp(opBuffer).resize(1600, 1000).avif({ quality: 85 }).toFile(path.join(publicImagesDir, 'operator-radar-2x.avif'));
  await sharp(opBuffer).resize(800, 500).avif({ quality: 80 }).toFile(path.join(publicImagesDir, 'operator-radar.avif'));

  console.log('Successfully generated AVIF & WebP assets in /public/images');
}

generate().catch(console.error);
