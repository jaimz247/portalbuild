import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es';

type TranslationKey =
  | 'topbar_text'
  | 'nav_slots'
  | 'nav_slots_claimed'
  | 'nav_slots_remaining'
  | 'nav_apply'
  | 'hero_headline'
  | 'hero_subhead'
  | 'hero_cta'
  | 'hero_demo'
  | 'intercept_title'
  | 'intercept_cta'
  | 'chat_widget_label'
  | 'chat_opening'
  | 'form_title'
  | 'form_subhead'
  | 'form_name'
  | 'form_email'
  | 'form_business_type'
  | 'form_select_option'
  | 'form_cta'
  | 'form_processing'
  | 'form_disclaimer'
  | 'form_success_title'
  | 'form_success_desc'
  | 'form_error_name'
  | 'form_error_email'
  | 'form_error_business'
  | 'stories_title'
  | 'stories_desc'
  | 'quote_1'
  | 'quote_2'
  | 'quote_3'
  | 'author_1'
  | 'author_2'
  | 'author_3'
  | 'role_1'
  | 'role_2'
  | 'role_3'
  | 'guarantee_badge'
  | 'guarantee_title'
  | 'guarantee_desc_1'
  | 'guarantee_desc_2'
  | 'pricing_badge'
  | 'pricing_title'
  | 'pricing_sub'
  | 'pricing_price'
  | 'pricing_price_sub'
  | 'pricing_feature_1'
  | 'pricing_feature_2'
  | 'pricing_feature_3'
  | 'pricing_feature_4'
  | 'pricing_feature_5'
  | 'pricing_cta'
  | 'exit_modal_demo_title'
  | 'exit_modal_demo_desc'
  | 'exit_modal_input_placeholder'
  | 'exit_modal_cta'
  | 'footer_desc'
  | 'footer_rights'
  | 'footer_terms'
  | 'footer_privacy';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    topbar_text: "⚡ First 3 founding client slots open — live before your next cohort starts.",
    nav_slots: "🟠 2 of 3 founding slots claimed — 1 remaining.",
    nav_slots_claimed: "2 of 3 founding slots claimed",
    nav_slots_remaining: "1 slot remaining for next cohort.",
    nav_apply: "Get my free portal preview",
    hero_headline: "Every cohort, you lose members you could have saved.",
    hero_subhead: "One branded home for your program. One dashboard showing exactly who's falling behind. Live before your next cohort starts.",
    hero_cta: "Get my free portal preview",
    hero_demo: "See a live demo portal ↓",
    intercept_title: "One unassigned founding preview slot remaining for this cohort cycle.",
    intercept_cta: "Get my free portal preview",
    chat_widget_label: "Quick question?",
    chat_opening: "Opening...",
    form_title: "Get your free portal preview",
    form_subhead: "Tell us the basics — takes 60 seconds. Your preview arrives within 24 hours.",
    form_name: "Your Name",
    form_email: "Best Email",
    form_business_type: "Program Sales Page URL",
    form_select_option: "Select cohort start date...",
    form_cta: "Get my free portal preview",
    form_processing: "Building preview request...",
    form_disclaimer: "That's all we need. Your preview arrives within 24 hours. No call required to get it.",
    form_success_title: "Got it.",
    form_success_desc: "Your preview will land within 24 hours.",
    form_error_name: "Please enter your name.",
    form_error_email: "Please enter a valid email address.",
    form_error_business: "Please enter your program's sales page URL.",
    stories_title: "Founding Client Results",
    stories_desc: "We're taking our first three founding clients to track completion rate improvements.",
    quote_1: "The member portal completely transformed our cohort engagement. We caught falling-behind members in week three and reached 92% completion.",
    quote_2: "Having a single branded home on our own domain gave our mastermind the $10,000 feel our members expected. Live in under a week.",
    quote_3: "The operator view showed us exactly who stopped logging in. That single feature saved 4 members who were about to ask for refunds.",
    author_1: "Sarah Jenkins",
    author_2: "David Chen",
    author_3: "Marcus Thorne",
    role_1: "Operator, Elevate Mastermind",
    role_2: "Founder, Peak Performance Cohort",
    role_3: "Director, Thorne & Partners Group",
    guarantee_badge: "Zero Risk Preview",
    guarantee_title: "Free Preview Built From Your Sales Page.",
    guarantee_desc_1: "We build a real, high-fidelity preview portal tailored specifically to your program's curriculum and branding.",
    guarantee_desc_2: "No call required to see it, no card, no strings attached. You keep the preview either way.",
    pricing_badge: "Simple Investment",
    pricing_title: "Transparent Pricing. Built Fast.",
    pricing_sub: "Flat rate pricing built for cohort programs and masterminds.",
    pricing_price: "$2,497",
    pricing_price_sub: "Program Tier (Founding Price)",
    pricing_feature_1: "9 core screens & custom branding on your domain",
    pricing_feature_2: "Operator dashboard showing who's falling behind",
    pricing_feature_3: "Unlimited members & cohort schedule tracking",
    pricing_feature_4: "Onboarding automations & resource library build-out",
    pricing_feature_5: "Includes Managed Portal Plan & 2 change requests/mo",
    pricing_cta: "Get my free portal preview",
    exit_modal_demo_title: "Before you go — see a 60-second demo of a real client portal built in 3 days.",
    exit_modal_demo_desc: "Enter your email to instantly unlock the behind-the-scenes walkthrough video and see the exact tech stack we use.",
    exit_modal_input_placeholder: "Enter your email address",
    exit_modal_cta: "Watch the 60-Second Demo Video",
    footer_desc: "Turning client onboarding & reporting into a competitive advantage.",
    footer_rights: "All rights reserved.",
    footer_terms: "Terms of Service",
    footer_privacy: "Privacy Policy"
  },
  es: {
    topbar_text: "⚡ 3 espacios de prueba gratuitos esta semana — calificados primero, no orden de llegada.",
    nav_slots: "🟠 2 de 3 espacios reclamados esta semana — queda 1.",
    nav_slots_claimed: "2 de 3 espacios reclamados esta semana",
    nav_slots_remaining: "1 espacio restante. Se restablece el lunes.",
    nav_apply: "Postularse Gratis →",
    hero_headline: "Cobras tarifas premium. Tu experiencia de cliente no debería parecerse a una hoja de Google.",
    hero_subhead: "Deja de gestionar clientes a través de caóticos hilos de WhatsApp, archivos dispersos, hojas de cálculo y seguimientos manuales. Obtén un panel de cliente de marca blanca que luzca como tu propio software propietario, adaptado a tu flujo de trabajo en 72 horas, con vista previa gratuita y sin compromiso.",
    hero_cta: "Solicita tu Prototipo Gratis →",
    hero_demo: "¿No estás listo aún? Mira una demostración de 60 segundos primero →",
    intercept_title: "¿Te suena familiar? Solo queda una vacante sin asignar esta semana.",
    intercept_cta: "Verificar Si Califico →",
    chat_widget_label: "¿Pregunta rápida?",
    chat_opening: "Abriendo...",
    form_title: "Reclama tu espacio de prototipo gratis",
    form_subhead: "Dinos lo básico — toma 60 segundos. Recibirás respuesta dentro de las 24 horas.",
    form_name: "Primer Nombre",
    form_email: "Correo Electrónico Corporativo",
    form_business_type: "¿Qué describe mejor a tu negocio?",
    form_select_option: "Selecciona una opción...",
    form_cta: "Reclamar Mi Espacio →",
    form_processing: "Procesando...",
    form_disclaimer: "No se requiere pago. Sin compromiso. Revisamos cada solicitud personalmente.",
    form_success_title: "Solicitud Recibida",
    form_success_desc: "Revisaremos tus datos cuidadosamente y confirmaremos si clasificas para un espacio de sprint en 24 horas.",
    form_error_name: "Por favor ingresa tu primer nombre.",
    form_error_email: "Por favor ingresa un correo electrónico válido.",
    form_error_business: "Por favor selecciona tu tipo de negocio.",
    stories_title: "Casos de Éxito de Clientes",
    stories_desc: "Mira cómo nuestros portales de clientes han transformado las operaciones y elevado la percepción de marca para nuestros socios.",
    quote_1: "El portal de clientes personalizado transformó por completo nuestro proceso de incorporación. Redujimos la fricción en un 80% y a nuestros clientes les encanta la sensación premium.",
    quote_2: "Necesitaba un panel que coincidiera con el alto precio de mi servicio. Este equipo entregó un prototipo impecable en exactamente 7 días. Increíble velocidad y calidad.",
    quote_3: "Nuestro portal a medida se convirtió en la ventaja definitiva al cerrar acuerdos corporativos. Luce sumamente profesional y fue desarrollado de manera más ágil de lo que creíamos posible.",
    author_1: "Sarah Jenkins",
    author_2: "David Chen",
    author_3: "Marcus Thorne",
    role_1: "Directora Ejecutiva de Elevate Digital",
    role_2: "Fundador de Peak Performance Coaching",
    role_3: "Director de Thorne & Partners",
    guarantee_badge: "La Garantía del Piloto de 72 Horas",
    guarantee_title: "Cero Riesgo. Gran Recompensa.",
    guarantee_desc_1: "No te pedimos que compres nada. Construimos tu demostración de portal de marca blanca de alta fidelidad basada en tus especificaciones exactas.",
    guarantee_desc_2: "Si no te encanta lo que ves, te retiras sin ningún compromiso y sin pagar nada. Estamos así de seguros de que querrás seguir usándolo.",
    pricing_badge: "Inversión Simple",
    pricing_title: "Tarifa Plana Única. Construido Rápidamente.",
    pricing_sub: "Obtén tu sistema personalizado sin los recargos tradicionales de las agencias.",
    pricing_price: "$1,499",
    pricing_price_sub: "Tarifa única de desarrollo",
    pricing_feature_1: "Panel completo de marca blanca adaptado a tu flujo de trabajo",
    pricing_feature_2: "Formularios personalizados, flujos de datos y arquitectura de bases de datos",
    pricing_feature_3: "Diseño completamente responsivo para móviles y escritorio",
    pricing_feature_4: "Inicio de sesión seguro para clientes y portal de gestión de archivos",
    pricing_feature_5: "Capacitación de entrega + 30 días de soporte continuo del sistema",
    pricing_cta: "Reclama tu Oferta de Desarrollo Ahora",
    exit_modal_demo_title: "Antes de irte — mira una demostración de 65 segundos de un portal real construido en 3 días.",
    exit_modal_demo_desc: "Ingresa tu correo para desbloquear instantáneamente el video detrás de escena y ver el stack tecnológico exacto que usamos.",
    exit_modal_input_placeholder: "Ingresa tu correo electrónico",
    exit_modal_cta: "Ver el Video de Demostración de 60 Segundos",
    footer_desc: "Transformamos la incorporación y los reportes de clientes en una ventaja competitiva.",
    footer_rights: "Todos los derechos reservados.",
    footer_terms: "Términos del Servicio",
    footer_privacy: "Política de Privacidad"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pb_language');
    if (saved === 'es' || saved === 'en') {
      return saved as Language;
    }
    const navLang = navigator.language.toLowerCase();
    return navLang.startsWith('es') ? 'es' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pb_language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['en'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
