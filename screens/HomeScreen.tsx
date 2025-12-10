
import React from 'react';
import { MainTab, SubView } from '../types';
import { Icons } from '../constants';
import { useNav, useData, useUser, useTheme } from '../context';

export const HomeScreen: React.FC = () => {
  const { nav } = useNav();
  const { user } = useUser();
  const { events, announcements } = useData();
  const { theme, toggleTheme } = useTheme();

  const upcomingEvent = events[0];
  const latestAnnouncement = announcements[0];

  return (
    <div className="pb-8 animate-fade-in relative bg-slate-50 dark:bg-slate-900">
      <div className="relative h-[38vh] w-full rounded-b-[3rem] overflow-hidden bg-slate-900 shadow-2xl shadow-slate-900/20 z-10">
          <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-slate-900/60 to-slate-900/30 mix-blend-multiply" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/80" />
          </div>
          <div className="absolute top-0 left-0 right-0 p-6 pt-4 flex justify-between items-center z-20">
              <button onClick={() => nav(MainTab.HOME, SubView.PROFILE)} className="group relative">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 p-0.5 bg-white/10 backdrop-blur-sm">
                      <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></div>
              </button>
              <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/10">
                 {theme === 'light' ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
              </button>
          </div>
          <div className="absolute bottom-12 left-0 right-0 px-8 z-20">
              <h1 className="text-3xl font-extrabold text-white leading-tight font-nunito drop-shadow-lg mb-2">Welcome to <br/> Rajsri Spark</h1>
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wide leading-relaxed max-w-[90%] opacity-90">Sports Performance Arts <br/> Recreation and Knowledge</p>
          </div>
      </div>

      <div className="space-y-8 mt-8">
        <section>
            <div className="flex justify-between items-end mb-4 px-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white font-nunito">Upcoming Events</h3>
                <button onClick={() => nav(MainTab.EVENTS)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400">See All</button>
            </div>
            {upcomingEvent ? (
            <div onClick={() => nav(MainTab.EVENTS)} className="group relative w-full aspect-[16/9] rounded-[4vw] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-slate-900/50 cursor-pointer">
                <img src={upcomingEvent.imageUrl} alt={upcomingEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                         <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">{upcomingEvent.type}</span>
                         {upcomingEvent.isHighPriority && <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md border border-red-400/30 text-white text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse shadow-lg shadow-red-500/20">High Priority</span>}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight font-nunito mb-1">{upcomingEvent.title}</h3>
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                        <span>{upcomingEvent.location}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span>{new Date(upcomingEvent.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            ) : <div className="mx-6 aspect-[16/9] rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">No Events</div>}
        </section>

        <section className="px-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-nunito mb-4">Quick Access</h3>
            <div className="grid grid-cols-4 gap-4">
                 {[
                    { label: 'Volunteer', icon: Icons.Heart, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-slate-800', action: () => nav(MainTab.MORE, SubView.VOLUNTEER) },
                    { label: 'Emergency', icon: Icons.Phone, color: 'text-red-500', bg: 'bg-red-50 dark:bg-slate-800', action: () => nav(MainTab.EMERGENCY) },
                    { label: 'Admin', icon: Icons.Settings, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-slate-800', action: () => nav(MainTab.MORE, SubView.ADMIN) },
                    { label: 'Notices', icon: Icons.Megaphone, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-slate-800', action: () => nav(MainTab.HOME, SubView.ANNOUNCEMENTS) },
                 ].map((item, i) => (
                    <button key={i} onClick={item.action} className="flex flex-col items-center gap-2 group">
                        <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:scale-105 transition-transform duration-300`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                    </button>
                 ))}
            </div>
        </section>

        <section>
            <div className="flex justify-between items-end mb-4 px-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white font-nunito">Latest Notice</h3>
                <button onClick={() => nav(MainTab.HOME, SubView.ANNOUNCEMENTS)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400">View Board</button>
            </div>
            {latestAnnouncement && (
                <div onClick={() => nav(MainTab.HOME, SubView.ANNOUNCEMENTS)} className="group relative w-full aspect-[16/9] rounded-[4vw] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-slate-900/50 cursor-pointer">
                    <img src={latestAnnouncement.imageUrl || 'https://picsum.photos/800/400'} alt="Notice" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-spark-orange/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">{latestAnnouncement.author}</span>
                        </div>
                        <h4 className="text-xl font-bold text-white leading-tight font-nunito mb-1 line-clamp-2">{latestAnnouncement.title}</h4>
                        <p className="text-slate-300 text-xs font-medium line-clamp-1">{latestAnnouncement.content}</p>
                    </div>
                </div>
            )}
        </section>
      </div>
    </div>
  )
};
