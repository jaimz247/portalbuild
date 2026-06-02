const fs = require('fs');

let content = fs.readFileSync('src/components/ApplicationForm.tsx', 'utf8');

// Add FocusTrap import
content = content.replace("import { Loader2, X } from 'lucide-react';", "import { Loader2, X } from 'lucide-react';\nimport FocusTrap from 'focus-trap-react';");

// Wrap the modal content in FocusTrap
content = content.replace(
  '<motion.div\n          initial={{ opacity: 0 }}\n          animate={{ opacity: 1 }}\n          exit={{ opacity: 0 }}\n          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"\n        >',
  '<FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true, onDeactivate: closeForm, fallbackFocus: "#internal-modal-container" }}>\n<motion.div\n          initial={{ opacity: 0 }}\n          animate={{ opacity: 1 }}\n          exit={{ opacity: 0 }}\n          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"\n          id="internal-modal-container"\n          tabIndex={-1}\n        >'
);

// Close FocusTrap
content = content.replace(
  '        </motion.div>\n      )}',
  '        </motion.div>\n        </FocusTrap>\n      )}'
);

// Add aria labels to inputs
content = content.replace(/<input type="text" name="name"/g, '<input type="text" name="name" aria-label="Full Name"');
content = content.replace(/<input type="text" name="businessName"/g, '<input type="text" name="businessName" aria-label="Business Name"');
content = content.replace(/<input type="email" name="email"/g, '<input type="email" name="email" aria-label="Corporate Email Address"');
content = content.replace(/<input type="url" name="url"/g, '<input type="url" name="url" aria-label="Website URL"');

content = content.replace(/<select name="service"/g, '<select name="service" aria-label="What type of service do you run?"');
content = content.replace(/<input type="text" name="clients"/g, '<input type="text" name="clients" aria-label="How many active, paying clients do you currently manage?"');
content = content.replace(/<textarea placeholder="e.g., WhatsApp, manual emails, Google Drive links, spreadsheets" name="tracking"/g, '<textarea aria-label="How do you currently share resources and track client progress?" placeholder="e.g., WhatsApp, manual emails, Google Drive links, spreadsheets" name="tracking"');
content = content.replace(/<textarea name="messy"/g, '<textarea name="messy" aria-label="What feels most messy, manual, or unprofessional in your current delivery setup?"');

fs.writeFileSync('src/components/ApplicationForm.tsx', content);
