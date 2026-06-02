import { Check } from 'lucide-react';

export default function SocialProof() {
  const points = [
    "Built and deployed over 15+ custom client portals natively.",
    "Rapid-delivery specialist: Every individual build delivered in under 5 days.",
    "Direct execution: Personalized, high-end engineering architecture built for serious operators."
  ];

  return (
    <section className="py-12 px-6 max-w-5xl mx-auto border-t border-b border-white/5 bg-slate-900/20">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-sm md:text-base font-medium text-slate-300 tracking-tight mb-8 uppercase tracking-widest font-mono">
          Currently building case studies — apply to be a founding client.
        </h3>
        <div className="grid md:grid-cols-3 gap-6 md:gap-12 w-full text-left">
          {points.map((point, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
