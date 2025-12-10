
import React from 'react';
import { MainTab, SubView } from '../types';
import { Icons } from '../constants';
import { useNav, useTheme } from '../context';
import { TopBar } from '../components/Layout';

export const MoreScreen: React.FC = () => {
    const { nav } = useNav();
    const { goBack } = useNav();
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="space-y-4 animate-fade-in">
             <TopBar theme={theme} toggleTheme={toggleTheme} onBack={goBack} title="More" showBack />
             <div className="px-4 space-y-4">
             <button onClick={() => nav(MainTab.HOME, SubView.ANNOUNCEMENTS)} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500"><Icons.Megaphone className="w-6 h-6" /></div><div className="text-left"><h3 className="font-bold text-slate-800 dark:text-white text-lg">Community Notices</h3></div></div>
                <Icons.ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
             </button>
             <button onClick={() => nav(MainTab.MORE, SubView.VOLUNTEER)} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-center gap-4"><div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-spark-orange"><Icons.Heart className="w-6 h-6" /></div><div className="text-left"><h3 className="font-bold text-slate-800 dark:text-white text-lg">Volunteer Profile</h3></div></div>
                <Icons.ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
             </button>
             <button onClick={() => nav(MainTab.MORE, SubView.ADMIN)} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-center gap-4"><div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-500"><Icons.Settings className="w-6 h-6" /></div><div className="text-left"><h3 className="font-bold text-slate-800 dark:text-white text-lg">Admin Panel</h3></div></div>
                <Icons.ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
             </button>
             </div>
        </div>
    );
};
