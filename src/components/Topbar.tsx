import { useTranslation } from '../context/LanguageContext';

export default function Topbar() {
  const { t } = useTranslation();
  return (
    <div className="bg-orange-600 border-b border-orange-700 py-1.5 px-6 flex justify-center items-center shrink-0">
      <p className="text-[11px] font-bold tracking-widest text-white uppercase text-center animate-pulse">
        {t('topbar_text')}
      </p>
    </div>
  );
}
