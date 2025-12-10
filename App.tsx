
import React, { useState, useEffect } from 'react';
import { AppScreen, MainTab, SubView } from './types';
import { Icons } from './constants';
import { BottomNav, ScreenContainer } from './components/Layout';
import { Button, Input } from './components/ui.tsx';
import { AppProvider, useNav } from './context';
import { 
  HomeScreen, EventsScreen, EventDetailScreen, AnnouncementsScreen, 
  AnnouncementDetailScreen, EmergencyScreen, VolunteerScreen, 
  ProfileScreen, MoreScreen, AdminScreen 
} from './screens/index';

const MainAppContent: React.FC = () => {
    const { navState, nav } = useNav();

    // Logic to hide padding on Dashboard or Immersive Screens
    const isImmersive = 
        (navState.currentTab === MainTab.HOME && navState.currentSubView === SubView.NONE) ||
        (navState.currentTab === MainTab.EVENTS && navState.currentSubView === SubView.NONE) ||
        navState.currentSubView === SubView.EVENT_DETAIL ||
        navState.currentSubView === SubView.ANNOUNCEMENTS ||
        navState.currentSubView === SubView.ANNOUNCEMENT_DETAIL ||
        navState.currentSubView === SubView.PROFILE;

    // Show BottomNav only when we are on the root of a tab (no subview active)
    const showBottomNav = navState.currentSubView === SubView.NONE;

    const renderContent = () => {
        if (navState.currentSubView !== SubView.NONE) {
            switch (navState.currentSubView) {
                case SubView.EVENT_DETAIL: return <EventDetailScreen />;
                case SubView.ANNOUNCEMENTS: return <AnnouncementsScreen />;
                case SubView.ANNOUNCEMENT_DETAIL: return <AnnouncementDetailScreen />;
                case SubView.VOLUNTEER: return <VolunteerScreen />;
                case SubView.PROFILE: return <ProfileScreen />;
                case SubView.ADMIN: return <AdminScreen />;
            }
        }
        switch (navState.currentTab) {
            case MainTab.HOME: return <HomeScreen />;
            case MainTab.EVENTS: return <EventsScreen />;
            case MainTab.EMERGENCY: return <EmergencyScreen />;
            case MainTab.MORE: return <MoreScreen />;
            default: return <div>Not Found</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
             <ScreenContainer fullWidth={isImmersive}>
                 {renderContent()}
             </ScreenContainer>
             {showBottomNav && (
                 <BottomNav 
                    activeTab={navState.currentTab} 
                    onTabChange={(tab) => nav(tab)} 
                 />
             )}
        </div>
    );
};

export default function App() {
  const [appState, setAppState] = useState<AppScreen>(AppScreen.SPLASH);

  useEffect(() => {
    if (appState === AppScreen.SPLASH) {
      const timer = setTimeout(() => setAppState(AppScreen.LOGIN), 2000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

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

  return (
      <AppProvider>
          <MainAppContent />
      </AppProvider>
  );
}
