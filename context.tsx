
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AppEvent, Announcement, User, MainTab, SubView, NavState, Theme, ToastMessage, ToastType 
} from './types';
import { MOCK_USER, MOCK_EVENTS, MOCK_ANNOUNCEMENTS } from './constants';
import { sheetApi } from './googleSheetsClient';

// --- THEME CONTEXT ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within AppProvider');
  return context;
};

// --- TOAST CONTEXT ---
interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within AppProvider');
  return context;
};

// --- DATA CONTEXT ---
interface DataContextType {
  events: AppEvent[];
  announcements: Announcement[];
  allUsers: User[]; // All profiles for Admin
  loading: boolean;
  refreshData: () => Promise<void>;
  addEvent: (e: Partial<AppEvent>) => Promise<void>;
  updateEvent: (e: AppEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addAnnouncement: (a: Partial<Announcement>) => Promise<void>;
  updateAnnouncement: (a: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  // User Management
  addUser: (u: Partial<User>) => Promise<void>;
  editUser: (u: User) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
}
const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within AppProvider');
  return context;
};

// --- USER CONTEXT ---
interface UserContextType {
  user: User | null;
  isLoadingUser: boolean;
  login: (mobile: string) => Promise<void>; 
  logout: () => Promise<void>;
  updateUser: (u: User) => Promise<void>;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within AppProvider');
  return context;
};

// --- NAVIGATION CONTEXT ---
interface NavContextType {
  navState: NavState;
  nav: (tab: MainTab, sub?: SubView, id?: string) => void;
  goBack: () => void;
}
const NavContext = createContext<NavContextType | undefined>(undefined);

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) throw new Error('useNav must be used within AppProvider');
  return context;
};

// --- MAIN PROVIDER ---
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  // --- GOOGLE SHEETS DATA LOGIC ---
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); 
  const [loadingData, setLoadingData] = useState(true);

  // Helper to map raw sheet row to User object
  const mapToUser = (raw: any): User => ({
      id: raw.id || `u_${Math.random()}`,
      name: raw.name || 'Unknown',
      role: (raw.role === 'ADMIN' ? 'ADMIN' : 'RESIDENT'),
      avatar: raw.avatar || 'https://i.pravatar.cc/300',
      email: raw.email || '',
      phone: raw.phone || '',
      unit: raw.unit || '',
      volunteerServices: Array.isArray(raw.volunteer_services) ? raw.volunteer_services : []
  });

  const refreshData = async () => {
    setLoadingData(true);
    
    try {
        const data = await sheetApi.getData();
        
        if (data.events && Array.isArray(data.events)) setEvents(data.events);
        else setEvents(MOCK_EVENTS);

        if (data.announcements && Array.isArray(data.announcements)) setAnnouncements(data.announcements);
        else setAnnouncements(MOCK_ANNOUNCEMENTS);

        if (data.profiles && Array.isArray(data.profiles)) {
            setAllUsers(data.profiles.map(mapToUser));
        } else {
             setAllUsers([MOCK_USER]);
        }

    } catch (error) {
        console.warn("Google Sheet fetch failed (or URL not set), using mock data.");
        setEvents(MOCK_EVENTS);
        setAnnouncements(MOCK_ANNOUNCEMENTS);
        setAllUsers([MOCK_USER]);
    } finally {
        setLoadingData(false);
    }
  };

  // Initial Load
  useEffect(() => {
    refreshData();
  }, []);

  // --- EVENT ACTIONS ---
  const addEvent = async (e: Partial<AppEvent>) => {
    try {
        const newEvent = { ...e, id: `e${Date.now()}`, registeredCount: 0 };
        setEvents(prev => [...prev, newEvent as AppEvent]);
        const row = [
            newEvent.id, newEvent.title, newEvent.date, newEvent.time, 
            newEvent.location, newEvent.imageUrl, newEvent.description, 
            newEvent.type, newEvent.isHighPriority, 
            (newEvent.requirements || []).join(','), 
            (newEvent.benefits || []).join(','), 
            newEvent.capacity, newEvent.registeredCount
        ];
        await sheetApi.addItem('Events', row);
        showToast("Event saved to Sheet!", "success");
    } catch (err) {
        showToast("Demo Mode: Event saved locally.", "info");
    }
  };

  const updateEvent = async (e: AppEvent) => {
    try {
        setEvents(prev => prev.map(ev => ev.id === e.id ? e : ev));
        const row = [
            e.id, e.title, e.date, e.time, 
            e.location, e.imageUrl, e.description, 
            e.type, e.isHighPriority, 
            (e.requirements || []).join(','), 
            (e.benefits || []).join(','), 
            e.capacity, e.registeredCount
        ];
        await sheetApi.updateItem('Events', e.id, row);
        showToast("Event updated in Sheet!", "success");
    } catch (err) {
        showToast("Updated locally. Sheet sync failed.", "info");
    }
  };

  const deleteEvent = async (id: string) => {
    try {
        setEvents(prev => prev.filter(e => e.id !== id));
        await sheetApi.deleteItem('Events', id);
        showToast("Event deleted from Sheet!", "success");
    } catch (e) {
        showToast("Deleted locally. Sheet sync failed.", "info");
    }
  };

  // --- ANNOUNCEMENT ACTIONS ---
  const addAnnouncement = async (a: Partial<Announcement>) => {
    try {
        const newAnn = { ...a, id: `a${Date.now()}`, date: new Date().toISOString() };
        setAnnouncements(prev => [...prev, newAnn as Announcement]);
        const row = [
            newAnn.id, newAnn.title, newAnn.content, newAnn.author, 
            newAnn.date, newAnn.imageUrl, newAnn.validFrom || '', newAnn.validTo || ''
        ];
        await sheetApi.addItem('Announcements', row);
        showToast("Notice saved to Sheet!", "success");
    } catch (err) {
        showToast("Demo Mode: Notice saved locally.", "info");
    }
  };

  const updateAnnouncement = async (a: Announcement) => {
    try {
        setAnnouncements(prev => prev.map(ann => ann.id === a.id ? a : ann));
        const row = [
            a.id, a.title, a.content, a.author, 
            a.date, a.imageUrl, a.validFrom || '', a.validTo || ''
        ];
        await sheetApi.updateItem('Announcements', a.id, row);
        showToast("Notice updated in Sheet!", "success");
    } catch (err) {
        showToast("Updated locally. Sheet sync failed.", "info");
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        await sheetApi.deleteItem('Announcements', id);
        showToast("Deleted from Sheet!", "success");
    } catch (e) {
        showToast("Deleted locally. Sheet sync failed.", "info");
    }
  };

  // --- USER MANAGEMENT ACTIONS (ADMIN) ---
  const addUser = async (u: Partial<User>) => {
      try {
          const newUser = { 
              ...u, 
              id: `u${Date.now()}`, 
              avatar: u.avatar || 'https://i.pravatar.cc/300',
              volunteerServices: [] 
          } as User;
          
          setAllUsers(prev => [...prev, newUser]);

          // Map to Sheet Columns: id, name, role, avatar, email, phone, unit, volunteer_services
          const row = [
              newUser.id, newUser.name, newUser.role, newUser.avatar, 
              newUser.email, newUser.phone, newUser.unit, ''
          ];
          
          await sheetApi.addItem('Profiles', row);
          showToast("User added to Sheet!", "success");
      } catch (e) {
          showToast("Demo Mode: User added locally.", "info");
      }
  };

  const editUser = async (u: User) => {
      try {
          setAllUsers(prev => prev.map(user => user.id === u.id ? u : user));
          
          // Map to Sheet Columns (SAME ORDER as addUser)
          const row = [
              u.id, u.name, u.role, u.avatar, 
              u.email, u.phone, u.unit, ''
          ];
          
          await sheetApi.updateItem('Profiles', u.id, row);
          showToast("User updated in Sheet!", "success");
      } catch (e) {
          showToast("Updated locally. Sheet sync failed.", "info");
      }
  };

  const removeUser = async (id: string) => {
      try {
          setAllUsers(prev => prev.filter(u => u.id !== id));
          await sheetApi.deleteItem('Profiles', id);
          showToast("User deleted from Sheet!", "success");
      } catch (e) {
          showToast("User deleted locally.", "info");
      }
  };

  // --- CURRENT USER AUTH LOGIC ---
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false); 

  const login = async (mobile: string) => {
      setIsLoadingUser(true);
      const cleanMobile = mobile.replace(/\D/g, ''); 
      
      const foundProfile = allUsers.find(p => {
          const pMobile = String(p.phone || '').replace(/\D/g, '');
          return pMobile === cleanMobile;
      });
      
      if (foundProfile) {
           setUser(foundProfile);
           showToast(`Welcome back, ${foundProfile.name}!`, 'success');
      } else {
          showToast('Mobile number not registered. Contact Admin.', 'error');
      }
      setIsLoadingUser(false);
  };

  const logout = async () => {
      setUser(null);
      showToast('Logged out', 'info');
  };

  const updateUserProfile = async (u: User) => {
      if (!user) return;
      // Optimistic Update
      setUser({ ...user, ...u });
      setAllUsers(prev => prev.map(p => p.id === u.id ? { ...p, ...u } : p));
      
      try {
         const row = [u.id, u.name, u.role, u.avatar, u.email, u.phone, u.unit, ''];
         await sheetApi.updateItem('Profiles', u.id, row);
         showToast('Profile updated in Cloud!', 'success');
      } catch (e) {
         console.error("Sheet update failed", e);
         showToast('Updated locally. Cloud sync failed.', 'info');
      }
  };

  // Nav State
  const [navState, setNavState] = useState<NavState>({
    currentTab: MainTab.HOME,
    currentSubView: SubView.NONE,
  });

  const nav = (tab: MainTab, sub: SubView = SubView.NONE, id?: string) => {
    setNavState({ currentTab: tab, currentSubView: sub, selectedId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navState.currentSubView !== SubView.NONE) {
       setNavState(prev => ({ ...prev, currentSubView: SubView.NONE, selectedId: undefined }));
    } else if (navState.currentTab !== MainTab.HOME) {
       nav(MainTab.HOME);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
        <UserContext.Provider value={{ user, isLoadingUser, login, logout, updateUser: updateUserProfile }}>
          <DataContext.Provider value={{ 
             events, announcements, allUsers, loading: loadingData, refreshData,
             addEvent, updateEvent, deleteEvent, 
             addAnnouncement, updateAnnouncement, deleteAnnouncement,
             addUser, editUser, removeUser
          }}>
            <NavContext.Provider value={{ navState, nav, goBack }}>
              {children}
            </NavContext.Provider>
          </DataContext.Provider>
        </UserContext.Provider>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
};
