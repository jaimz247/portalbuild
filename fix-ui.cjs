const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace py-24 md:py-32 with py-12 md:py-16
  content = content.replace(/py-24 md:py-32/g, 'py-12 md:py-16');
  // Replace py-24 with py-12 md:py-16
  content = content.replace(/py-24(?!\smd:)/g, 'py-12 md:py-16');
  
  // Strip brackets from Apply buttons if they exist
  content = content.replace(/\[Apply for a Free Pilot <span[^>]*>→<\/span>\]/g, 'Apply for a Free Pilot →');
  content = content.replace(/\[Apply for a Free 72-Hour Prototype →\]/g, 'Apply for Your Free Prototype →');
  content = content.replace(/\[Apply for a Free Pilot →\]/g, 'Apply for Your Free Prototype →');
  
  // Replace basic outline/transparent buttons with orange ones (where appropriate)
  content = content.replace(/bg-white text-slate-950 px-8 py-4 font-bold text-sm tracking-tight hover:bg-orange-500 transition-colors duration-300/g, 'bg-orange-600 text-white px-8 py-4 font-bold text-sm tracking-tight transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02]');
  
  fs.writeFileSync(filePath, content);
}
console.log('UI paddings fixed.');
