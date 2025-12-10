
import React, { useState } from 'react';
import { AppEvent, Announcement, User } from '../types';
import { useNav, useData, useTheme, useToast } from '../context';
import { useForm } from '../hooks';
import { Button, Input, TextArea, ImageUpload } from '../components/ui.tsx';
import { TopBar } from '../components/Layout';
import { MOCK_EVENTS, MOCK_ANNOUNCEMENTS, MOCK_USER, Icons } from '../constants';
import { sheetApi } from '../googleSheetsClient';

// -- Event Form Logic --
type EventFormState = Omit<Partial<AppEvent>, 'requirements' | 'benefits'> & { requirements?: string; benefits?: string; };

export const AdminScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'EVENT' | 'ANNOUNCE' | 'USERS'>('EVENT');
    const { 
        events, announcements, allUsers, refreshData,
        addEvent, updateEvent, deleteEvent, 
        addAnnouncement, updateAnnouncement, deleteAnnouncement,
        addUser, editUser, removeUser
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
                    const existing = allUsers.find(u => u.id === editingUserId);
                    await editUser({ ...existing, ...payload } as User);
                } else {
                    await addUser(payload);
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

    // --- RENDERERS ---

    const renderEventTab = () => (
        <>
            <div className="overflow-x-auto no-scrollbar pb-2 flex gap-3">
                 {events.map(ev => (
                     <div key={ev.id} onClick={() => { setEditingEventId(ev.id); eventForm.setValues({ ...ev, requirements: ev.requirements.join(', '), benefits: ev.benefits.join(', ') }); }} className={`min-w-[160px] p-3 rounded-xl border cursor-pointer transition-all ${editingEventId === ev.id ? 'bg-emerald-50 border-spark-green' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                         <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{ev.title}</p>
                         <p className="text-[10px] text-slate-500">{new Date(ev.date).toLocaleDateString()}</p>
                     </div>
                 ))}
            </div>
            <div className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="flex justify-between items-center"><h3 className="font-bold text-slate-800 dark:text-white">{editingEventId ? 'Edit Event' : 'Create Event'}</h3>{editingEventId && <button onClick={() => { setEditingEventId(null); eventForm.reset(emptyEvent); }} className="text-xs text-blue-500 font-bold">+ New</button>}</div>
                 <Input label="Title" value={eventForm.values.title} onChange={e => eventForm.handleChange('title', e.target.value)} error={eventForm.errors.title} />
                 <div className="grid grid-cols-2 gap-4">
                    <Input type="datetime-local" label="Date" value={eventForm.values.date} onChange={e => eventForm.handleChange('date', e.target.value)} error={eventForm.errors.date} />
                    <Input label="Time" value={eventForm.values.time} onChange={e => eventForm.handleChange('time', e.target.value)} />
                 </div>
                 <Input label="Location" value={eventForm.values.location} onChange={e => eventForm.handleChange('location', e.target.value)} error={eventForm.errors.location} />
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
        </>
    );

    const renderAnnounceTab = () => (
        <>
            <div className="overflow-x-auto no-scrollbar pb-2 flex gap-3">
                 {announcements.map(ann => (
                     <div key={ann.id} onClick={() => { setEditingAnnounceId(ann.id); announceForm.setValues(ann); }} className={`min-w-[160px] p-3 rounded-xl border cursor-pointer transition-all ${editingAnnounceId === ann.id ? 'bg-orange-50 border-spark-orange' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                         <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{ann.title}</p>
                     </div>
                 ))}
            </div>
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
        </>
    );

    const renderUserTab = () => (
        <>
             {/* User List Horizontal Scroll */}
             <div className="overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 flex gap-3">
                 <button 
                    onClick={() => { setEditingUserId(null); userForm.reset(emptyUser); }}
                    className="min-w-[60px] flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-400 shrink-0"
                 >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                        <span className="text-xl font-bold">+</span>
                    </div>
                    <span className="text-[10px] font-bold">New</span>
                 </button>
                 
                 {allUsers.map(u => (
                     <div key={u.id} onClick={() => { setEditingUserId(u.id); userForm.setValues(u); }} className={`relative min-w-[140px] p-3 rounded-2xl border cursor-pointer transition-all snap-start ${editingUserId === u.id ? 'bg-white dark:bg-slate-800 ring-2 ring-indigo-500 shadow-lg z-10' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'}`}>
                         <div className="flex flex-col items-center text-center gap-2">
                             <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                             <div>
                                 <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[110px]">{u.name}</p>
                                 <p className="text-[10px] text-slate-500 truncate">{u.phone}</p>
                             </div>
                         </div>
                     </div>
                 ))}
            </div>

            {/* Edit Form */}
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

                         {/* Role moved below Phone/Unit */}
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
                     {editingUserId && <Button type="button" variant="danger" onClick={async () => { await removeUser(editingUserId); setEditingUserId(null); userForm.reset(emptyUser); }}>Delete</Button>}
                     <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600 shadow-indigo-500/30" fullWidth onClick={handleUserSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save User'}</Button>
                 </div>
            </div>
        </>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
             <TopBar theme={theme} toggleTheme={toggleTheme} onBack={goBack} title="Admin Panel" showBack />
             <div className="px-4 space-y-4">
                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                     <button onClick={() => setActiveTab('EVENT')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'EVENT' ? 'bg-white dark:bg-slate-700 shadow-sm text-spark-green' : 'text-slate-500'}`}>Events</button>
                     <button onClick={() => setActiveTab('ANNOUNCE')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'ANNOUNCE' ? 'bg-white dark:bg-slate-700 shadow-sm text-spark-orange' : 'text-slate-500'}`}>Notices</button>
                     <button onClick={() => setActiveTab('USERS')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'USERS' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-500' : 'text-slate-500'}`}>Users</button>
                 </div>

                 {activeTab === 'EVENT' && renderEventTab()}
                 {activeTab === 'ANNOUNCE' && renderAnnounceTab()}
                 {activeTab === 'USERS' && renderUserTab()}
             </div>
        </div>
    );
};
