
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { useNav, useData, useTheme, useToast } from '../context';
import { Button } from '../components/ui.tsx';

export const EventDetailScreen: React.FC = () => {
  const { events } = useData();
  const { navState, goBack } = useNav();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const event = events.find(e => e.id === navState.selectedId);
  
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!event) return null;

  const percentFull = Math.round((event.registeredCount / event.capacity) * 100);
  const isSoldOut = percentFull >= 100;

  // Booking Dock Logic
  const getButtonText = () => {
      if (isSoldOut) return "Sold Out";
      return "Join Event";
  };
  
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
        <div className="relative w-full h-[55vh] rounded-[8vw] overflow-hidden shadow-2xl shadow-emerald-900/20 mb-8">
             <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
             
             <div className="absolute bottom-0 left-0 right-0 p-8 pb-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg">{event.type}</span>
                    {event.isHighPriority && <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg animate-pulse">High Priority</span>}
                </div>
                <h2 className="text-3xl font-extrabold text-white leading-tight font-nunito mb-2 drop-shadow-lg">{event.title}</h2>
                <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                    <Icons.MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{event.location}</span>
                </div>
             </div>
        </div>

        {/* Stats Grid - overlapping slightly if desired, or just below */}
        <div className="grid grid-cols-3 gap-3 px-4 -mt-12 relative z-10 mb-8">
             <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                 <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-spark-green mb-1"><Icons.Calendar className="w-4 h-4" /></div>
                 <span className="text-xs font-bold text-slate-800 dark:text-white">{new Date(event.date).getDate()} {new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
             </div>
             <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                 <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-full text-spark-orange mb-1"><Icons.Clock className="w-4 h-4" /></div>
                 <span className="text-xs font-bold text-slate-800 dark:text-white">{event.time.split('-')[0].trim()}</span>
             </div>
             <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-500 mb-1"><Icons.User className="w-4 h-4" /></div>
                 <span className="text-xs font-bold text-slate-800 dark:text-white">{Math.max(0, event.capacity - event.registeredCount)} Left</span>
             </div>
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-slate-800 mx-4 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
             <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                 <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-slate-100 dark:ring-slate-700">
                    <img src="https://ui-avatars.com/api/?name=Community+Admin&background=10B981&color=fff" alt="Host" />
                 </div>
                 <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hosted By</p>
                     <p className="text-slate-800 dark:text-white font-bold text-lg">Community Board</p>
                 </div>
             </div>
             <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 font-nunito">About the Event</h3>
                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{event.description}</p>
             </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
                 {event.requirements.length > 0 && (
                     <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Icons.Settings className="w-4 h-4 text-slate-500" /> 
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Prerequisites</h4>
                        </div>
                        <ul className="space-y-3">
                            {event.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                    <span className="font-medium">{req}</span>
                                </li>
                            ))}
                        </ul>
                     </div>
                 )}
                 {event.benefits.length > 0 && (
                     <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/50">
                         <div className="flex items-center gap-2 mb-4">
                            <Icons.Sparkles className="w-4 h-4 text-emerald-500" /> 
                            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-100 uppercase tracking-wide">Highlights</h4>
                        </div>
                        <ul className="space-y-3">
                            {event.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Icons.Check className="w-3 h-3 text-emerald-500 mt-1" />
                                    <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                     </div>
                 )}
            </div>
        </div>
        
        {/* Fixed Bottom Booking Dock */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
            <div className="max-w-md mx-auto flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status</span>
                    <span className={`text-lg font-black font-nunito ${isSoldOut ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                        {isSoldOut ? 'Full' : 'Open'}
                    </span>
                </div>
                <Button 
                    fullWidth 
                    size="lg" 
                    disabled={isSoldOut}
                    className={`shadow-xl rounded-2xl text-lg font-bold ${isSoldOut ? 'bg-slate-300 dark:bg-slate-700' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30'}`} 
                    onClick={() => showToast('Successfully Registered! Check email.', 'success')}
                >
                    {getButtonText()}
                </Button>
            </div>
        </div>
    </div>
  );
};
