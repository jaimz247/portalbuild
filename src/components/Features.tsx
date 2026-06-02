import { LayoutDashboard, CheckSquare, Target, BookOpen, FolderTree, UploadCloud, Activity, CreditCard } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Branded Client Dashboard",
      desc: "A single, clean starting point customized with your agency or coaching brand."
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      title: "Onboarding Checklist",
      desc: "Helps new clients complete the right intake steps instantly without confusion."
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Visual Progress Tracker",
      desc: "Shows clients exactly where they are, what is completed, and what comes next."
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Session Notes & Actions",
      desc: "Keeps summaries, milestone assignments, and next steps in one central area."
    },
    {
      icon: <FolderTree className="w-5 h-5" />,
      title: "Centralized Resource Library",
      desc: "Organizes your assets, templates, video modules, PDFs, and links natively."
    },
    {
      icon: <UploadCloud className="w-5 h-5" />,
      title: "Secure Document Upload",
      desc: "Lets clients submit files and deliverables without chasing messy email links."
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Automated Admin View",
      desc: "Tracks client status, operational progress, and pending tasks from your side."
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Integrated Booking & Payments",
      desc: "Seamlessly connects your existing calendars and payment tools into one UI."
    }
  ];

  return (
    <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto">
      <div className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-12">
        <div className="max-w-2xl">
          <span className="text-orange-500 font-mono tracking-widest text-[10px] uppercase mb-4 block">Built around your actual client workflow</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-tight">
            Engineered around your actual client workflow.
          </h2>
        </div>
        <p className="text-slate-400 text-lg md:text-right max-w-md border-l border-orange-500/30 pl-6">
          Your portal is customized to make your client journey cleaner, smoother, and highly scalable. Depending on your business needs, your workspace can include:
        </p>
      </div>

      <div className="grid md:grid-cols-2 bg-slate-950 border border-white/10 rounded-sm">
        {features.map((feat, idx) => (
          <div key={idx} className="p-8 md:p-10 flex gap-6 group hover:bg-white/[0.02] transition-colors border-b border-white/10 odd:border-r even:border-l-0">
            <div className="flex-shrink-0 text-slate-500 group-hover:text-orange-500 transition-colors mt-1">
              {feat.icon}
            </div>
            <div>
              <h3 className="text-slate-200 font-bold tracking-tight text-lg mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
