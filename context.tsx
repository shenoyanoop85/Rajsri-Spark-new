
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppEvent, Announcement, User, MainTab, SubView, NavState, Theme 
} from './types';
import { MOCK_EVENTS, MOCK_ANNOUNCEMENTS, MOCK_USER } from './constants';

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

// --- DATA CONTEXT ---
interface DataContextType {
  events: AppEvent[];
  announcements: Announcement[];
  addEvent: (e: AppEvent) => void;
  updateEvent: (e: AppEvent) => void;
  deleteEvent: (id: string) => void;
  addAnnouncement: (a: Announcement) => void;
  updateAnnouncement: (a: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
}
const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within AppProvider');
  return context;
};

// --- USER CONTEXT ---
interface UserContextType {
  user: User;
  updateUser: (u: User) => void;
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

  // Data State
  const [events, setEvents] = useState<AppEvent[]>(MOCK_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [user, setUser] = useState<User>(MOCK_USER);

  // CRUD Actions
  const addEvent = (e: AppEvent) => setEvents(prev => [e, ...prev]);
  const updateEvent = (e: AppEvent) => setEvents(prev => prev.map(ev => ev.id === e.id ? e : ev));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const addAnnouncement = (a: Announcement) => setAnnouncements(prev => [a, ...prev]);
  const updateAnnouncement = (a: Announcement) => setAnnouncements(prev => prev.map(ann => ann.id === a.id ? a : ann));
  const deleteAnnouncement = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  const updateUser = (u: User) => setUser(u);

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
    // Logic: If in subview, go to NONE. If in main tab (not home), go to HOME.
    if (navState.currentSubView !== SubView.NONE) {
       setNavState(prev => ({ ...prev, currentSubView: SubView.NONE, selectedId: undefined }));
    } else if (navState.currentTab !== MainTab.HOME) {
       nav(MainTab.HOME);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user, updateUser }}>
        <DataContext.Provider value={{ 
           events, announcements, 
           addEvent, updateEvent, deleteEvent, 
           addAnnouncement, updateAnnouncement, deleteAnnouncement 
        }}>
          <NavContext.Provider value={{ navState, nav, goBack }}>
            {children}
          </NavContext.Provider>
        </DataContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};
