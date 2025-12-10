
import React from 'react';
import { Icons, MOCK_CONTACTS } from '../constants';
import { useNav, useTheme } from '../context';
import { Card } from '../components/ui.tsx';
import { TopBar } from '../components/Layout';

export const EmergencyScreen: React.FC = () => {
    const { goBack } = useNav();
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="space-y-4">
            <TopBar theme={theme} toggleTheme={toggleTheme} onBack={goBack} title="Emergency" showBack />
            <div className="grid grid-cols-2 gap-4 animate-fade-in px-4">
            {MOCK_CONTACTS.map(contact => (
                <a href={`tel:${contact.phone}`} key={contact.id} className="block group">
                    <Card className="p-4 flex flex-col items-center justify-center text-center h-full hover:border-red-300 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 transition-transform">
                             <Icons.Shield className="w-6 h-6"/>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{contact.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{contact.role}</p>
                        <span className="text-red-500 font-bold text-sm bg-red-50 dark:bg-transparent px-2 py-1 rounded">{contact.phone}</span>
                    </Card>
                </a>
            ))}
            </div>
        </div>
    );
};
