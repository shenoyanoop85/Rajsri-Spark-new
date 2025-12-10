
export type Theme = 'light' | 'dark';

export enum AppScreen {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  MAIN = 'MAIN'
}

export enum MainTab {
  HOME = 'HOME',
  EVENTS = 'EVENTS',
  EMERGENCY = 'EMERGENCY',
  MORE = 'MORE'
}

// Sub-views that can overlay or replace tab content
export enum SubView {
  NONE = 'NONE',
  EVENT_DETAIL = 'EVENT_DETAIL',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  ANNOUNCEMENT_DETAIL = 'ANNOUNCEMENT_DETAIL',
  VOLUNTEER = 'VOLUNTEER',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE'
}

export interface User {
  id: string;
  name: string;
  role: 'RESIDENT' | 'ADMIN';
  avatar: string;
  email: string;
  phone: string;
  unit: string;
  volunteerServices: string[];
}

export interface AppEvent {
  id: string;
  title: string;
  date: string; // ISO Date string
  time: string;
  location: string;
  imageUrl: string;
  description: string;
  type: string;
  isHighPriority: boolean;
  requirements: string[];
  benefits: string[];
  capacity: number;
  registeredCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  eta?: string;
  validFrom?: string;
  validTo?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  iconName: 'Ambulance' | 'Fire' | 'Police' | 'General' | 'Shield';
}

// Navigation State
export interface NavState {
  currentTab: MainTab;
  currentSubView: SubView;
  selectedId?: string; // For details view
}

// Toast Notification
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
