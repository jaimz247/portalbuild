import { openApplicationModal } from '../lib/events';
import { useTranslation } from '../context/LanguageContext';

export default function MidPageIntercept() {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-6 relative flex justify-center bg-orange-600/10 border-y border-orange-500/20">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-6">
          {t('intercept_title')}
        </h2>
        <button 
          onClick={openApplicationModal}
          className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-5 font-bold text-sm tracking-tight transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02] cursor-pointer"
        >
          {t('intercept_cta')}
        </button>
      </div>
    </section>
  );
}
