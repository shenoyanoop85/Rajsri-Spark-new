
import React, { useState } from 'react';
import { AppEvent, Announcement, User } from '../types';
import { useNav, useData, useTheme, useToast } from '../context';
import { useForm } from '../hooks';
import { Button, Input, TextArea, ImageUpload } from '../components/ui';
import { TopBar } from '../components/Layout';
import { Icons } from '../constants';

// -- Event Form Logic --
type EventFormState = Omit<Partial<AppEvent>, 'requirements' | 'benefits'> & { requirements?: string; benefits?: string; };

// -- Tabs Configuration --
// Scalable config for future tabs (e.g. Emergency, Party Hall)
const ADMIN_TABS = [
    { id: 'EVENT', label: 'Events', icon: Icons.Calendar, color: 'text-spark-green' },
    { id: 'ANNOUNCE', label: 'Notices', icon: Icons.Megaphone, color: 'text-spark-orange' },
    { id: 'USERS', label: 'Residents', icon: Icons.User, color: 'text-indigo-500' },
    // Future tabs like 'EMERGENCY' or 'BOOKING' can be added here
    { id: 'SETTINGS', label: 'Settings', icon: Icons.Settings, color: 'text-slate-600 dark:text-slate-300' },
] as const;

type AdminTabID = typeof ADMIN_TABS[number]['id'];

export const AdminScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTabID>('EVENT');
    const { 
        events, announcements, settings, refreshData,
        addEvent, updateEvent, deleteEvent, 
        addAnnouncement, updateAnnouncement, deleteAnnouncement,
        searchUsers, addUser, editUser, removeUser,
        updateSetting
    } = useData();
    const { goBack } = useNav();
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- EVENT STATE ---
    const emptyEvent: EventFormState = { title: '', date: '', time: '', location: '', imageUrl: '', description: '', type: 'General', isHighPriority: false, requirements: '', benefits: '', capacity: 0 };
    const eventForm = useForm<EventFormState>(emptyEvent, (vals) => {
        const errors: Record<string, string> = {};
        if (!vals.title) errors.title = "Title is required";
        if (!vals.date) errors.date = "Date is required";
        if (!vals.location) errors.location = "Location is required";
        return errors;
    });
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    // --- ANNOUNCEMENT STATE ---
    const emptyAnnounce: Partial<Announcement> = { title: '', content: '', author: '', imageUrl: '' };
    const announceForm = useForm<Partial<Announcement>>(emptyAnnounce, (vals) => {
        const errors: Record<string, string> = {};
        if (!vals.title) errors.title = "Title is required";
        if (!vals.content) errors.content = "Content is required";
        return errors;
    });
    const [editingAnnounceId, setEditingAnnounceId] = useState<string | null>(null);

    // --- USER STATE ---
    const emptyUser: Partial<User> = { name: '', phone: '', email: '', unit: '', role: 'RESIDENT' };
    const userForm = useForm<Partial<User>>(emptyUser, (vals) => {
        const errors: Record<string, string> = {};
        if (!vals.name) errors.name = "Name is required";
        if (!vals.phone) errors.phone = "Phone is required";
        if (!vals.unit) errors.unit = "Unit is required";
        return errors;
    });
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // --- HANDLERS ---
    const handleEventSubmit = async () => {
        eventForm.handleSubmit(async (vals) => {
            setIsSubmitting(true);
            try {
                const payload = {
                    title: vals.title!,
                    date: vals.date!,
                    time: vals.time || 'TBD',
                    location: vals.location!,
                    imageUrl: vals.imageUrl || 'https://picsum.photos/800/600',
                    description: vals.description || '',
                    type: vals.type || 'General',
                    isHighPriority: vals.isHighPriority || false,
                    requirements: vals.requirements ? vals.requirements.split(',').map(s => s.trim()) : [],
                    benefits: vals.benefits ? vals.benefits.split(',').map(s => s.trim()) : [],
                    capacity: Number(vals.capacity),
                };

                if (editingEventId) {
                    await updateEvent({ ...payload, id: editingEventId, registeredCount: events.find(e => e.id === editingEventId)?.registeredCount || 0 } as AppEvent);
                } else {
                    await addEvent(payload);
                }
                eventForm.reset(emptyEvent);
                setEditingEventId(null);
            } catch (err: any) {
                showToast(err.message, 'error');
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    const handleAnnounceSubmit = async () => {
        announceForm.handleSubmit(async (vals) => {
            setIsSubmitting(true);
            try {
                const payload = {
                    title: vals.title!,
                    content: vals.content!,
                    author: vals.author || 'Admin',
                    imageUrl: vals.imageUrl,
                    validFrom: vals.validFrom,
                    validTo: vals.validTo
                };

                if (editingAnnounceId) {
                    await updateAnnouncement({ ...payload, id: editingAnnounceId, date: new Date().toISOString() } as Announcement);
                } else {
                    await addAnnouncement(payload);
                }
                announceForm.reset(emptyAnnounce);
                setEditingAnnounceId(null);
            } catch (err: any) {
                showToast(err.message, 'error');
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    const handleUserSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setHasSearched(true);
        try {
            const results = await searchUsers(searchQuery);
            setSearchResults(results);
        } catch(e) {
            showToast("Search failed", "error");
        } finally {
            setIsSearching(false);
        }
    };

    const handleUserSubmit = async () => {
        userForm.handleSubmit(async (vals) => {
            setIsSubmitting(true);
            try {
                const payload = {
                    name: vals.name!,
                    phone: vals.phone!,
                    email: vals.email || '',
                    unit: vals.unit!,
                    role: vals.role || 'RESIDENT',
                    avatar: vals.avatar
                };
                
                if (editingUserId) {
                    const existing = searchResults.find(u => u.id === editingUserId);
                    await editUser({ ...existing, ...payload } as User);
                    // Update the search result list locally to reflect changes immediately
                    setSearchResults(prev => prev.map(u => u.id === editingUserId ? { ...u, ...payload } : u));
                } else {
                    await addUser(payload);
                    setSearchResults(prev => [...prev, { ...payload, id: 'temp' } as User]); // Optimistic add
                }
                userForm.reset(emptyUser);
                setEditingUserId(null);
            } catch (err: any) {
                showToast(err.message, 'error');
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- RENDERERS ---

    const renderEventTab = () => (
        <div className="flex flex-col gap-8">
            {/* 1. CREATE/EDIT FORM */}
            <div className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="flex justify-between items-center"><h3 className="font-bold text-slate-800 dark:text-white">{editingEventId ? 'Edit Event' : 'Create Event'}</h3>{editingEventId && <button onClick={() => { setEditingEventId(null); eventForm.reset(emptyEvent); }} className="text-xs text-blue-500 font-bold">+ New</button>}</div>
                 
                 <Input label="Title" value={eventForm.values.title} onChange={e => eventForm.handleChange('title', e.target.value)} error={eventForm.errors.title} />
                 
                 <div className="grid grid-cols-2 gap-4">
                    <Input type="datetime-local" label="Date" value={eventForm.values.date} onChange={e => eventForm.handleChange('date', e.target.value)} error={eventForm.errors.date} />
                    <Input label="Time" value={eventForm.values.time} onChange={e => eventForm.handleChange('time', e.target.value)} />
                 </div>
                 
                 <Input label="Location" value={eventForm.values.location} onChange={e => eventForm.handleChange('location', e.target.value)} error={eventForm.errors.location} />
                 
                 {/* Type and Priority Fields */}
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                        <select 
                            value={eventForm.values.type} 
                            onChange={e => eventForm.handleChange('type', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-spark-green outline-none"
                        >
                            <option value="General">General</option>
                            <option value="CULTURAL">Cultural</option>
                            <option value="SPORTS">Sports</option>
                            <option value="WORKSHOP">Workshop</option>
                            <option value="DRIVE">Drive</option>
                            <option value="MEETING">Meeting</option>
                        </select>
                     </div>
                     <div className="flex items-end">
                        <label className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${eventForm.values.isHighPriority ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700'}`}>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={eventForm.values.isHighPriority} 
                                onChange={e => eventForm.handleChange('isHighPriority', e.target.checked)} 
                            />
                            <Icons.Sparkles className={`w-4 h-4 ${eventForm.values.isHighPriority ? 'fill-current' : ''}`} />
                            <span className="font-bold text-sm">High Priority</span>
                        </label>
                     </div>
                 </div>

                 <Input type="number" label="Capacity" value={eventForm.values.capacity} onChange={e => eventForm.handleChange('capacity', e.target.value)} error={eventForm.errors.capacity} />
                 <ImageUpload label="Image" value={eventForm.values.imageUrl || ''} onChange={url => eventForm.handleChange('imageUrl', url)} />
                 <TextArea label="Description" value={eventForm.values.description} onChange={e => eventForm.handleChange('description', e.target.value)} />
                 <TextArea label="Requirements" placeholder="Comma separated" value={eventForm.values.requirements} onChange={e => eventForm.handleChange('requirements', e.target.value)} />
                 <TextArea label="Benefits" placeholder="Comma separated" value={eventForm.values.benefits} onChange={e => eventForm.handleChange('benefits', e.target.value)} />
                 
                 <div className="flex gap-3">
                     {editingEventId && <Button type="button" variant="danger" onClick={async () => { await deleteEvent(editingEventId); setEditingEventId(null); eventForm.reset(emptyEvent); }}>Delete</Button>}
                     <Button fullWidth onClick={handleEventSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Event'}</Button>
                 </div>
            </div>

            {/* 2. EXISTING ITEMS LIST */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Manage Existing Events</h3>
                <div className="grid grid-cols-1 gap-3">
                     {events.map(ev => (
                         <div 
                            key={ev.id} 
                            onClick={() => { 
                                setEditingEventId(ev.id); 
                                eventForm.setValues({ 
                                    ...ev, 
                                    requirements: Array.isArray(ev.requirements) ? ev.requirements.join(', ') : '', 
                                    benefits: Array.isArray(ev.benefits) ? ev.benefits.join(', ') : '' 
                                });
                                scrollToTop();
                            }} 
                            className={`w-full p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center group ${editingEventId === ev.id ? 'bg-emerald-50 border-spark-green ring-1 ring-spark-green' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
                        >
                             <div>
                                 <p className="text-sm font-bold text-slate-800 dark:text-white">{ev.title}</p>
                                 <p className="text-xs text-slate-500 mt-1">{new Date(ev.date).toLocaleDateString()} • {ev.location}</p>
                             </div>
                             <Icons.Edit className={`w-4 h-4 ${editingEventId === ev.id ? 'text-spark-green' : 'text-slate-300 group-hover:text-emerald-500'}`} />
                         </div>
                     ))}
                     {events.length === 0 && <p className="text-center text-sm text-slate-400 py-4">No events found.</p>}
                </div>
            </div>
        </div>
    );

    const renderAnnounceTab = () => (
        <div className="flex flex-col gap-8">
            {/* 1. CREATE/EDIT FORM */}
            <div className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="flex justify-between items-center"><h3 className="font-bold text-slate-800 dark:text-white">{editingAnnounceId ? 'Edit Notice' : 'Create Notice'}</h3>{editingAnnounceId && <button onClick={() => { setEditingAnnounceId(null); announceForm.reset(emptyAnnounce); }} className="text-xs text-blue-500 font-bold">+ New</button>}</div>
                 <Input label="Title" value={announceForm.values.title} onChange={e => announceForm.handleChange('title', e.target.value)} error={announceForm.errors.title} />
                 <Input label="Author" value={announceForm.values.author} onChange={e => announceForm.handleChange('author', e.target.value)} />
                 <ImageUpload label="Image" value={announceForm.values.imageUrl || ''} onChange={url => announceForm.handleChange('imageUrl', url)} />
                 <TextArea label="Content" rows={5} value={announceForm.values.content} onChange={e => announceForm.handleChange('content', e.target.value)} error={announceForm.errors.content} />
                 <div className="flex gap-3">
                     {editingAnnounceId && <Button type="button" variant="danger" onClick={async () => { await deleteAnnouncement(editingAnnounceId); setEditingAnnounceId(null); announceForm.reset(emptyAnnounce); }}>Delete</Button>}
                     <Button variant="secondary" fullWidth onClick={handleAnnounceSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Notice'}</Button>
                 </div>
            </div>

            {/* 2. EXISTING ITEMS LIST */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Manage Existing Notices</h3>
                <div className="grid grid-cols-1 gap-3">
                     {announcements.map(ann => (
                         <div 
                            key={ann.id} 
                            onClick={() => { 
                                setEditingAnnounceId(ann.id); 
                                announceForm.setValues(ann);
                                scrollToTop();
                            }} 
                            className={`w-full p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center group ${editingAnnounceId === ann.id ? 'bg-orange-50 border-spark-orange ring-1 ring-spark-orange' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-300'}`}
                        >
                             <div className="flex-1 pr-4">
                                 <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{ann.title}</p>
                                 <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{ann.content}</p>
                             </div>
                             <Icons.Edit className={`w-4 h-4 ${editingAnnounceId === ann.id ? 'text-spark-orange' : 'text-slate-300 group-hover:text-orange-500'}`} />
                         </div>
                     ))}
                     {announcements.length === 0 && <p className="text-center text-sm text-slate-400 py-4">No notices found.</p>}
                </div>
            </div>
        </div>
    );

    const renderUserTab = () => (
        <div className="flex flex-col gap-8">
            {/* 1. CREATE/EDIT FORM */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        {editingUserId ? (
                            <>
                                <span className="text-indigo-500">Edit User</span>
                                <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">#{editingUserId.slice(-4)}</span>
                            </>
                        ) : 'Create New User'}
                    </h3>
                    {editingUserId && (
                        <button onClick={() => { setEditingUserId(null); userForm.reset(emptyUser); }} className="text-xs text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                            + New
                        </button>
                    )}
                 </div>
                 
                 <div className="space-y-6">
                     {/* Photo Centered */}
                     <div className="flex flex-col items-center justify-center">
                        <ImageUpload label="Profile Photo" value={userForm.values.avatar || ''} onChange={url => userForm.handleChange('avatar', url)} />
                     </div>

                     {/* Fields */}
                     <div className="space-y-4">
                        <Input label="Full Name" value={userForm.values.name} onChange={e => userForm.handleChange('name', e.target.value)} error={userForm.errors.name} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Phone (Login)" value={userForm.values.phone} onChange={e => userForm.handleChange('phone', e.target.value)} error={userForm.errors.phone} />
                            <Input label="Unit / Apt" value={userForm.values.unit} onChange={e => userForm.handleChange('unit', e.target.value)} error={userForm.errors.unit} />
                        </div>

                         {/* Role */}
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
                            <div className="flex gap-3">
                                 <button type="button" onClick={() => userForm.handleChange('role', 'RESIDENT')} className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${userForm.values.role === 'RESIDENT' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Resident</button>
                                 <button type="button" onClick={() => userForm.handleChange('role', 'ADMIN')} className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${userForm.values.role === 'ADMIN' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Admin</button>
                            </div>
                         </div>

                        <Input label="Email" value={userForm.values.email} onChange={e => userForm.handleChange('email', e.target.value)} />
                     </div>
                 </div>
                 
                 {/* Actions */}
                 <div className="flex gap-3 pt-6 mt-2 border-t border-slate-100 dark:border-slate-700">
                     {editingUserId && <Button type="button" variant="danger" onClick={async () => { await removeUser(editingUserId); setEditingUserId(null); userForm.reset(emptyUser); setSearchResults(prev => prev.filter(p => p.id !== editingUserId)); }}>Delete</Button>}
                     <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600 shadow-indigo-500/30" fullWidth onClick={handleUserSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save User'}</Button>
                 </div>
            </div>

            {/* 2. SEARCH & EXISTING ITEMS LIST */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Find Users</h3>
                
                {/* Search Bar */}
                <div className="flex gap-2">
                    <Input 
                        placeholder="Search Name, Mobile, or Unit..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                        className="bg-white dark:bg-slate-800"
                    />
                    <Button onClick={handleUserSearch} disabled={isSearching} className="w-auto px-6">
                        {isSearching ? '...' : <Icons.Settings className="w-5 h-5 rotate-90" />} 
                    </Button>
                </div>

                {/* Results List */}
                <div className="grid grid-cols-1 gap-3">
                     {hasSearched && searchResults.length === 0 && !isSearching && (
                         <p className="text-center text-slate-400 py-4 text-sm">No users found.</p>
                     )}
                     
                     {searchResults.map(u => (
                         <div 
                            key={u.id} 
                            onClick={() => { 
                                setEditingUserId(u.id); 
                                userForm.setValues(u); 
                                scrollToTop();
                            }} 
                            className={`w-full p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 group ${editingUserId === u.id ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                        >
                             <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                             <div className="flex-1">
                                 <p className="text-sm font-bold text-slate-800 dark:text-white">{u.name}</p>
                                 <p className="text-xs text-slate-500">{u.role} • {u.unit} • {u.phone}</p>
                             </div>
                             <Icons.Edit className={`w-4 h-4 ${editingUserId === u.id ? 'text-indigo-500' : 'text-slate-300 group-hover:text-indigo-500'}`} />
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
    
    // --- SETTINGS TAB RENDERER ---
    const renderSettingsTab = () => {
        const hasCustomImage = !!settings['home_hero_image'];
        const defaultImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop";

        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-8">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4">Home Screen Appearance</h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hero Background Image</label>
                                 {!hasCustomImage && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded-full font-bold">Using Default</span>}
                             </div>
                             <ImageUpload 
                                label="" 
                                value={settings['home_hero_image'] || ''} 
                                onChange={(url) => updateSetting('home_hero_image', url)} 
                             />
                        </div>

                        {/* Visual Preview */}
                        {!hasCustomImage && (
                            <div className="opacity-50 pointer-events-none grayscale">
                                <p className="text-xs text-slate-400 mb-1">Default Preview:</p>
                                <img src={defaultImage} className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700" alt="Default" />
                            </div>
                        )}

                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                            <div className="flex gap-2">
                                <Icons.Settings className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed">
                                    <strong>How it works:</strong> The image you upload here is compressed and stored directly as text data in your Google Sheet's "Settings" tab (cell value). No external image hosting URL is needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-center text-slate-400">More settings coming soon.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
             <TopBar theme={theme} toggleTheme={toggleTheme} onBack={goBack} title="Admin Panel" showBack />
             
             {/* NEW ICON-BASED NAVIGATION */}
             <div className="px-4 sticky top-16 z-30">
                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto no-scrollbar gap-1 shadow-sm border border-slate-200 dark:border-slate-700/50">
                     {ADMIN_TABS.map((tab) => {
                         const isActive = activeTab === tab.id;
                         return (
                             <button
                                 key={tab.id}
                                 onClick={() => setActiveTab(tab.id)}
                                 className={`
                                    relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300
                                    ${isActive ? 'flex-grow-[1.5] bg-white dark:bg-slate-700 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'flex-grow bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}
                                 `}
                             >
                                 <tab.icon className={`w-5 h-5 transition-colors ${isActive ? tab.color : 'text-slate-400'}`} />
                                 
                                 {/* Label - Only visible when active for compact look */}
                                 {isActive && (
                                     <span className={`text-xs font-bold whitespace-nowrap ${isActive ? tab.color : 'text-slate-400'}`}>
                                         {tab.label}
                                     </span>
                                 )}
                             </button>
                         );
                     })}
                 </div>
             </div>

             <div className="px-4 space-y-4">
                 {activeTab === 'EVENT' && renderEventTab()}
                 {activeTab === 'ANNOUNCE' && renderAnnounceTab()}
                 {activeTab === 'USERS' && renderUserTab()}
                 {activeTab === 'SETTINGS' && renderSettingsTab()}
             </div>
        </div>
    );
};
