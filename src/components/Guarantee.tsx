import { useTranslation } from '../context/LanguageContext';

export default function Guarantee() {
  const { t, language } = useTranslation();
  return (
    <section className="py-12 md:py-16 px-6 relative flex justify-center">
      <div className="max-w-3xl mx-auto text-center relative z-10 w-full">
        <div className="relative bg-slate-900 border-2 border-slate-700/50 p-10 md:p-14 text-left shadow-2xl rounded-sm">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white font-mono text-[10px] font-bold tracking-widest uppercase px-6 py-1.5 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            {t('guarantee_badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-8 leading-tight text-center">
            {t('guarantee_title')}
          </h2>
          <div className="text-sm md:text-base text-slate-400 space-y-5 leading-relaxed">
            <p>
              {t('guarantee_desc_1')}
            </p>
            <p>
              {t('guarantee_desc_2')}
            </p>
            <div className="pt-6 mt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono text-center">
                {language === 'es' ? 'Operamos de esta manera porque confiamos plenamente en el calibre de nuestros sistemas. No deberías tener que asumir un riesgo financiero.' : 'We run our business this way because we are fully confident in the caliber of our systems. You shouldn\'t have to take a financial risk just to see what a premium customer experience looks like.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
