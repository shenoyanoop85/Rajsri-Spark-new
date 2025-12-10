
import React, { useState } from 'react';
import { Icons, VOLUNTEER_SERVICES } from '../constants';
import { useNav, useTheme } from '../context';
import { Button } from '../components/ui.tsx';
import { TopBar } from '../components/Layout';

export const VolunteerScreen: React.FC = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const { goBack } = useNav();
    const { theme, toggleTheme } = useTheme();
    
    const toggle = (service: string) => setSelected(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);

    return (
        <div className="space-y-6 animate-fade-in">
             <TopBar theme={theme} toggleTheme={toggleTheme} onBack={goBack} title="Volunteer" showBack />
             <div className="px-4 space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full text-emerald-600 dark:text-emerald-300"><Icons.Sparkles className="w-5 h-5" /></div>
                        <div><h3 className="font-bold text-emerald-800 dark:text-emerald-200">Community Hero</h3><p className="text-xs text-emerald-600 dark:text-emerald-400">Your contributions make a difference.</p></div>
                    </div>
                </div>
                <div className="space-y-2">
                    {VOLUNTEER_SERVICES.map(service => {
                        const isSelected = selected.includes(service);
                        return (
                            <div key={service} onClick={() => toggle(service)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-spark-green bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                                <span className={`font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{service}</span>
                                {isSelected && <Icons.Check className="w-5 h-5 text-spark-green" />}
                            </div>
                        );
                    })}
                </div>
                <Button fullWidth onClick={() => alert('Preferences Saved!')}>Save Preferences</Button>
             </div>
        </div>
    );
};
