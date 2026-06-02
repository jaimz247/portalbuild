import { CheckCircle2 } from 'lucide-react';
import { openApplicationModal, openDemoModal } from '../lib/events';
import { useTranslation } from '../context/LanguageContext';

export default function Hero() {
  const { t, language } = useTranslation();
  return (
    <section className="py-12 md:py-16 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.05]">
        {t('hero_headline')}
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed">
        {t('hero_subhead')}
      </p>
      
      <div className="flex flex-col items-center mb-12 w-full">
        <button onClick={openApplicationModal} className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-4 font-bold text-sm tracking-tight transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02] mb-4 w-full md:w-auto cursor-pointer">
          {t('hero_cta')}
        </button>
        <button onClick={openDemoModal} className="text-[11px] font-medium tracking-widest uppercase text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
          {t('hero_demo')}
        </button>
      </div>

      <div className="relative w-full max-w-4xl mx-auto mt-6 cursor-pointer" onClick={openDemoModal}>
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 to-slate-800/30 blur-2xl opacity-50"></div>
        <div className="relative aspect-video bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-colors duration-500 z-10 flex items-center justify-center">
             <div className="w-16 h-16 rounded-full bg-orange-600/90 text-white flex items-center justify-center pl-1 backdrop-blur-sm shadow-[0_0_30px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
             </div>
          </div>
          <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-300 tracking-wider uppercase z-20">
             {language === 'es' ? 'Ver: Un portal de clientes real construido en 3 días' : 'Watch: A real client portal built in 3 days'}
          </div>
        </div>
      </div>
    </section>
  );
}
