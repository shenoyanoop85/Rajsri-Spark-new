
import React, { useState, useEffect } from 'react';
import { MainTab, SubView } from '../types';
import { Icons } from '../constants';
import { useNav, useData } from '../context';
import { FeedCard } from '../components/ui.tsx';

export const AnnouncementsScreen: React.FC = () => {
    const { announcements } = useData();
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

            {announcements.map((item, index) => {
                const badges = (
                    <span className="px-3 py-1 bg-spark-orange/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm border border-white/20 uppercase tracking-wide">
                        {item.author}
                    </span>
                );

                return (
                    <React.Fragment key={item.id}>
                        <FeedCard
                            imageUrl={item.imageUrl}
                            title={item.title}
                            date={item.date}
                            onClick={() => nav(MainTab.HOME, SubView.ANNOUNCEMENT_DETAIL, item.id)}
                            badges={badges}
                        >
                            <p className="text-slate-200 line-clamp-2 text-sm font-medium">{item.content}</p>
                        </FeedCard>

                        {/* Transparent Spacer Div matching EventsScreen */}
                        {index < announcements.length - 1 && <div className="w-full h-2 bg-transparent" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
