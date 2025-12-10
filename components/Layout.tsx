
import React from 'react';
import { MainTab, Theme } from '../types';
import { Icons } from '../constants';

interface TopBarProps {
  title?: string;
  theme: Theme;
  toggleTheme: () => void;
  showBack?: boolean;
  onBack?: () => void;
  customTitle?: React.ReactNode;
  transparent?: boolean;
  rightAction?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, theme, toggleTheme, showBack, onBack, customTitle, transparent = false, rightAction 
}) => {
  const baseClasses = "sticky top-0 z-40 w-full transition-all duration-200";
  const bgClasses = transparent 
    ? "bg-transparent" 
    : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800";
    
  const textClasses = transparent
    ? "text-white"
    : "text-slate-800 dark:text-white";
    
  const iconClasses = transparent
    ? "text-white"
    : "text-slate-700 dark:text-slate-200";

  const buttonBgClasses = transparent
    ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700";

  return (
    <header className={`${baseClasses} ${bgClasses}`}>
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto min-h-[60px]">
        <div className="flex items-center gap-2 flex-1">
            {showBack && (
                <button onClick={onBack} className={`p-1 rounded-full transition-colors -ml-2 mr-1 ${transparent ? 'hover:bg-white/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <Icons.ChevronLeft className={`w-6 h-6 ${iconClasses}`} />
                </button>
            )}
            {customTitle ? (
              customTitle
            ) : (
              title && <h1 className={`text-xl font-bold font-nunito tracking-tight ${textClasses}`}>{title}</h1>
            )}
        </div>
        <div className="flex items-center gap-2">
            {rightAction}
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full transition-colors ${buttonBgClasses}`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </header>
  );
};

interface BottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: MainTab.HOME, icon: Icons.Home, label: 'Home' },
    { id: MainTab.EVENTS, icon: Icons.Calendar, label: 'Events' },
    { id: MainTab.EMERGENCY, icon: Icons.Phone, label: 'Emergency' },
    { id: MainTab.MORE, icon: Icons.More, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 z-40 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex justify-around items-center px-2 py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-spark-green dark:text-emerald-400' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                 <Icon className={`w-6 h-6 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

interface ScreenContainerProps { 
    children: React.ReactNode; 
    className?: string; 
    fullWidth?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, className = '', fullWidth = false }) => {
  const paddingClass = fullWidth ? 'px-0 pt-0' : 'px-4 pt-4';
  return (
    <div className={`pb-24 ${paddingClass} max-w-md mx-auto w-full min-h-screen ${className}`}>
      {children}
    </div>
  );
};
