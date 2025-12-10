
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { useNav, useData, useToast } from '../context';
import { Button } from '../components/ui.tsx';

export const AnnouncementDetailScreen: React.FC = () => {
    const { announcements } = useData();
    const { navState, goBack } = useNav();
    const { showToast } = useToast();
    
    const announcement = announcements.find(a => a.id === navState.selectedId);

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 200);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    if (!announcement) return null;

    const buttonClass = isScrolled 
        ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-white shadow-md" 
        : "bg-black/20 text-white backdrop-blur-md border border-white/10";

    return (
        <div className="animate-fade-in pb-32 bg-slate-50 dark:bg-slate-900 min-h-screen relative">
            {/* Fixed Navigation Buttons */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 pt-6 flex justify-between items-start pointer-events-none max-w-md mx-auto">
                 <button onClick={goBack} className={`pointer-events-auto p-2.5 rounded-full transition-all duration-300 ${buttonClass}`}>
                    <Icons.ChevronLeft className="w-6 h-6" />
                 </button>
                 <button className={`pointer-events-auto p-2.5 rounded-full transition-all duration-300 ${buttonClass}`}>
                    <Icons.Share className="w-5 h-5" />
                 </button>
            </div>

            {/* Hero Image */}
            <div className="relative w-full h-[55vh] rounded-[8vw] overflow-hidden shadow-2xl shadow-orange-900/20 mb-8">
                 {announcement.imageUrl ? (
                    <img src={announcement.imageUrl} alt={announcement.title} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full bg-spark-orange flex items-center justify-center">
                        <Icons.Megaphone className="w-24 h-24 text-white/20" />
                    </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                 
                 <div className="absolute bottom-0 left-0 right-0 p-8 pb-10">
                      <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-spark-orange text-white text-[10px] font-bold rounded-full shadow-lg border border-white/20 uppercase tracking-wide">Notice</span>
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-lg border border-white/20 uppercase tracking-wide">Important</span>
                      </div>
                      <h2 className="text-3xl font-extrabold text-white leading-tight font-nunito drop-shadow-lg">{announcement.title}</h2>
                 </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 px-4 -mt-12 relative z-10 mb-8">
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                     <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-full text-spark-orange mb-1"><Icons.Calendar className="w-4 h-4" /></div>
                     <span className="text-xs font-bold text-slate-800 dark:text-white">{new Date(announcement.date).getDate()} {new Date(announcement.date).toLocaleString('default', { month: 'short' })}</span>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                     <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-500 mb-1"><Icons.Clock className="w-4 h-4" /></div>
                     <span className="text-xs font-bold text-slate-800 dark:text-white">Active</span>
                 </div>
            </div>

            {/* Content Container */}
            <div className="bg-white dark:bg-slate-800 mx-4 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
                 <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                     <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 overflow-hidden ring-2 ring-slate-100 dark:ring-slate-700 flex items-center justify-center">
                        <span className="text-spark-orange font-bold text-lg">{announcement.author.charAt(0)}</span>
                     </div>
                     <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Published By</p>
                         <p className="text-slate-800 dark:text-white font-bold text-lg">{announcement.author}</p>
                     </div>
                 </div>
                 
                 <div>
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 font-nunito">About this Notice</h3>
                     <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{announcement.content}</p>
                 </div>
                
                {announcement.validFrom && (
                     <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Icons.Settings className="w-4 h-4 text-slate-500" /> 
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Validity Period</h4>
                        </div>
                        <div className="space-y-3">
                             <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-spark-orange shrink-0" />
                                <span className="font-medium">From: {new Date(announcement.validFrom).toLocaleDateString()}</span>
                             </div>
                             {announcement.validTo && (
                                <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                    <span className="font-medium">To: {new Date(announcement.validTo).toLocaleDateString()}</span>
                                </div>
                             )}
                        </div>
                     </div>
                )}
            </div>

            {/* Fixed Bottom Dock */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
                <div className="max-w-md mx-auto flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Priority</span>
                        <span className="text-lg font-black font-nunito text-slate-800 dark:text-white">
                            Standard
                        </span>
                    </div>
                    <Button 
                        fullWidth 
                        size="lg" 
                        className="shadow-xl rounded-2xl text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/30" 
                        onClick={() => showToast('Notice Acknowledged', 'info')}
                    >
                        Acknowledge
                    </Button>
                </div>
            </div>
        </div>
    );
};
