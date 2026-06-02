import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  image?: string;
}

export default function SEO({ 
  title = "PortalBuild | Premium Client Portals in 72 Hours", 
  description = "Turn Your Service Delivery Into A Premium Client Portal In 72 Hours. Stop managing clients through chaotic WhatsApp threads and messy spreadsheets.",
  type = "website",
  url = "https://portalbuild.com",
  image = "/vite.svg"
}: SEOProps) {
  useEffect(() => {
    // Standard Meta
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    
    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    
    // Open Graph
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:type"]')?.setAttribute("content", type);
    
    // Check if url tag exists, if not create it
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', url);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', image);

    // Twitter
    document.querySelector('meta[property="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="twitter:description"]')?.setAttribute("content", description);
    
    let twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('property', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', image);

    // Schema.org JSON-LD data
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "PortalBuild | Premium Client Portal Development",
      "url": "https://portalbuild.com",
      "description": "Turn Your Service Delivery Into A Premium Client Portal In 72 Hours. Stop managing clients through chaotic WhatsApp threads and messy spreadsheets.",
      "about": {
        "@type": "Service",
        "name": "Client Portal Development",
        "description": "Bespoke, white-label client dashboards built for high-ticket services and agencies in 72 hours.",
        "provider": {
          "@type": "Organization",
          "name": "PortalBuild"
        }
      }
    };
    
    script.textContent = JSON.stringify(schemaData);

  }, [title, description, type, url, image]);

  return null;
}
