import React, { useState, useEffect } from 'react';
import { 
  AppScreen, MainTab, SubView, NavState, Theme, Event, Announcement, User 
} from './types';
import { MOCK_EVENTS, MOCK_ANNOUNCEMENTS, MOCK_CONTACTS, VOLUNTEER_SERVICES, MOCK_USER, Icons } from './constants';
import { Header, BottomNav, ScreenContainer } from './components/Layout';
import { Button, Card, Input, TextArea } from './components/ui.tsx';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- SCREENS ---

// 1. HOME SCREEN (Redesigned with Dashboard Title in Body)
const HomeScreen: React.FC<{ 
  nav: (tab: MainTab, sub?: SubView) => void,
  upcomingEvent: Event,
  latestAnnouncement: Announcement,
  user: User
}> = ({ nav, upcomingEvent, latestAnnouncement, user }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* 1. Dashboard Title & Weather Widget */}
      <div className="flex justify-between items-center mb-6 pt-1">
        <div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white leading-tight font-nunito">Dashboard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Overview</p>
        </div>

        <div className="flex flex-col items-end">
            <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl px-3 py-2 flex items-center gap-2">
                <Icons.Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">28°C</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">Skyline Tower</span>
        </div>
      </div>

      {/* 2. Hero: Featured Event */}
      <section>
        <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-nunito">Happening Soon</h3>
            <button onClick={() => nav(MainTab.EVENTS)} className="text-xs font-bold text-spark-green hover:text-spark-darkGreen transition-colors">View All</button>
        </div>
        <div 
            onClick={() => nav(MainTab.EVENTS)}
            className="group relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 cursor-pointer"
        >
            <img 
                src={upcomingEvent.imageUrl} 
                alt={upcomingEvent.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
            
            {/* Floating Date Badge */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl p-3 text-center min-w-[3.5rem] shadow-lg">
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-90">{new Date(upcomingEvent.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="block text-xl font-extrabold font-nunito">{new Date(upcomingEvent.date).getDate()}</span>
            </div>

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-spark-green text-white text-[10px] font-bold rounded-lg shadow-sm">
                        {upcomingEvent.type}
                    </span>
                    {upcomingEvent.isHighPriority && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-sm animate-pulse">
                            HIGH PRIORITY
                        </span>
                    )}
                 </div>
                 <h3 className="text-2xl font-bold text-white leading-tight mb-3 font-nunito drop-shadow-md">{upcomingEvent.title}</h3>
                 <div className="flex items-center text-slate-100 text-sm font-medium gap-4">
                    <span className="flex items-center gap-1.5"><Icons.Clock className="w-4 h-4 text-emerald-400"/> {upcomingEvent.time}</span>
                    <span className="flex items-center gap-1.5"><Icons.MapPin className="w-4 h-4 text-emerald-400"/> {upcomingEvent.location}</span>
                 </div>
            </div>
        </div>
      </section>

      {/* 3. Quick Actions */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 font-nunito">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
            {/* Volunteer */}
            <button onClick={() => nav(MainTab.MORE, SubView.VOLUNTEER)} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-[1.2rem] bg-orange-50 dark:bg-slate-800 flex items-center justify-center text-spark-orange shadow-sm border border-orange-100 dark:border-slate-700 group-hover:scale-110 group-hover:border-orange-200 transition-all duration-300">
                    <Icons.Heart className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 text-center tracking-tight">Volunteer</span>
            </button>

             {/* Emergency */}
             <button onClick={() => nav(MainTab.EMERGENCY)} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-[1.2rem] bg-red-50 dark:bg-slate-800 flex items-center justify-center text-red-500 shadow-sm border border-red-100 dark:border-slate-700 group-hover:scale-110 group-hover:border-red-200 transition-all duration-300">
                    <Icons.Phone className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 text-center tracking-tight">Emergency</span>
            </button>

            {/* Admin */}
            <button onClick={() => nav(MainTab.MORE, SubView.ADMIN)} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-[1.2rem] bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 dark:border-slate-700 group-hover:scale-110 group-hover:border-indigo-200 transition-all duration-300">
                    <Icons.Settings className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 text-center tracking-tight">Admin</span>
            </button>

            {/* Notices (Replacing More) */}
            <button onClick={() => nav(MainTab.HOME, SubView.ANNOUNCEMENTS)} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-[1.2rem] bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 dark:border-slate-700 group-hover:scale-110 group-hover:border-blue-200 transition-all duration-300">
                    <Icons.Megaphone className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 text-center tracking-tight">Notices</span>
            </button>
        </div>
      </section>

      {/* 4. Latest Announcement Banner - Redesigned to match Hero Card */}
      <section>
        <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-nunito">Notice Board</h3>
            <button onClick={() => nav(MainTab.HOME, SubView.ANNOUNCEMENTS)} className="text-xs font-bold text-spark-orange hover:text-orange-600 transition-colors">View All</button>
        </div>
        <div 
            onClick={() => nav(MainTab.HOME, SubView.ANNOUNCEMENTS)}
            className="group relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-900/10 dark:shadow-orange-900/20 cursor-pointer"
        >
             {/* Image */}
            <img 
                src={latestAnnouncement.imageUrl || 'https://images.unsplash.com/photo-1605218457332-dd602d5df02d?q=80&w=800&auto=format&fit=crop'} 
                alt={latestAnnouncement.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay - Warm/Dark for Announcements */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90" />
            
            {/* Author Badge - Moved to Top Left for cleaner stunning look */}
            <div className="absolute top-4 left-4">
                 <span className="px-3 py-1.5 bg-spark-orange/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-lg border border-white/20 uppercase tracking-wide">
                    {latestAnnouncement.author}
                </span>
            </div>

            {/* Date Badge - Updated to consistent Hero Style */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl p-3 text-center min-w-[3.5rem] shadow-lg">
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-90">{new Date(latestAnnouncement.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="block text-xl font-extrabold font-nunito">{new Date(latestAnnouncement.date).getDate()}</span>
            </div>

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                 <h3 className="text-xl font-bold text-white leading-tight mb-2 font-nunito drop-shadow-md">{latestAnnouncement.title}</h3>
                 <p className="text-slate-200 text-sm line-clamp-2 leading-relaxed opacity-90 mb-3">
                    {latestAnnouncement.content}
                 </p>
                 
                 {/* Footer - Updated to consistent Hero Style */}
                 <div className="flex items-center text-slate-100 text-sm font-medium gap-4">
                    {(latestAnnouncement.validFrom && latestAnnouncement.validTo) ? (
                        <>
                           <span className="flex items-center gap-1.5">
                               <Icons.Calendar className="w-4 h-4 text-orange-400"/> 
                               {new Date(latestAnnouncement.validFrom).toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {new Date(latestAnnouncement.validTo).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                           </span>
                           {latestAnnouncement.eta && (
                               <span className="flex items-center gap-1.5">
                                   <Icons.Clock className="w-4 h-4 text-orange-400"/> {latestAnnouncement.eta}
                               </span>
                           )}
                        </>
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <Icons.Calendar className="w-4 h-4 text-orange-400"/> Published {new Date(latestAnnouncement.date).toLocaleDateString()}
                        </span>
                    )}
                 </div>
            </div>
        </div>
      </section>
    </div>
  )
}

// 2. EVENTS SCREEN (Redesigned)
const EventsScreen: React.FC<{ 
  events: Event[], 
  onSelect: (id: string) => void 
}> = ({ events, onSelect }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-20">
       {/* Filter Chips */}
       <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
          {['All', 'Cultural', 'Workshops', 'Drives', 'Sports', 'Meetings'].map((filter, i) => (
              <button 
                key={filter} 
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    i === 0 
                    ? 'bg-spark-green text-white shadow-lg shadow-emerald-500/30 ring-2 ring-transparent' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-spark-green/50 dark:hover:border-spark-green/50'
                }`}
              >
                  {filter}
              </button>
          ))}
       </div>

        {events.map(event => {
            const dateObj = new Date(event.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            return (
            <div 
                key={event.id} 
                className="group bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 dark:hover:shadow-emerald-900/20 border border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1" 
                onClick={() => onSelect(event.id)}
            >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden">
                    <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2.5 text-center min-w-[3.5rem] shadow-lg ring-1 ring-black/5">
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{month}</span>
                        <span className="block text-xl font-extrabold text-slate-800 dark:text-white font-nunito">{day}</span>
                    </div>

                    {/* Category Badge */}
                     <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-spark-green/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm border border-white/20">
                            {event.type}
                        </span>
                     </div>
                     
                     {/* Priority Badge */}
                     {event.isHighPriority && (
                        <div className="absolute bottom-4 left-4">
                             <span className="px-2 py-1 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-sm border border-red-400/30 flex items-center gap-1 animate-pulse">
                                <Icons.Sparkles className="w-3 h-3" /> HIGH PRIORITY
                            </span>
                        </div>
                     )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 font-nunito leading-tight group-hover:text-spark-green transition-colors">
                        {event.title}
                    </h3>
                    
                    <div className="flex flex-col gap-2.5 mb-5">
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-3">
                            <div className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                                <Icons.Clock className="w-3.5 h-3.5"/> 
                            </div>
                            <span className="truncate font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-3">
                            <div className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                                <Icons.MapPin className="w-3.5 h-3.5"/> 
                            </div>
                            <span className="truncate font-medium">{event.location}</span>
                        </div>
                    </div>

                    {/* Footer: Capacity & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                             <div className="flex -space-x-2.5">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        <Icons.User className="w-3.5 h-3.5 opacity-50" />
                                    </div>
                                ))}
                             </div>
                             <span className="text-xs font-bold text-slate-400 dark:text-slate-500">+{event.registeredCount} joined</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-spark-green group-hover:translate-x-1 transition-transform">
                             Details <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
                        </div>
                    </div>
                </div>
            </div>
        )})}
    </div>
  );
}

// 3. EVENT DETAIL SCREEN (Redesigned Stunning Version)
const EventDetailScreen: React.FC<{ event: Event }> = ({ event }) => {
  const percentFull = Math.round((event.registeredCount / event.capacity) * 100);

  const handleShare = () => {
     const text = `Join me at ${event.title}! On ${new Date(event.date).toLocaleDateString()} at ${event.location}.`;
     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
        {/* 1. Immersive Hero Section */}
        <div className="relative w-full h-96 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/20">
             <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
             
             {/* Gradient & Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
             
             {/* Top Badges */}
             <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                 <span className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/20 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                    {event.type}
                 </span>
                 {event.isHighPriority && (
                    <span className="px-3 py-1.5 bg-red-500/90 backdrop-blur-xl border border-red-400/30 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                        High Priority
                    </span>
                 )}
             </div>

            <div className="absolute top-6 right-6">
                <button onClick={handleShare} className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
                    <Icons.Share className="w-5 h-5" />
                </button>
            </div>

             {/* Bottom Title Area */}
             <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-3xl font-extrabold text-white leading-tight font-nunito mb-2 drop-shadow-lg">{event.title}</h2>
                <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                    <Icons.MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{event.location}</span>
                </div>
             </div>
        </div>

        {/* 2. Key Info Grid */}
        <div className="grid grid-cols-3 gap-3">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-spark-green mb-2">
                    <Icons.Calendar className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] uppercase font-bold text-slate-400">Date</span>
                 <span className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                    {new Date(event.date).getDate()} {new Date(event.date).toLocaleString('default', { month: 'short' })}
                 </span>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-full text-spark-orange mb-2">
                    <Icons.Clock className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] uppercase font-bold text-slate-400">Time</span>
                 <span className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                    {event.time.split('-')[0].trim()}
                 </span>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-500 mb-2">
                    <Icons.User className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] uppercase font-bold text-slate-400">Spots</span>
                 <span className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                    {event.capacity - event.registeredCount} Left
                 </span>
             </div>
        </div>

        {/* 3. Description & Host */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
             {/* Host */}
             <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                 <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Community+Admin&background=10B981&color=fff" alt="Host" />
                 </div>
                 <div>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hosted By</p>
                     <p className="text-slate-800 dark:text-white font-bold text-lg">Community Board</p>
                 </div>
             </div>

             {/* About */}
             <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 font-nunito">About the Event</h3>
                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {event.description}
                 </p>
             </div>

            {/* Event Essentials (Requirements & Benefits) */}
            <div className="grid grid-cols-1 gap-4 pt-2">
                 {/* Requirements */}
                 {event.requirements.length > 0 && (
                     <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300">
                                <Icons.Settings className="w-4 h-4" /> 
                            </div>
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

                 {/* Benefits */}
                 {event.benefits.length > 0 && (
                     <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/50">
                         <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800 rounded-lg text-emerald-600 dark:text-emerald-300">
                                <Icons.Sparkles className="w-4 h-4" /> 
                            </div>
                            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-100 uppercase tracking-wide">Event Highlights</h4>
                        </div>
                        <ul className="space-y-3">
                            {event.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-white dark:bg-emerald-800 rounded-full p-0.5 shadow-sm">
                                        <Icons.Check className="w-3 h-3 text-emerald-500 dark:text-emerald-300" />
                                    </div>
                                    <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                     </div>
                 )}
            </div>
        </div>

        {/* 4. Attendees Preview */}
        <div className="flex items-center justify-between px-2">
            <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="user" className="w-full h-full object-cover"/>
                    </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    +{event.registeredCount - 4}
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Have already joined</p>
                <p className="text-sm font-bold text-spark-green">See who's going</p>
            </div>
        </div>

        {/* 5. Sticky Action Button */}
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30">
             <Button 
                fullWidth 
                size="lg" 
                className="shadow-2xl shadow-emerald-500/40 text-lg py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 border border-emerald-400/50"
                onClick={() => alert('Successfully Registered!')}
            >
                Join Event • Free
             </Button>
        </div>
    </div>
  );
}

// 4. ANNOUNCEMENTS SCREEN (Redesigned List)
const AnnouncementsScreen: React.FC<{ announcements: Announcement[], onSelect: (id: string) => void }> = ({ announcements, onSelect }) => {
    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <h2 className="text-2xl font-extrabold font-nunito text-slate-800 dark:text-white px-1">Community Board</h2>
            
            {announcements.map(item => (
                <div 
                    key={item.id} 
                    onClick={() => onSelect(item.id)} 
                    className="group bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-900/10 border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                    {/* Header Image if available */}
                    <div className="relative h-36 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-slate-700 dark:to-slate-800">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Icons.Megaphone className="w-12 h-12 text-orange-200 dark:text-slate-600" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-spark-orange text-[10px] font-bold rounded-full shadow-sm">
                                {item.author}
                            </span>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400">
                            <Icons.Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-spark-orange transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {item.content}
                        </p>
                        
                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-spark-orange group-hover:translate-x-1 transition-transform">
                            Read Full Notice <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 4.1 ANNOUNCEMENT DETAIL SCREEN (New Stunning View)
const AnnouncementDetailScreen: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Hero Section */}
            <div className="relative w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-900/20">
                 {announcement.imageUrl ? (
                     <img src={announcement.imageUrl} alt={announcement.title} className="w-full h-full object-cover" />
                 ) : (
                     <div className="w-full h-full bg-gradient-to-br from-spark-orange to-orange-600 flex items-center justify-center">
                         <Icons.Megaphone className="w-24 h-24 text-white/20" />
                     </div>
                 )}
                 
                 {/* Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                 
                 <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-spark-orange text-white text-[10px] font-bold rounded-full shadow-lg border border-white/20 uppercase tracking-wide">
                              Important Update
                          </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-white leading-tight font-nunito drop-shadow-lg">
                          {announcement.title}
                      </h2>
                 </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 shadow-sm">
                     <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-full text-spark-orange">
                         <Icons.User className="w-5 h-5" />
                     </div>
                     <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400">Published By</p>
                         <p className="text-sm font-bold text-slate-800 dark:text-white">{announcement.author}</p>
                     </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 shadow-sm">
                     <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-300">
                         <Icons.Calendar className="w-5 h-5" />
                     </div>
                     <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                         <p className="text-sm font-bold text-slate-800 dark:text-white">
                             {new Date(announcement.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                         </p>
                     </div>
                 </div>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm min-h-[12rem]">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 font-nunito flex items-center gap-2">
                    <Icons.Megaphone className="w-5 h-5 text-spark-orange" />
                    Notice Details
                </h3>
                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                     <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                         {announcement.content}
                     </p>
                </div>

                {/* Validity / Additional Info if present */}
                {(announcement.validFrom || announcement.validTo) && (
                    <div className="mt-8 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Effective Dates</p>
                        <div className="flex gap-4">
                             {announcement.validFrom && (
                                 <div>
                                     <span className="block text-[10px] text-slate-500">From</span>
                                     <span className="font-bold text-slate-700 dark:text-slate-200">{new Date(announcement.validFrom).toLocaleDateString()}</span>
                                 </div>
                             )}
                             {announcement.validTo && (
                                 <div>
                                     <span className="block text-[10px] text-slate-500">Until</span>
                                     <span className="font-bold text-slate-700 dark:text-slate-200">{new Date(announcement.validTo).toLocaleDateString()}</span>
                                 </div>
                             )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="pt-4 text-center">
                 <p className="text-xs text-slate-400">If you have questions regarding this notice, please contact the admin office.</p>
            </div>
        </div>
    );
}

// 5. EMERGENCY SCREEN
const EmergencyScreen: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
            {MOCK_CONTACTS.map(contact => (
                <a href={`tel:${contact.phone}`} key={contact.id} className="block group">
                    <Card className="p-4 flex flex-col items-center justify-center text-center h-full hover:border-red-300 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 transition-transform">
                             {contact.iconName === 'Police' && <Icons.Shield className="w-6 h-6"/>}
                             {contact.iconName === 'Ambulance' && <Icons.Heart className="w-6 h-6"/>}
                             {contact.iconName === 'Fire' && <Icons.Phone className="w-6 h-6"/>} {/* Reuse generic for now or specific if available */}
                             {contact.iconName === 'Shield' && <Icons.Shield className="w-6 h-6"/>}
                             {contact.iconName === 'General' && <Icons.Phone className="w-6 h-6"/>}
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{contact.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{contact.role}</p>
                        <span className="text-red-500 font-bold text-sm bg-red-50 dark:bg-transparent px-2 py-1 rounded">{contact.phone}</span>
                    </Card>
                </a>
            ))}
        </div>
    );
};

// 6. VOLUNTEER SCREEN
const VolunteerScreen: React.FC = () => {
    const [selected, setSelected] = useState<string[]>([]);
    
    const toggle = (service: string) => {
        setSelected(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full text-emerald-600 dark:text-emerald-300"><Icons.Sparkles className="w-5 h-5" /></div>
                    <div>
                        <h3 className="font-bold text-emerald-800 dark:text-emerald-200">Community Hero</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Your contributions make a difference.</p>
                    </div>
                 </div>
             </div>

             <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-3">I can help with:</h3>
                <div className="space-y-2">
                    {VOLUNTEER_SERVICES.map(service => {
                        const isSelected = selected.includes(service);
                        return (
                            <div 
                                key={service} 
                                onClick={() => toggle(service)}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-spark-green bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                            >
                                <span className={`font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{service}</span>
                                {isSelected && <Icons.Check className="w-5 h-5 text-spark-green" />}
                            </div>
                        );
                    })}
                </div>
             </div>

             <Button fullWidth onClick={() => alert('Preferences Saved!')}>Save Preferences</Button>
        </div>
    );
};

// 7. ADMIN SCREEN
const AdminScreen: React.FC<{ onCreateEvent: (e: Event) => void, onCreateAnnouncement: (a: Announcement) => void }> = ({ onCreateEvent, onCreateAnnouncement }) => {
    const [activeTab, setActiveTab] = useState<'EVENT' | 'ANNOUNCE'>('EVENT');
    
    // Simple Chart Data
    const data = [
      { name: 'Jan', events: 4 },
      { name: 'Feb', events: 3 },
      { name: 'Mar', events: 6 },
      { name: 'Apr', events: 2 },
    ];

    const handleEventSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
        const date = (form.elements.namedItem('date') as HTMLInputElement).value;
        const newEvent: Event = {
            id: `new_${Date.now()}`,
            title,
            date,
            time: 'TBD',
            location: 'Community Center',
            imageUrl: 'https://picsum.photos/800/600',
            description: 'New community event.',
            type: 'GENERAL',
            isHighPriority: false,
            requirements: [],
            benefits: [],
            capacity: 100,
            registeredCount: 0
        };
        onCreateEvent(newEvent);
        alert('Event Created!');
        form.reset();
    };

    return (
        <div className="space-y-6 animate-fade-in">
             {/* Stats Chart */}
             <Card className="p-4">
                 <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Event Frequency (2024)</h3>
                 <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{fill: 'transparent'}}
                            />
                            <Bar dataKey="events" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
             </Card>

             {/* Tab Switcher */}
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                 <button onClick={() => setActiveTab('EVENT')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'EVENT' ? 'bg-white dark:bg-slate-700 shadow-sm text-spark-green' : 'text-slate-500'}`}>Create Event</button>
                 <button onClick={() => setActiveTab('ANNOUNCE')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'ANNOUNCE' ? 'bg-white dark:bg-slate-700 shadow-sm text-spark-orange' : 'text-slate-500'}`}>Post Announcement</button>
             </div>

             {activeTab === 'EVENT' ? (
                 <form onSubmit={handleEventSubmit} className="space-y-4">
                     <Input name="title" label="Event Title" placeholder="e.g., Summer Pool Party" required />
                     <Input name="date" type="datetime-local" label="Date & Time" required />
                     <TextArea label="Description" placeholder="Event details..." rows={3} />
                     <div className="flex items-center gap-2">
                        <input type="checkbox" id="priority" className="w-4 h-4 text-spark-green rounded focus:ring-spark-green"/>
                        <label htmlFor="priority" className="text-sm text-slate-700 dark:text-slate-300">Mark as High Priority</label>
                     </div>
                     <Button type="submit" fullWidth>Create Event</Button>
                 </form>
             ) : (
                 <form onSubmit={(e) => { e.preventDefault(); alert('Announcement Sent!'); }} className="space-y-4">
                     <Input label="Title" placeholder="e.g., Water Shutoff" />
                     <TextArea label="Content" placeholder="Details..." rows={4} />
                     <Button variant="secondary" type="submit" fullWidth>Send Announcement</Button>
                 </form>
             )}
        </div>
    );
};

// 8. PROFILE SCREEN (New Stunning Profile)
const ProfileScreen: React.FC<{ user: User, onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onUpdate(formData);
        alert('Profile Updated Successfully!');
    };

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Header Art & Avatar */}
            <div className="relative mb-16">
                 <div className="h-40 w-full rounded-[2.5rem] bg-gradient-to-r from-emerald-400 to-teal-500 overflow-hidden relative shadow-lg shadow-emerald-500/20">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                 </div>
                 
                 <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                      <div className="relative group">
                          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 p-0.5 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                              <img src={formData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                          </div>
                          <button className="absolute bottom-0 right-0 p-2 bg-spark-green text-white rounded-full border-4 border-white dark:border-slate-900 shadow-lg hover:scale-110 transition-transform">
                              <Icons.Camera className="w-4 h-4" />
                          </button>
                      </div>
                 </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white font-nunito">{formData.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Resident Member</p>
            </div>

            {/* Editable Details */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-5">
                 <div className="flex items-center gap-2 mb-2">
                     <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-spark-green">
                         <Icons.Edit className="w-4 h-4" />
                     </div>
                     <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">Personal Details</h3>
                 </div>

                 <div className="space-y-4">
                     <div>
                         <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Full Name</label>
                         <div className="relative">
                             <Input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="pl-11"
                             />
                             <Icons.User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                         </div>
                     </div>
                     
                     <div>
                         <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Email Address</label>
                         <div className="relative">
                             <Input 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className="pl-11"
                             />
                             <Icons.Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                         </div>
                     </div>

                     <div>
                         <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Phone Number</label>
                         <div className="relative">
                             <Input 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                className="pl-11"
                             />
                             <Icons.Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                         </div>
                     </div>

                     <div>
                         <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Apartment Unit</label>
                         <div className="relative">
                             <Input 
                                name="unit" 
                                value={formData.unit} 
                                onChange={handleChange} 
                                className="pl-11"
                             />
                             <Icons.Building className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                         </div>
                     </div>
                 </div>

                 <Button fullWidth onClick={handleSubmit} className="mt-4">Update Profile</Button>
            </div>
        </div>
    );
};

// 9. MORE SCREEN
const MoreScreen: React.FC<{ nav: (sub: SubView) => void }> = ({ nav }) => {
    return (
        <div className="space-y-4 animate-fade-in">
             {/* Notices Button (New) - Blue */}
             <button onClick={() => nav(SubView.ANNOUNCEMENTS)} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500 border border-blue-100 dark:border-blue-900/30">
                        <Icons.Megaphone className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Community Notices</h3>
                        <p className="text-slate-500 text-sm">Latest updates & alerts</p>
                    </div>
                </div>
                <Icons.ChevronLeft className="w-5 h-5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
             </button>

             {/* Volunteer Button - Orange (Synced with Dashboard) */}
             <button onClick={() => nav(SubView.VOLUNTEER)} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-spark-orange border border-orange-100 dark:border-orange-900/30">
                        <Icons.Heart className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Volunteer Profile</h3>
                        <p className="text-slate-500 text-sm">Manage your skills</p>
                    </div>
                </div>
                <Icons.ChevronLeft className="w-5 h-5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
             </button>

             {/* Admin Button - Indigo (Synced with Dashboard) */}
             <button onClick={() => nav(SubView.ADMIN)} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-500 border border-indigo-100 dark:border-indigo-900/30">
                        <Icons.Settings className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Admin Panel</h3>
                        <p className="text-slate-500 text-sm">Create events & alerts</p>
                    </div>
                </div>
                <Icons.ChevronLeft className="w-5 h-5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
             </button>
        </div>
    );
};

// --- APP COMPONENT ---

export default function App() {
  const [appState, setAppState] = useState<AppScreen>(AppScreen.SPLASH);
  const [theme, setTheme] = useState<Theme>('light');
  const [navState, setNavState] = useState<NavState>({
    currentTab: MainTab.HOME,
    currentSubView: SubView.NONE,
  });
  
  // Data State
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);

  useEffect(() => {
    // Splash Screen Timer
    if (appState === AppScreen.SPLASH) {
      const timer = setTimeout(() => setAppState(AppScreen.LOGIN), 2000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  useEffect(() => {
    // Apply Theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleNav = (tab: MainTab, sub: SubView = SubView.NONE) => {
    setNavState({ currentTab: tab, currentSubView: sub });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventSelect = (id: string) => {
    setNavState(prev => ({ ...prev, currentSubView: SubView.EVENT_DETAIL, selectedId: id }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnnouncementSelect = (id: string) => {
      setNavState(prev => ({ ...prev, currentSubView: SubView.ANNOUNCEMENT_DETAIL, selectedId: id }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setNavState(prev => ({ ...prev, currentSubView: SubView.NONE, selectedId: undefined }));
  };

  const handleUserUpdate = (updatedUser: User) => {
      setCurrentUser(updatedUser);
      // Ideally call API here
  };

  // Render Content based on state
  const renderContent = () => {
    // 1. Overlay Views (Full Screen feel)
    if (navState.currentSubView === SubView.EVENT_DETAIL && navState.selectedId) {
       const event = events.find(e => e.id === navState.selectedId);
       if (event) return <EventDetailScreen event={event} />;
    }
    if (navState.currentSubView === SubView.ANNOUNCEMENTS) {
        return <AnnouncementsScreen announcements={announcements} onSelect={handleAnnouncementSelect} />;
    }
    if (navState.currentSubView === SubView.ANNOUNCEMENT_DETAIL && navState.selectedId) {
       const announcement = announcements.find(a => a.id === navState.selectedId);
       if (announcement) return <AnnouncementDetailScreen announcement={announcement} />;
    }
    if (navState.currentSubView === SubView.VOLUNTEER) return <VolunteerScreen />;
    if (navState.currentSubView === SubView.PROFILE) {
        return <ProfileScreen user={currentUser} onUpdate={handleUserUpdate} />;
    }
    if (navState.currentSubView === SubView.ADMIN) {
        return <AdminScreen 
            onCreateEvent={(e) => setEvents(prev => [e, ...prev])} 
            onCreateAnnouncement={(a) => setAnnouncements(prev => [a, ...prev])} 
        />;
    }

    // 2. Tab Views
    switch (navState.currentTab) {
      case MainTab.HOME:
        return <HomeScreen nav={handleNav} upcomingEvent={events[0]} latestAnnouncement={announcements[0]} user={currentUser} />;
      case MainTab.EVENTS:
        return <EventsScreen events={events} onSelect={handleEventSelect} />;
      case MainTab.EMERGENCY:
        return <EmergencyScreen />;
      case MainTab.MORE:
        return <MoreScreen nav={(sub) => setNavState(prev => ({...prev, currentSubView: sub}))} />;
      default:
        return <div>Not Found</div>;
    }
  };

  // --- RENDER FLOW ---

  if (appState === AppScreen.SPLASH) {
    return (
      <div className="fixed inset-0 bg-spark-green flex flex-col items-center justify-center text-white">
         <div className="bg-white p-4 rounded-full mb-4 shadow-xl animate-bounce">
            <Icons.Sparkles className="w-12 h-12 text-spark-green" />
         </div>
         <h1 className="text-3xl font-extrabold tracking-widest font-nunito">RAJSRI SPARK</h1>
         <p className="mt-2 text-emerald-100 text-sm tracking-wide">Community. Connected.</p>
      </div>
    );
  }

  if (appState === AppScreen.LOGIN) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
         <div className="w-full max-w-sm space-y-8 text-center">
             <div>
                 <div className="mx-auto bg-spark-green w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30">
                    <Icons.Sparkles className="w-8 h-8" />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-white font-nunito">Welcome Home</h2>
                 <p className="mt-2 text-slate-500 dark:text-slate-400">Sign in to access your community.</p>
             </div>
             <div className="space-y-4">
                 <Input type="email" placeholder="Email Address" defaultValue="resident@rajsri.com" />
                 <Input type="password" placeholder="Password" defaultValue="password" />
                 <Button fullWidth size="lg" onClick={() => setAppState(AppScreen.MAIN)}>Login</Button>
             </div>
             <p className="text-xs text-slate-400">For demo purposes, just click Login.</p>
         </div>
      </div>
    );
  }

  // Calculate Header Title & Custom Content
  let title = "Rajsri SPARK";
  let showBack = false;
  let headerCustomTitle: React.ReactNode | undefined;

  if (navState.currentSubView !== SubView.NONE) {
    showBack = true;
    switch(navState.currentSubView) {
        case SubView.EVENT_DETAIL: title = "Event Details"; break;
        case SubView.ANNOUNCEMENTS: title = "Announcements"; break;
        case SubView.ANNOUNCEMENT_DETAIL: title = "Notice Details"; break;
        case SubView.VOLUNTEER: title = "Volunteer Profile"; break;
        case SubView.PROFILE: title = "My Profile"; break;
        case SubView.ADMIN: title = "Admin Panel"; break;
    }
  } else {
    switch(navState.currentTab) {
        case MainTab.HOME:
            // Custom Profile in Header for Home Screen
            headerCustomTitle = (
                <div 
                    className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 py-1 px-2 -ml-2 rounded-xl transition-colors"
                    onClick={() => handleNav(MainTab.HOME, SubView.PROFILE)}
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800">
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-spark-green border-2 border-white dark:border-slate-800 rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">Good Morning</p>
                        <h2 className="text-sm font-extrabold text-slate-800 dark:text-white leading-none group-hover:text-spark-green transition-colors">
                            {currentUser.name.split(' ')[0]}
                        </h2>
                    </div>
                </div>
            );
            title = ""; // Ignored
            break;
        case MainTab.EVENTS: title = "Community Events"; break;
        case MainTab.EMERGENCY: title = "Emergency Directory"; break;
        case MainTab.MORE: title = "More"; break;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header 
        title={title} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        showBack={showBack}
        onBack={handleBack}
        customTitle={headerCustomTitle}
      />
      
      <ScreenContainer>
         {renderContent()}
      </ScreenContainer>
      
      <BottomNav 
        activeTab={navState.currentTab} 
        onTabChange={(tab) => {
            setNavState({ currentTab: tab, currentSubView: SubView.NONE });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    </div>
  );
}