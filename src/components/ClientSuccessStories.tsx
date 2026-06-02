import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const stories = [
  {
    authorKey: 'author_1' as const,
    roleKey: 'role_1' as const,
    quoteKey: 'quote_1' as const,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    authorKey: 'author_2' as const,
    roleKey: 'role_2' as const,
    quoteKey: 'quote_2' as const,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e"
  },
  {
    authorKey: 'author_3' as const,
    roleKey: 'role_3' as const,
    quoteKey: 'quote_3' as const,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f"
  }
];

export default function ClientSuccessStories() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + stories.length) % stories.length);
  };

  const currentStory = stories[currentIndex];

  return (
    <section className="py-24 px-6 relative max-w-6xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-6">{t('stories_title')}</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          {t('stories_desc')}
        </p>
      </div>

      <div className="relative h-[400px] md:h-[300px] flex items-center justify-center w-full max-w-4xl mx-auto">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
               } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full px-4 md:px-12 cursor-grab active:cursor-grabbing"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="shrink-0 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full border border-white/20 p-1">
                    <img src={currentStory.avatar} alt={t(currentStory.authorKey)} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="flex gap-1 text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="text-4xl text-white/10 font-serif leading-none absolute -top-2 left-6 md:left-[140px] pointer-events-none group-hover:text-orange-500/10 transition-colors duration-500">&ldquo;</div>
                  <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-6 italic relative z-10">
                    "{t(currentStory.quoteKey)}"
                  </p>
                  <div>
                    <h4 className="text-white font-bold tracking-wide">{t(currentStory.authorKey)}</h4>
                    <p className="text-slate-500 text-sm">{t(currentStory.roleKey)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 w-12 h-12 flex items-center justify-center bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-orange-500/50 transition-all duration-300 z-10 shadow-xl cursor-pointer"
          onClick={() => paginate(-1)}
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 w-12 h-12 flex items-center justify-center bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-orange-500/50 transition-all duration-300 z-10 shadow-xl cursor-pointer"
          onClick={() => paginate(1)}
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex justify-center gap-2 mt-8 md:mt-12">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-orange-500 w-8' : 'bg-white/20 hover:bg-white/40'} cursor-pointer`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
