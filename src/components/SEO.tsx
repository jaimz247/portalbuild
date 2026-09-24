import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  image?: string;
  locale?: string;
  publishedTime?: string;
}

export default function SEO({ 
  title,
  description,
  type = "website",
  url = "https://getportalbuild.com",
  image = "https://getportalbuild.com/og-image.png",
  locale = "en_US",
  publishedTime = "2026-03-01T08:00:00+00:00"
}: SEOProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", title);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]') || document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute("content", title);
    }
    
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", description);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", description);
      const twitterDesc = document.querySelector('meta[name="twitter:description"]') || document.querySelector('meta[property="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute("content", description);
    }

    if (url) {
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", url);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute("href", url);
    }

    if (image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute("content", image);
      const twitterImage = document.querySelector('meta[name="twitter:image"]') || document.querySelector('meta[property="twitter:image"]');
      if (twitterImage) twitterImage.setAttribute("content", image);
    }

    if (type) {
      const ogType = document.querySelector('meta[property="og:type"]');
      if (ogType) ogType.setAttribute("content", type);
    }

    if (locale) {
      let ogLocale = document.querySelector('meta[property="og:locale"]');
      if (!ogLocale) {
        ogLocale = document.createElement('meta');
        ogLocale.setAttribute('property', 'og:locale');
        document.head.appendChild(ogLocale);
      }
      ogLocale.setAttribute('content', locale);
    }

    if (publishedTime) {
      let publishedMeta = document.querySelector('meta[property="article:published_time"]');
      if (!publishedMeta) {
        publishedMeta = document.createElement('meta');
        publishedMeta.setAttribute('property', 'article:published_time');
        document.head.appendChild(publishedMeta);
      }
      publishedMeta.setAttribute('content', publishedTime);
    }

    // Corporate parent and publisher consistency for crawlers
    let authorMeta = document.querySelector('meta[name="author"]');
    if (!authorMeta) {
      authorMeta = document.createElement('meta');
      authorMeta.setAttribute('name', 'author');
      document.head.appendChild(authorMeta);
    }
    authorMeta.setAttribute('content', 'MorningCrest Solutions LLC');

    let publisherMeta = document.querySelector('meta[name="publisher"]');
    if (!publisherMeta) {
      publisherMeta = document.createElement('meta');
      publisherMeta.setAttribute('name', 'publisher');
      document.head.appendChild(publisherMeta);
    }
    publisherMeta.setAttribute('content', 'MorningCrest Solutions LLC');
  }, [title, description, type, url, image, locale, publishedTime]);

  return null;
}
