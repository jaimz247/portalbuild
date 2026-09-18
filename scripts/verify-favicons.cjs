const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function verifyFavicons() {
  console.log('====================================================');
  console.log('🔍 PORTALBUILD FAVICON & APP ICON VERIFICATION SCRIPT');
  console.log('====================================================\n');

  const rootDir = path.resolve(__dirname, '..');
  const indexHtmlPath = path.join(rootDir, 'index.html');
  const publicDir = path.join(rootDir, 'public');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ index.html not found at:', indexHtmlPath);
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // Regex to match all icon link tags
  const iconTagRegex = /<link\s+[^>]*rel=["'](?:(?:alternate\s+)?icon|shortcut\s+icon|apple-touch-icon)["'][^>]*>/gi;
  const linkMatches = htmlContent.match(iconTagRegex) || [];

  console.log(`Found ${linkMatches.length} icon link tags in index.html:\n`);

  let allPassed = true;
  const testedFiles = [];

  for (const tag of linkMatches) {
    // Extract attributes
    const relMatch = tag.match(/rel=["']([^"']+)["']/i);
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    const sizesMatch = tag.match(/sizes=["']([^"']+)["']/i);
    const typeMatch = tag.match(/type=["']([^"']+)["']/i);

    const rel = relMatch ? relMatch[1] : '';
    const href = hrefMatch ? hrefMatch[1] : '';
    const sizes = sizesMatch ? sizesMatch[1] : null;
    const type = typeMatch ? typeMatch[1] : null;

    console.log(`Checking tag: <link rel="${rel}" href="${href}"${sizes ? ` sizes="${sizes}"` : ''}${type ? ` type="${type}"` : ''} />`);

    if (!href) {
      console.error('  ❌ Missing href attribute in link tag');
      allPassed = false;
      continue;
    }

    // Clean href path (strip query strings or leading slash)
    const relativePath = href.replace(/^\//, '').split('?')[0];
    const filePath = path.join(publicDir, relativePath);

    if (!fs.existsSync(filePath)) {
      console.error(`  ❌ File does not exist on disk: public/${relativePath}`);
      allPassed = false;
      continue;
    }

    const stat = fs.statSync(filePath);
    if (stat.size === 0) {
      console.error(`  ❌ File is empty (0 bytes): public/${relativePath}`);
      allPassed = false;
      continue;
    }

    testedFiles.push(relativePath);

    // Format & dimension checks
    if (relativePath.endsWith('.svg')) {
      const svgContent = fs.readFileSync(filePath, 'utf8');
      if (svgContent.includes('<svg') && svgContent.includes('</svg>')) {
        console.log(`  ✅ SVG icon valid (${stat.size} bytes)`);
      } else {
        console.error('  ❌ SVG file is not a valid SVG document');
        allPassed = false;
      }
    } else if (relativePath.endsWith('.ico')) {
      const buffer = fs.readFileSync(filePath);
      if (buffer.length >= 6 && buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1) {
        const imageCount = buffer.readUInt16LE(4);
        console.log(`  ✅ ICO format valid (${stat.size} bytes, contains ${imageCount} embedded icon size(s))`);
      } else {
        console.error('  ❌ ICO header is invalid');
        allPassed = false;
      }
    } else {
      // PNG check with sharp
      try {
        const metadata = await sharp(filePath).metadata();
        const dimensions = `${metadata.width}x${metadata.height}`;
        console.log(`  ✅ ${metadata.format.toUpperCase()} verified: ${dimensions}, ${stat.size} bytes`);

        if (sizes) {
          const expectedSizes = sizes.split(/\s+/);
          const match = expectedSizes.some(s => s.toLowerCase() === dimensions.toLowerCase());
          if (match) {
            console.log(`  ✅ Dimension matches declared sizes="${sizes}"`);
          } else {
            console.error(`  ❌ Dimension mismatch! Declared sizes="${sizes}", but file is ${dimensions}`);
            allPassed = false;
          }
        }
      } catch (err) {
        console.error(`  ❌ Failed to parse image with sharp: ${err.message}`);
        allPassed = false;
      }
    }
    console.log('');
  }

  // Cross-browser compatibility audit
  console.log('----------------------------------------------------');
  console.log('📋 CROSS-BROWSER COMPATIBILITY AUDIT:');
  console.log('----------------------------------------------------');

  const requiredStandards = [
    { name: 'Standard 32x32 PNG (Desktop browsers / Retina tabs)', test: () => testedFiles.some(f => f.includes('32x32') || f === 'favicon.png') },
    { name: 'Standard 16x16 PNG (Legacy tabs / bookmarks)', test: () => testedFiles.some(f => f.includes('16x16')) },
    { name: 'Apple Touch Icon 180x180 PNG (iOS Safari / PWA homescreen)', test: () => testedFiles.some(f => f.includes('apple-touch-icon')) },
    { name: 'Scalable Vector SVG (Modern Chrome, Safari 16.4+, Firefox)', test: () => testedFiles.some(f => f.endsWith('.svg')) },
    { name: 'Multi-size favicon.ico (Legacy IE/Edge, Windows taskbar, bots)', test: () => testedFiles.some(f => f.endsWith('.ico')) },
  ];

  for (const standard of requiredStandards) {
    const passed = standard.test();
    if (passed) {
      console.log(`  ✅ [PASS] ${standard.name}`);
    } else {
      console.log(`  ⚠️ [WARN] Missing standard icon: ${standard.name}`);
      allPassed = false;
    }
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('🎉 ALL FAVICONS AND APP ICONS VERIFIED SUCCESSFULLY!');
    console.log('====================================================\n');
    process.exit(0);
  } else {
    console.error('❌ SOME FAVICON VERIFICATIONS FAILED.');
    console.log('====================================================\n');
    process.exit(1);
  }
}

verifyFavicons().catch(err => {
  console.error('Unexpected error running verifyFavicons:', err);
  process.exit(1);
});
