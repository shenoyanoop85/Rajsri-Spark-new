
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
  settings: Record<string, string>; 
  loading: boolean;
  // User Interaction Data
  joinedEvents: string[]; // List of IDs
  acknowledgedNotices: string[]; // List of IDs
  refreshData: () => Promise<void>;
  
  // Actions
  joinEvent: (eventId: string) => Promise<void>;
  acknowledgeNotice: (noticeId: string) => Promise<void>;

  // Admin Actions
  addEvent: (e: Partial<AppEvent>) => Promise<void>;
  updateEvent: (e: AppEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addAnnouncement: (a: Partial<Announcement>) => Promise<void>;
  updateAnnouncement: (a: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>; 
  addUser: (u: Partial<User>) => Promise<void>;
  editUser: (u: User) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
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

  // --- DATA LOGIC ---
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);
  
  // User Activity State
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [acknowledgedNotices, setAcknowledgedNotices] = useState<string[]>([]);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false); 

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
        if (data.events && Array.isArray(data.events)) setEvents(data.events);
        else setEvents([]);
        if (data.announcements && Array.isArray(data.announcements)) setAnnouncements(data.announcements);
        else setAnnouncements([]);
        if (data.settings && Array.isArray(data.settings)) {
            const settingsMap = data.settings.reduce((acc: any, item: any) => {
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
  
  // Fetch specific user activity when user logs in
  const fetchUserActivity = async (userId: string) => {
      try {
          const activity = await sheetApi.getUserActivity(userId);
          if (activity) {
              setJoinedEvents(activity.joinedEvents || []);
              setAcknowledgedNotices(activity.ackNotices || []);
          }
      } catch (e) {
          console.error("Failed to fetch user activity", e);
      }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- USER ACTIONS ---
  
  const joinEvent = async (eventId: string) => {
      if (!user) return showToast("Please login first", "error");
      if (joinedEvents.includes(eventId)) return;

      // Optimistic Update
      setJoinedEvents(prev => [...prev, eventId]);
      
      const targetEvent = events.find(e => e.id === eventId);
      if (targetEvent) {
          // Increment locally
          const updatedEvent = { ...targetEvent, registeredCount: (targetEvent.registeredCount || 0) + 1 };
          setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
          
          try {
             // 1. Add to Registrations Sheet
             const regId = `r_${Date.now()}`;
             await sheetApi.addItem('Registrations', [regId, eventId, user.id, user.name, new Date().toISOString()]);
             
             // 2. Update Event Count in Events Sheet
             // We reuse the updateEvent logic basically
             const row = [
                updatedEvent.id, updatedEvent.title, updatedEvent.date, updatedEvent.time, 
                updatedEvent.location, updatedEvent.imageUrl, updatedEvent.description, 
                updatedEvent.type, updatedEvent.isHighPriority, 
                (updatedEvent.requirements || []).join(','), 
                (updatedEvent.benefits || []).join(','), 
                updatedEvent.capacity, updatedEvent.registeredCount
             ];
             await sheetApi.updateItem('Events', updatedEvent.id, row);
             
             showToast("Successfully Registered!", "success");
          } catch (e) {
             console.error(e);
             showToast("Saved locally. Sync failed.", "info");
          }
      }
  };

  const acknowledgeNotice = async (noticeId: string) => {
      if (!user) return;
      if (acknowledgedNotices.includes(noticeId)) return;

      setAcknowledgedNotices(prev => [...prev, noticeId]);
      
      try {
         const ackId = `ack_${Date.now()}`;
         await sheetApi.addItem('Acknowledgements', [ackId, noticeId, user.id, user.name, new Date().toISOString()]);
         showToast("Notice Acknowledged", "success");
      } catch (e) {
         showToast("Acknowledged locally.", "info");
      }
  };

  // --- ADMIN ACTIONS ---
  const updateSetting = async (key: string, value: string) => {
      setSettings(prev => ({ ...prev, [key]: value }));
      try {
          if (settings[key] !== undefined) {
             await sheetApi.updateItem('Settings', key, [key, value]);
          } else {
             await sheetApi.addItem('Settings', [key, value]);
          }
          showToast("Setting updated!", "success");
      } catch (e) {
          showToast("Failed to save setting.", "info");
      }
  };

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
        showToast("Event saved!", "success");
    } catch (err) { showToast("Demo: Event saved locally.", "info"); }
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
        showToast("Event updated!", "success");
    } catch (err) { showToast("Updated locally.", "info"); }
  };

  const deleteEvent = async (id: string) => {
    try {
        setEvents(prev => prev.filter(e => e.id !== id));
        await sheetApi.deleteItem('Events', id);
        showToast("Event deleted!", "success");
    } catch (e) { showToast("Deleted locally.", "info"); }
  };

  const addAnnouncement = async (a: Partial<Announcement>) => {
    try {
        const newAnn = { ...a, id: `a${Date.now()}`, date: new Date().toISOString() };
        setAnnouncements(prev => [...prev, newAnn as Announcement]);
        const row = [
            newAnn.id, newAnn.title, newAnn.content, newAnn.author, 
            newAnn.date, newAnn.imageUrl, newAnn.validFrom || '', newAnn.validTo || ''
        ];
        await sheetApi.addItem('Announcements', row);
        showToast("Notice saved!", "success");
    } catch (err) { showToast("Demo: Notice saved locally.", "info"); }
  };

  const updateAnnouncement = async (a: Announcement) => {
    try {
        setAnnouncements(prev => prev.map(ann => ann.id === a.id ? a : ann));
        const row = [
            a.id, a.title, a.content, a.author, 
            a.date, a.imageUrl, a.validFrom || '', a.validTo || ''
        ];
        await sheetApi.updateItem('Announcements', a.id, row);
        showToast("Notice updated!", "success");
    } catch (err) { showToast("Updated locally.", "info"); }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        await sheetApi.deleteItem('Announcements', id);
        showToast("Deleted!", "success");
    } catch (e) { showToast("Deleted locally.", "info"); }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
      try {
          const result = await sheetApi.searchUsers(query);
          if (result && result.profiles) return result.profiles.map(mapToUser);
          return [];
      } catch (e) { return []; }
  };

  const addUser = async (u: Partial<User>) => {
      try {
          const newUser = { ...u, id: `u${Date.now()}`, avatar: u.avatar || 'https://i.pravatar.cc/300', volunteerServices: [] } as User;
          const row = [newUser.id, newUser.name, newUser.role, newUser.avatar, newUser.email, newUser.phone, newUser.unit, ''];
          await sheetApi.addItem('Profiles', row);
          showToast("User added!", "success");
      } catch (e) { showToast("Demo: User added locally.", "info"); }
  };

  const editUser = async (u: User) => {
      try {
          const volServices = u.volunteerServices ? u.volunteerServices.join(',') : '';
          const row = [u.id, u.name, u.role, u.avatar, u.email, u.phone, u.unit, volServices];
          await sheetApi.updateItem('Profiles', u.id, row);
          showToast("User updated!", "success");
      } catch (e) { showToast("Updated locally.", "info"); }
  };

  const removeUser = async (id: string) => {
      try {
          await sheetApi.deleteItem('Profiles', id);
          showToast("User deleted!", "success");
      } catch (e) { showToast("User deleted locally.", "info"); }
  };

  // --- AUTH LOGIC ---
  const login = async (mobile: string) => {
      setIsLoadingUser(true);
      try {
          const response = await sheetApi.loginUser(mobile);
          if (response && response.success && response.user) {
              const u = mapToUser(response.user);
              setUser(u);
              fetchUserActivity(u.id); // Fetch history
              showToast(`Welcome back, ${u.name}!`, 'success');
          } else {
              showToast('Mobile number not found.', 'error');
          }
      } catch (e) {
          if (mobile === '9876543210') {
             const u = MOCK_USER;
             setUser(u);
             fetchUserActivity(u.id);
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
      setJoinedEvents([]);
      setAcknowledgedNotices([]);
      showToast('Logged out', 'info');
  };

  const updateUserProfile = async (u: User) => {
      if (!user) return;
      setUser({ ...user, ...u });
      try {
         const volServices = u.volunteerServices ? u.volunteerServices.join(',') : '';
         const row = [u.id, u.name, u.role, u.avatar, u.email, u.phone, u.unit, volServices];
         await sheetApi.updateItem('Profiles', u.id, row);
         showToast('Profile updated in Cloud!', 'success');
      } catch (e) { showToast('Updated locally.', 'info'); }
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
             joinedEvents, acknowledgedNotices, joinEvent, acknowledgeNotice,
             addEvent, updateEvent, deleteEvent, 
             addAnnouncement, updateAnnouncement, deleteAnnouncement,
             searchUsers, addUser, editUser, removeUser,
             updateSetting
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
