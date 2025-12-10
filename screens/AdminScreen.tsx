
import React, { useState } from 'react';
import { AppEvent, Announcement } from '../types';
import { useNav, useData, useTheme } from '../context';
import { useForm } from '../hooks';
import { Button, Input, TextArea, ImageUpload } from '../components/ui.tsx';
import { TopBar } from '../components/Layout';

// -- Event Form Logic --
type EventFormState = Omit<Partial<AppEvent>, 'requirements' | 'benefits'> & { requirements?: string; benefits?: string; };

export const AdminScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'EVENT' | 'ANNOUNCE'>('EVENT');
    const { events, announcements, addEvent, updateEvent, deleteEvent, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useData();
    const { goBack } = useNav();
    const { theme, toggleTheme } = useTheme();
    
    const emptyEvent: EventFormState = { title: '', date: '', time: '', location: '', imageUrl: '', description: '', type: 'General', isHighPriority: false, requirements: '', benefits: '', capacity: 0 };
    
    const validateEvent = (vals: EventFormState) => {
        const errors: Record<string, string> = {};
        if (!vals.title) errors.title = "Title is required";
        if (!vals.date) errors.date = "Date is required";
        if (!vals.location) errors.location = "Location is required";
        if (vals.capacity !== undefined && vals.capacity <= 0) errors.capacity = "Capacity must be greater than 0";
        return errors;
    };

    const eventForm = useForm<EventFormState>(emptyEvent, validateEvent);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    const handleEventSubmit = () => {
        eventForm.handleSubmit((vals) => {
            const payload: AppEvent = {
                id: editingEventId || `new_${Date.now()}`,
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
                registeredCount: events.find(e => e.id === editingEventId)?.registeredCount || 0
            };
            if (editingEventId) updateEvent(payload);
            else addEvent(payload);
            
            eventForm.reset(emptyEvent);
            setEditingEventId(null);
            alert('Event Saved!');
        });
    };

    const startEditEvent = (evt: AppEvent) => {
        setEditingEventId(evt.id);
        eventForm.setValues({
            ...evt,
            requirements: evt.requirements.join(', '),
            benefits: evt.benefits.join(', ')
        });
    };

    // -- Announcement Form Logic --
    const emptyAnnounce: Partial<Announcement> = { title: '', content: '', author: '', imageUrl: '' };
    const announceForm = useForm<Partial<Announcement>>(emptyAnnounce, (vals) => {
        const errors: Record<string, string> = {};
        if (!vals.title) errors.title = "Title is required";
        if (!vals.content) errors.content = "Content is required";
        return errors;
    });
    const [editingAnnounceId, setEditingAnnounceId] = useState<string | null>(null);

    const handleAnnounceSubmit = () => {
        announceForm.handleSubmit((vals) => {
            const payload: Announcement = {
                id: editingAnnounceId || `new_ann_${Date.now()}`,
                title: vals.title!,
                content: vals.content!,
                author: vals.author || 'Admin',
                date: new Date().toISOString(),
                imageUrl: vals.imageUrl,
                validFrom: vals.validFrom,
                validTo: vals.validTo
            };
            if (editingAnnounceId) updateAnnouncement(payload);
            else addAnnouncement(payload);
            
            announceForm.reset(emptyAnnounce);
            setEditingAnnounceId(null);
            alert('Notice Saved!');
        });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
             <TopBar theme={theme} toggleTheme={toggleTheme} onBack={goBack} title="Admin Panel" showBack />
             <div className="px-4 space-y-4">
                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                     <button onClick={() => setActiveTab('EVENT')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'EVENT' ? 'bg-white dark:bg-slate-700 shadow-sm text-spark-green' : 'text-slate-500'}`}>Events</button>
                     <button onClick={() => setActiveTab('ANNOUNCE')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'ANNOUNCE' ? 'bg-white dark:bg-slate-700 shadow-sm text-spark-orange' : 'text-slate-500'}`}>Notices</button>
                 </div>

                 {/* Horizontal List */}
                 <div className="overflow-x-auto no-scrollbar pb-2 flex gap-3">
                     {activeTab === 'EVENT' ? events.map(ev => (
                         <div key={ev.id} onClick={() => startEditEvent(ev)} className={`min-w-[160px] p-3 rounded-xl border cursor-pointer transition-all ${editingEventId === ev.id ? 'bg-emerald-50 border-spark-green' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                             <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{ev.title}</p>
                             <p className="text-[10px] text-slate-500">{new Date(ev.date).toLocaleDateString()}</p>
                         </div>
                     )) : announcements.map(ann => (
                         <div key={ann.id} onClick={() => { setEditingAnnounceId(ann.id); announceForm.setValues(ann); }} className={`min-w-[160px] p-3 rounded-xl border cursor-pointer transition-all ${editingAnnounceId === ann.id ? 'bg-orange-50 border-spark-orange' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                             <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{ann.title}</p>
                         </div>
                     ))}
                 </div>

                 {/* Forms */}
                 {activeTab === 'EVENT' ? (
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
                             {editingEventId && <Button type="button" variant="danger" onClick={() => { deleteEvent(editingEventId); setEditingEventId(null); eventForm.reset(emptyEvent); }}>Delete</Button>}
                             <Button fullWidth onClick={handleEventSubmit}>Save Event</Button>
                         </div>
                     </div>
                 ) : (
                     <div className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                         <div className="flex justify-between items-center"><h3 className="font-bold text-slate-800 dark:text-white">{editingAnnounceId ? 'Edit Notice' : 'Create Notice'}</h3>{editingAnnounceId && <button onClick={() => { setEditingAnnounceId(null); announceForm.reset(emptyAnnounce); }} className="text-xs text-blue-500 font-bold">+ New</button>}</div>
                         <Input label="Title" value={announceForm.values.title} onChange={e => announceForm.handleChange('title', e.target.value)} error={announceForm.errors.title} />
                         <Input label="Author" value={announceForm.values.author} onChange={e => announceForm.handleChange('author', e.target.value)} />
                         <ImageUpload label="Image" value={announceForm.values.imageUrl || ''} onChange={url => announceForm.handleChange('imageUrl', url)} />
                         <TextArea label="Content" rows={5} value={announceForm.values.content} onChange={e => announceForm.handleChange('content', e.target.value)} error={announceForm.errors.content} />
                         <div className="flex gap-3">
                             {editingAnnounceId && <Button type="button" variant="danger" onClick={() => { deleteAnnouncement(editingAnnounceId); setEditingAnnounceId(null); announceForm.reset(emptyAnnounce); }}>Delete</Button>}
                             <Button variant="secondary" fullWidth onClick={handleAnnounceSubmit}>Save Notice</Button>
                         </div>
                     </div>
                 )}
             </div>
        </div>
    );
};
