import { 
  Home, 
  Users, 
  Map, 
  Calendar, 
  PlayCircle, 
  FolderArchive, 
  BarChart3, 
  Video, 
  Megaphone 
} from 'lucide-react';

export default function Features() {
  const screens = [
    {
      icon: <Home className="w-5 h-5" />,
      number: "Screen 01",
      title: "Welcome / Home",
      desc: "Personalized member dashboard displaying active week status, current deliverables, and next live call timer."
    },
    {
      icon: <Users className="w-5 h-5" />,
      number: "Screen 02",
      title: "Your Cohort",
      desc: "Private cohort member directory fostering peer accountability, networking, and group momentum."
    },
    {
      icon: <Map className="w-5 h-5" />,
      number: "Screen 03",
      title: "Program Roadmap",
      desc: "Interactive week-by-week curriculum timeline showing past achievements and locked upcoming milestones."
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      number: "Screen 04",
      title: "Schedule",
      desc: "Centralized live call schedule with direct Zoom links, calendar sync, and timezone adjustments."
    },
    {
      icon: <PlayCircle className="w-5 h-5" />,
      number: "Screen 05",
      title: "Modules",
      desc: "Curriculum video lessons paired directly with required worksheet submissions and action steps."
    },
    {
      icon: <FolderArchive className="w-5 h-5" />,
      number: "Screen 06",
      title: "Resources",
      desc: "Organized library for slide decks, SOP templates, financial models, and downloadable frameworks."
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      number: "Screen 07",
      title: "My Progress",
      desc: "Individual member tracking showing submitted assignments, operator feedback, and completion status."
    },
    {
      icon: <Video className="w-5 h-5" />,
      number: "Screen 08",
      title: "Sessions",
      desc: "Archive of past live call replays, AI call summaries, timestamps, and key takeaway notes."
    },
    {
      icon: <Megaphone className="w-5 h-5" />,
      number: "Screen 09",
      title: "Announcements",
      desc: "Operator broadcast feed for weekly focus priorities, schedule shifts, and cohort updates."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto" id="screens">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
          <span>Complete Member Experience</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
          The 9 Screens Built For Your Cohort
        </h2>
        <p className="text-slate-300 text-base md:text-lg">
          Every screen is custom-branded with your logo, colors, and domain to create a seamless $10,000 member experience.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map((screen, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl bg-slate-900/60 border border-white/10 hover:border-orange-500/40 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {screen.icon}
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  {screen.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {screen.title}
              </h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {screen.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

