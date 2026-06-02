import { openApplicationModal } from '../lib/events';
import { useTranslation } from '../context/LanguageContext';

export default function Pricing() {
  const { language, t } = useTranslation();

  const tiersEn = [
    {
      name: "The Pilot Phase",
      price: "FREE",
      sub: "(For qualified providers only)",
      timeline: "Delivered in 72 hours.",
      features: [
        "Core dashboard layout",
        "2–4 customized screens matching your exact brand identity",
        "Video walkthrough presentation on delivery"
      ],
      highlight: false
    },
    {
      name: "The Full Client Portal",
      pop: "Most Popular",
      price: "$1,500 – $3,500",
      sub: "Flat project fee",
      timeline: "Fully deployed in 7–14 days.",
      features: [
        "Complete secure client authentication and login systems",
        "Live automatic data feeds via APIs from your existing tools",
        "Fully customized matching domain, colors, and logo",
        "Mobile-responsive layouts across all modern devices",
        "Step-by-step handoff and deployment documentation",
        "2 weeks of dedicated revision support included"
      ],
      highlight: true
    },
    {
      name: "Monthly Optimization",
      price: "$400 – $800",
      sub: "/ month (Optional rolling monthly agreement)",
      timeline: "Rolling monthly agreement.",
      features: [
        "Rolling feature additions",
        "Interface, layout, and data source updates",
        "API integration maintenance",
        "Priority developer response time execution"
      ],
      highlight: false
    }
  ];

  const tiersEs = [
    {
      name: "La Fase Piloto",
      price: "GRATIS",
      sub: "(Solo para proveedores calificados)",
      timeline: "Entregado en 72 horas.",
      features: [
        "Estructura principal del panel",
        "2-4 pantallas personalizadas que coinciden con su identidad de marca",
        "Presentación de video recorrido al momento de la entrega"
      ],
      highlight: false
    },
    {
      name: "El Portal de Clientes Completo",
      pop: "Más Popular",
      price: "$1,500 – $3,500",
      sub: "Tarifa plana del proyecto",
      timeline: "Completamente desplegado en 7-14 días.",
      features: [
        "Sistemas de inicio de sesión y autenticación segura de clientes",
        "Feeds de datos automáticos en vivo a través de APIs de sus herramientas",
        "Dominio, colores y logotipo totalmente personalizados a juego",
        "Diseños optimizados para móviles en todos los dispositivos modernos",
        "Documentación de despliegue y lanzamiento paso a paso",
        "2 semanas de asistencia directa y revisiones incluidas"
      ],
      highlight: true
    },
    {
      name: "Optimización Mensual",
      price: "$400 – $800",
      sub: "/ mes (Acuerdo mensual opcional renovable)",
      timeline: "Acuerdo mensual renovable.",
      features: [
        "Adiciones periódicas de nuevas funciones",
        "Actualizaciones de interfaz, diseño y fuentes de datos",
        "Mantenimiento continuo de las integraciones de API",
        "Tiempo de respuesta prioritario del desarrollador"
      ],
      highlight: false
    }
  ];

  const tiers = language === 'es' ? tiersEs : tiersEn;

  return (
    <section className="py-12 md:py-16 px-6 max-w-7xl mx-auto" id="pricing">
      <div className="text-center mb-16">
        <span className="text-orange-500 font-mono tracking-widest text-[10px] uppercase mb-4 block">
          {language === 'es' ? 'Precios Transparentes' : 'Transparent pricing'}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
          {language === 'es' ? 'Precios simples y fijos. Sin sorpresas.' : 'Simple, flat pricing. No surprises.'}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          {language === 'es' 
            ? 'Estás invirtiendo en velocidad, presentación de lujo y un activo operativo, no en un registro de horas abierto.' 
            : 'You are investing in speed, luxury presentation, and an operational asset—not an open-ended timesheet.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 xl:gap-8 items-stretch pt-4">
        {tiers.map((tier, idx) => (
          <div key={idx} className={`relative flex flex-col p-8 md:p-10 transition-all duration-300 ${tier.highlight ? 'bg-white/[0.04] border border-orange-500 hover:border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.1)] z-10' : 'bg-white/[0.02] border border-white/10 hover:border-white/20 mt-0 lg:mt-4'}`}>
            {tier.pop && (
              <span className="absolute -top-3 left-8 bg-orange-500 text-slate-950 text-[10px] font-bold px-3 py-1 tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                {language === 'es' ? 'Más Popular' : tier.pop}
              </span>
            )}
            <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-6 font-mono">{tier.name}</h3>
            <div className="mb-2 text-white">
              <span className="text-4xl md:text-5xl font-bold tracking-tighter">{tier.price}</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 mb-8 pb-8 border-b border-white/10 uppercase tracking-widest">{tier.sub}</div>
            
            <div className="text-slate-300 font-medium text-xs mb-6 flex items-center gap-2 uppercase tracking-wide">
              <span className="text-orange-500">→</span> {tier.timeline}
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {tier.features.map((feat, fidx) => (
                <li key={fidx} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                  <span className="text-orange-500 mt-1 font-mono text-[10px]">/</span>
                  {feat}
                </li>
              ))}
            </ul>
            {tier.highlight && (
                 <button onClick={openApplicationModal} className="bg-orange-600 text-white px-6 py-4 font-bold text-xs tracking-tight transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02] w-full mt-4 cursor-pointer">
                     {language === 'es' ? 'Solicitar Prototipo Gratis →' : 'Apply for Your Free Prototype →'}
                 </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-slate-500 mt-16 max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
        {language === 'es'
          ? 'Condiciones de Pago para Desarrollo Completo: 50% por adelantado antes de iniciar, 25% tras la aprobación del prototipo, y 25% antes del lanzamiento final. Se acepta Stripe, PayPal y transferencias históricas.'
          : 'Payment Terms for Full Build: 50% upfront before work begins, 25% upon prototype approval, and 25% prior to final launch. Stripe, PayPal, and wire transfer accepted.'}
      </p>
    </section>
  );
}
