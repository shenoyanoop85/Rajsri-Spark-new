
import React, { useState, useEffect } from 'react';
import { AppScreen, MainTab, SubView } from './types';
import { Icons } from './constants';
import { BottomNav, ScreenContainer } from './components/Layout';
import { Button, Input, ToastContainer } from './components/ui.tsx';
import { AppProvider, useNav, useToast, useUser } from './context';
import { 
  HomeScreen, EventsScreen, EventDetailScreen, AnnouncementsScreen, 
  AnnouncementDetailScreen, EmergencyScreen, VolunteerScreen, 
  ProfileScreen, MoreScreen, AdminScreen 
} from './screens/index';

const ToastWrapper: React.FC = () => {
    const { toasts, removeToast } = useToast();
    return <ToastContainer toasts={toasts} onRemove={removeToast} />;
};

const MainAppContent: React.FC = () => {
    const { navState, nav } = useNav();
    const { user, logout } = useUser();

    // Logic to hide padding on Dashboard or Immersive Screens
    const isImmersive = 
        (navState.currentTab === MainTab.HOME && navState.currentSubView === SubView.NONE) ||
        (navState.currentTab === MainTab.EVENTS && navState.currentSubView === SubView.NONE) ||
        navState.currentSubView === SubView.EVENT_DETAIL ||
        navState.currentSubView === SubView.ANNOUNCEMENTS ||
        navState.currentSubView === SubView.ANNOUNCEMENT_DETAIL ||
        navState.currentSubView === SubView.PROFILE;

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
             <ToastWrapper />
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

const LoginScreen: React.FC = () => {
    const { login } = useUser();
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!mobile || mobile.length < 10) return;
        setLoading(true);
        try {
            await login(mobile);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
         {/* Decorative Background Elements */}
         <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-spark-green/10 rounded-full blur-3xl" />
         <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-spark-orange/10 rounded-full blur-3xl" />

         <div className="w-full max-w-sm space-y-8 text-center relative z-10">
             <div>
                 <div className="mx-auto bg-white dark:bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center text-spark-green mb-6 shadow-xl shadow-emerald-500/10 border border-slate-100 dark:border-slate-700">
                    <Icons.Sparkles className="w-10 h-10" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 dark:text-white font-nunito tracking-tight mb-2">Welcome to <br/> Rajsri SPARK</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Community. Connected.</p>
             </div>
             
             <div className="space-y-6 pt-4">
                 <div className="text-left">
                     <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 pl-1">Mobile Number</label>
                     <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                             <Icons.Phone className="w-5 h-5" />
                         </div>
                         <input 
                            type="tel" 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-spark-green/20 focus:border-spark-green outline-none transition-all"
                            placeholder="Enter 10-digit number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                         />
                     </div>
                 </div>

                 <Button fullWidth size="lg" onClick={handleLogin} disabled={loading} className="py-4 text-lg shadow-xl shadow-emerald-500/20">
                     {loading ? 'Verifying...' : 'Continue'}
                 </Button>
             </div>
             
             <p className="text-xs text-slate-400 max-w-[250px] mx-auto leading-relaxed">
                 By continuing, you agree to our Terms of Service.
             </p>
         </div>
         <ToastWrapper />
      </div>
    );
};

const AppContent: React.FC = () => {
    const { user, isLoadingUser } = useUser();
    const [splash, setSplash] = useState(true);

    useEffect(() => {
        // Initial splash timer
        const timer = setTimeout(() => setSplash(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (splash || isLoadingUser) {
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

    if (!user) {
        return <LoginScreen />;
    }

    return <MainAppContent />;
};

export default function App() {
  return (
      <AppProvider>
          <AppContent />
      </AppProvider>
  );
}
