
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
  settings: Record<string, string>; // NEW: Store app settings like images
  loading: boolean;
  refreshData: () => Promise<void>;
  addEvent: (e: Partial<AppEvent>) => Promise<void>;
  updateEvent: (e: AppEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addAnnouncement: (a: Partial<Announcement>) => Promise<void>;
  updateAnnouncement: (a: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  // User Management
  searchUsers: (query: string) => Promise<User[]>; 
  addUser: (u: Partial<User>) => Promise<void>;
  editUser: (u: User) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  // Settings Management
  updateSetting: (key: string, value: string) => Promise<void>;
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
  const [settings, setSettings] = useState<Record<string, string>>({});
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
        const data = await sheetApi.getPublicData();
        
        // Events
        if (data.events && Array.isArray(data.events)) setEvents(data.events);
        else setEvents([]);

        // Announcements
        if (data.announcements && Array.isArray(data.announcements)) setAnnouncements(data.announcements);
        else setAnnouncements([]);

        // Settings (NEW)
        if (data.settings && Array.isArray(data.settings)) {
            const settingsMap = data.settings.reduce((acc: any, item: any) => {
                // Assuming sheet has columns 'key' and 'value'
                if(item.key) acc[item.key] = item.value;
                return acc;
            }, {});
            setSettings(settingsMap);
        }

    } catch (error) {
        console.warn("API Connection Error:", error);
        showToast("Connection Failed: Using Demo Data", "error");
        setEvents(MOCK_EVENTS);
        setAnnouncements(MOCK_ANNOUNCEMENTS);
    } finally {
        setLoadingData(false);
    }
  };

  // Initial Load
  useEffect(() => {
    refreshData();
  }, []);

  // --- SETTINGS ACTIONS ---
  const updateSetting = async (key: string, value: string) => {
      // Optimistic Update
      setSettings(prev => ({ ...prev, [key]: value }));
      
      try {
          // If key exists in current settings, update it. If not, add it.
          // Note: This relies on the local state being accurate.
          // 'Settings' sheet is expected to have 'key' as the first column (ID).
          if (settings[key] !== undefined) {
             await sheetApi.updateItem('Settings', key, [key, value]);
          } else {
             await sheetApi.addItem('Settings', [key, value]);
          }
          showToast("Setting updated!", "success");
      } catch (e) {
          console.error(e);
          showToast("Failed to save setting to cloud.", "info");
      }
  };

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
  const searchUsers = async (query: string): Promise<User[]> => {
      try {
          const result = await sheetApi.searchUsers(query);
          if (result && result.profiles) {
              return result.profiles.map(mapToUser);
          }
          return [];
      } catch (e) {
          console.error("Search failed", e);
          return [];
      }
  };

  const addUser = async (u: Partial<User>) => {
      try {
          const newUser = { 
              ...u, 
              id: `u${Date.now()}`, 
              avatar: u.avatar || 'https://i.pravatar.cc/300',
              volunteerServices: [] 
          } as User;
          
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
          // Fix: Ensure we don't wipe volunteer services
          const volServices = u.volunteerServices ? u.volunteerServices.join(',') : '';
          
          // Map to Sheet Columns (SAME ORDER as addUser)
          const row = [
              u.id, u.name, u.role, u.avatar, 
              u.email, u.phone, u.unit, volServices
          ];
          await sheetApi.updateItem('Profiles', u.id, row);
          showToast("User updated in Sheet!", "success");
      } catch (e) {
          showToast("Updated locally. Sheet sync failed.", "info");
      }
  };

  const removeUser = async (id: string) => {
      try {
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
      try {
          const response = await sheetApi.loginUser(mobile);
          if (response && response.success && response.user) {
              setUser(mapToUser(response.user));
              showToast(`Welcome back, ${response.user.name}!`, 'success');
          } else {
              showToast('Mobile number not found.', 'error');
          }
      } catch (e) {
          console.error(e);
          // Fallback for demo if script fails
          if (mobile === '9876543210') {
             setUser(MOCK_USER);
             showToast('Demo Login Successful', 'success');
          } else {
             showToast('Login failed. Check internet.', 'error');
          }
      } finally {
          setIsLoadingUser(false);
      }
  };

  const logout = async () => {
      setUser(null);
      showToast('Logged out', 'info');
  };

  const updateUserProfile = async (u: User) => {
      if (!user) return;
      // Optimistic Update
      setUser({ ...user, ...u });
      
      try {
         const volServices = u.volunteerServices ? u.volunteerServices.join(',') : '';
         const row = [u.id, u.name, u.role, u.avatar, u.email, u.phone, u.unit, volServices];
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
             events, announcements, settings, loading: loadingData, refreshData,
             addEvent, updateEvent, deleteEvent, 
             addAnnouncement, updateAnnouncement, deleteAnnouncement,
             searchUsers, addUser, editUser, removeUser,
             updateSetting // Exposed here
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
