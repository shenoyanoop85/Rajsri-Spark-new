
import React, { useState, useEffect } from 'react';
import { MainTab, SubView } from '../types';
import { Icons } from '../constants';
import { useNav, useData } from '../context';
import { FeedCard } from '../components/ui.tsx';

export const EventsScreen: React.FC = () => {
  const { events } = useData();
  const { nav, goBack } = useNav();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const buttonClass = isScrolled 
    ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-white shadow-md" 
    : "bg-black/20 text-white backdrop-blur-md border border-white/10";

  return (
    <div className="space-y-0 animate-fade-in pb-safe relative relative bg-slate-50 dark:bg-slate-900 min-h-screen">
        {/* Fixed Navigation Button (Back Only) */}
        <div className="fixed top-0 left-0 right-0 z-50 p-4 pt-6 flex justify-between items-start pointer-events-none max-w-md mx-auto">
             <button onClick={goBack} className={`pointer-events-auto p-2.5 rounded-full transition-all duration-300 ${buttonClass}`}>
                <Icons.ChevronLeft className="w-6 h-6" />
             </button>
        </div>

        {events.map((event, index) => {
            const percentFull = Math.round((event.registeredCount / event.capacity) * 100);
            const isSoldOut = percentFull >= 100;
            const isFillingFast = !isSoldOut && percentFull > 80;

            const badges = (
                <>
                    <span className="px-3 py-1 bg-spark-green/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm border border-white/20">{event.type}</span>
                    {isFillingFast && (
                        <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm border border-white/20 animate-pulse">
                            FILLING FAST
                        </span>
                    )}
                    {event.isHighPriority && (
                        <span className="px-3 py-1 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm border border-red-400/30 flex items-center gap-1 animate-pulse">
                            <Icons.Sparkles className="w-3 h-3" /> HIGH PRIORITY
                        </span>
                    )}
                </>
            );

            return (
                <React.Fragment key={event.id}>
                    <FeedCard
                        imageUrl={event.imageUrl}
                        title={event.title}
                        date={event.date}
                        onClick={() => nav(MainTab.EVENTS, SubView.EVENT_DETAIL, event.id)}
                        isSoldOut={isSoldOut}
                        badges={badges}
                    >
                        <div className="flex items-center text-sm text-slate-200 gap-2">
                            <Icons.Clock className="w-4 h-4 text-emerald-400"/> <span className="truncate font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-200 gap-2">
                            <Icons.MapPin className="w-4 h-4 text-emerald-400"/> <span className="truncate font-medium">{event.location}</span>
                        </div>
                    </FeedCard>
                    
                    {/* Transparent Spacer Div between cards */}
                    {index < events.length - 1 && <div className="w-full h-1 bg-transparent" />}
                </React.Fragment>
            );
        })}
    </div>
  );
};
