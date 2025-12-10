
import React from 'react';
import { Icons } from '../constants';
import { useNav, useUser, useTheme } from '../context';
import { useForm } from '../hooks';
import { Button, Input } from '../components/ui.tsx';
import { TopBar } from '../components/Layout';

export const ProfileScreen: React.FC = () => {
    const { user, updateUser } = useUser();
    const { goBack } = useNav();
    const { theme, toggleTheme } = useTheme();
    
    const { values, handleChange, handleSubmit } = useForm(user, (vals) => ({}));

    return (
        <div className="space-y-6 animate-fade-in pb-8 relative">
            <TopBar transparent theme={theme} toggleTheme={toggleTheme} onBack={goBack} showBack />
            <div className="relative mb-16 -mt-20">
                 <div className="h-40 w-full rounded-b-[2.5rem] bg-gradient-to-r from-emerald-400 to-teal-500 overflow-hidden relative shadow-lg shadow-emerald-500/20">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                 </div>
                 <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                      <div className="relative group">
                          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 p-0.5 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                              <img src={values.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                          </div>
                          <div className="absolute bottom-0 right-0 p-2 bg-spark-green text-white rounded-full border-4 border-white dark:border-slate-900 shadow-lg cursor-pointer">
                              <Icons.Camera className="w-4 h-4" />
                          </div>
                      </div>
                 </div>
            </div>

            <div className="px-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-5">
                 <div className="space-y-4">
                     <Input label="Full Name" value={values.name} onChange={e => handleChange('name', e.target.value)} />
                     <Input label="Email" value={values.email} onChange={e => handleChange('email', e.target.value)} />
                     <Input label="Phone" value={values.phone} onChange={e => handleChange('phone', e.target.value)} />
                     <Input label="Unit" value={values.unit} onChange={e => handleChange('unit', e.target.value)} />
                 </div>
                 <Button fullWidth onClick={() => handleSubmit(updateUser)}>Update Profile</Button>
            </div>
            </div>
        </div>
    );
};
