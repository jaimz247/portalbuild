import { useState } from 'react';
import { ArrowLeft, Download, Check, Copy, Sparkles, Image as ImageIcon, Palette, Layers, Loader2 } from 'lucide-react';
import {
  ICON_MARK_SVG,
  FULL_DARK_SVG,
  FULL_LIGHT_SVG,
  APP_BADGE_SVG,
} from '../lib/logosData';
import { downloadPngFromSvg, downloadSvg } from '../lib/svgToPng';

interface PngOption {
  label: string;
  width: number;
  height: number;
  filename: string;
  resolution: string;
}

interface LogoCard {
  id: string;
  title: string;
  description: string;
  svg: string;
  svgFilename: string;
  previewBg: 'dark' | 'light' | 'grid';
  pngOptions: PngOption[];
}

export default function LogosPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const handleBackHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  const handleCopySvg = async (svgContent: string, id: string) => {
    try {
      await navigator.clipboard.writeText(svgContent);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 3000);
    } catch (err) {
      console.error('Failed to copy SVG:', err);
    }
  };

  const handleDownloadPng = async (
    svg: string,
    width: number,
    height: number,
    filename: string,
    key: string
  ) => {
    try {
      setDownloadingKey(key);
      await downloadPngFromSvg(svg, width, height, filename);
    } catch (err) {
      console.error('Failed to download PNG:', err);
    } finally {
      setDownloadingKey(null);
    }
  };

  const logoCards: LogoCard[] = [
    {
      id: 'full-dark',
      title: 'Full Horizontal Logo (Dark Background)',
      description: 'Primary lockup for dark dashboards, hero banners, and pitch decks. Transparent PNG & crisp vector SVG.',
      svg: FULL_DARK_SVG,
      svgFilename: 'portalbuild-logo-dark.svg',
      previewBg: 'dark',
      pngOptions: [
        { label: 'PNG 2000px (Ultra-HD)', width: 2000, height: 500, filename: 'portalbuild-logo-dark-2000.png', resolution: '2000 × 500 px' },
        { label: 'PNG 1000px (Standard)', width: 1000, height: 250, filename: 'portalbuild-logo-dark-1000.png', resolution: '1000 × 250 px' },
        { label: 'PNG 600px (Compact)', width: 600, height: 150, filename: 'portalbuild-logo-dark-600.png', resolution: '600 × 150 px' },
      ],
    },
    {
      id: 'full-light',
      title: 'Full Horizontal Logo (Light Background)',
      description: 'High-contrast lockup for white documents, PDF invoices, and light mode interfaces. Transparent PNG & SVG.',
      svg: FULL_LIGHT_SVG,
      svgFilename: 'portalbuild-logo-light.svg',
      previewBg: 'light',
      pngOptions: [
        { label: 'PNG 2000px (Ultra-HD)', width: 2000, height: 500, filename: 'portalbuild-logo-light-2000.png', resolution: '2000 × 500 px' },
        { label: 'PNG 1000px (Standard)', width: 1000, height: 250, filename: 'portalbuild-logo-light-1000.png', resolution: '1000 × 250 px' },
        { label: 'PNG 600px (Compact)', width: 600, height: 150, filename: 'portalbuild-logo-light-600.png', resolution: '600 × 150 px' },
      ],
    },
    {
      id: 'icon-mark',
      title: 'Square Aperture Icon Mark (Transparent)',
      description: 'Geometric glowing portal mark for app icons, avatars, and UI navigation icons. Transparent PNG & SVG.',
      svg: ICON_MARK_SVG,
      svgFilename: 'portalbuild-icon.svg',
      previewBg: 'grid',
      pngOptions: [
        { label: 'PNG 2048px (Master 2K)', width: 2048, height: 2048, filename: 'portalbuild-icon-2048.png', resolution: '2048 × 2048 px' },
        { label: 'PNG 1024px (High-Res)', width: 1024, height: 1024, filename: 'portalbuild-icon-1024.png', resolution: '1024 × 1024 px' },
        { label: 'PNG 512px (Standard App)', width: 512, height: 512, filename: 'portalbuild-icon-512.png', resolution: '512 × 512 px' },
        { label: 'PNG 256px (Icon)', width: 256, height: 256, filename: 'portalbuild-icon-256.png', resolution: '256 × 256 px' },
      ],
    },
    {
      id: 'app-badge',
      title: 'Official App Badge & Social Avatar',
      description: 'Square branded card with premium dark backdrop, outer bezel, and typography. Ready for Twitter/X, LinkedIn & Discord.',
      svg: APP_BADGE_SVG,
      svgFilename: 'portalbuild-badge.svg',
      previewBg: 'dark',
      pngOptions: [
        { label: 'PNG 1024px (Master Avatar)', width: 1024, height: 1024, filename: 'portalbuild-badge-1024.png', resolution: '1024 × 1024 px' },
        { label: 'PNG 512px (Social Profile)', width: 512, height: 512, filename: 'portalbuild-badge-512.png', resolution: '512 × 512 px' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4 sm:px-6 max-w-6xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Back to PortalBuild Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Brand Assets &amp; Logo Kit</span>
        </div>
      </div>

      {/* Hero Intro */}
      <div className="mb-12">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block mb-2">
          Brand Resource Center
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          PortalBuild Logo &amp; Asset Kit
        </h1>
        <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-3xl leading-relaxed">
          Download crisp, high-resolution PNGs with transparent backgrounds, scalable vector SVGs, and web favicons. All assets render instantly and generate genuine pixel-perfect image files directly in your browser.
        </p>
      </div>

      {/* Grid of Logo Assets */}
      <div className="space-y-10">
        {logoCards.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Preview Canvas Box - Rendered directly via inline SVG for 100% reliability */}
              <div
                className={`lg:w-1/2 flex items-center justify-center p-8 rounded-xl border border-white/10 overflow-hidden relative min-h-[260px] ${
                  item.previewBg === 'light'
                    ? 'bg-slate-100'
                    : item.previewBg === 'grid'
                    ? 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950'
                    : 'bg-slate-950'
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: item.svg }}
                  className="w-full max-w-[380px] max-h-[200px] flex items-center justify-center drop-shadow-xl transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Download Controls & Details */}
              <div className="lg:w-1/2 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-orange-400" />
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* PNG Download Options */}
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                    Download PNG Formats (Transparent):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.pngOptions.map((png) => {
                      const downloadKey = `${item.id}-${png.width}`;
                      const isDownloading = downloadingKey === downloadKey;
                      return (
                        <button
                          key={png.filename}
                          onClick={() =>
                            handleDownloadPng(item.svg, png.width, png.height, png.filename, downloadKey)
                          }
                          disabled={isDownloading}
                          className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/90 hover:bg-orange-600/20 hover:border-orange-500/50 border border-white/10 rounded-lg text-xs font-medium text-slate-200 hover:text-white transition-all group cursor-pointer text-left"
                        >
                          <div>
                            <span className="font-semibold text-white group-hover:text-orange-400 block">
                              {png.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {png.resolution}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                            {isDownloading ? (
                              <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5 text-orange-400 group-hover:translate-y-0.5 transition-transform" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SVG Vector & Copy Action */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => downloadSvg(item.svg, item.svgFilename)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-orange-600/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Vector SVG</span>
                  </button>

                  <button
                    onClick={() => handleCopySvg(item.svg, item.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 hover:text-white font-semibold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">SVG Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy SVG Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Brand Color Tokens & Specs */}
      <div className="mt-14 bg-slate-900/70 border border-white/10 rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-orange-400" />
          Brand Color Palette &amp; Design Specs
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex flex-col gap-2">
            <div className="w-full h-12 rounded-lg bg-[#f97316] shadow-md shadow-orange-500/20"></div>
            <div>
              <p className="text-sm font-bold text-white">Portal Orange</p>
              <p className="text-xs font-mono text-orange-400">#F97316</p>
              <p className="text-[11px] text-slate-400">Primary Core Accent</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex flex-col gap-2">
            <div className="w-full h-12 rounded-lg bg-[#ea580c] shadow-md shadow-orange-700/20"></div>
            <div>
              <p className="text-sm font-bold text-white">Deep Flame</p>
              <p className="text-xs font-mono text-orange-400">#EA580C</p>
              <p className="text-[11px] text-slate-400">Gradient Depth &amp; Hover</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex flex-col gap-2">
            <div className="w-full h-12 rounded-lg bg-[#020617] border border-white/20"></div>
            <div>
              <p className="text-sm font-bold text-white">Space Canvas</p>
              <p className="text-xs font-mono text-slate-400">#020617</p>
              <p className="text-[11px] text-slate-400">Primary Dark Background</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex flex-col gap-2">
            <div className="w-full h-12 rounded-lg bg-[#0f172a] border border-white/20"></div>
            <div>
              <p className="text-sm font-bold text-white">Slate Framing</p>
              <p className="text-xs font-mono text-slate-400">#0F172A</p>
              <p className="text-[11px] text-slate-400">Card Surface &amp; Modals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Web Favicon Pack */}
      <div className="mt-8 bg-slate-900/70 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            Favicon &amp; Apple Touch Icons
          </h4>
          <p className="text-xs text-slate-400">
            Standard web icons configured for browsers, bookmarks, and mobile home screen shortcuts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleDownloadPng(ICON_MARK_SVG, 64, 64, 'favicon.png', 'fav-64')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-white rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            {downloadingKey === 'fav-64' ? (
              <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-orange-400" />
            )}
            <span>Download favicon.png (64px)</span>
          </button>
          <button
            onClick={() => handleDownloadPng(ICON_MARK_SVG, 180, 180, 'apple-touch-icon.png', 'apple-180')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-white rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            {downloadingKey === 'apple-180' ? (
              <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-orange-400" />
            )}
            <span>Download apple-touch-icon.png (180px)</span>
          </button>
        </div>
      </div>

      {/* Footer Return CTA */}
      <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
        <p className="text-xs text-slate-400">© 2026 PortalBuild. All rights reserved.</p>
        <button
          onClick={handleBackHome}
          className="text-xs text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider cursor-pointer"
        >
          ← Return to main site
        </button>
      </div>
    </div>
  );
}
