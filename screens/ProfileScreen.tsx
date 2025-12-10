
import React from 'react';
import { Icons } from '../constants';
import { useNav, useUser, useTheme, useToast } from '../context';
import { useForm } from '../hooks';
import { Button, Input, compressImage } from '../components/ui.tsx';
import { TopBar } from '../components/Layout';

export const ProfileScreen: React.FC = () => {
    const { user, updateUser } = useUser();
    const { goBack } = useNav();
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    
    const { values, handleChange, handleSubmit } = useForm(user, (vals) => ({}));
    const [uploading, setUploading] = React.useState(false);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (file) {
           setUploading(true);
           try {
             const compressedBase64 = await compressImage(file);
             handleChange('avatar', compressedBase64);
           } catch (err) {
             console.error("Image processing failed", err);
             showToast("Failed to process image.", "error");
           } finally {
             setUploading(false);
           }
         }
      };

    return (
        <div className="animate-fade-in pb-8 relative min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Standard TopBar with backdrop blur, giving a semi-transparent feel while maintaining readability */}
            <TopBar theme={theme} toggleTheme={toggleTheme} onBack={goBack} showBack title="Edit Profile" />

            <div className="px-4">
                {/* Avatar Section - Minimal & Centered (Transparent background feel) */}
                <div className="flex flex-col items-center pt-6 mb-8">
                     <div className="relative group">
                          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-800 relative">
                              {uploading ? (
                                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                      <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-spark-green"></span>
                                  </div>
                              ) : (
                                  <img src={values.avatar} alt="Profile" className="w-full h-full object-cover" />
                              )}
                          </div>
                          <label className={`absolute bottom-1 right-1 flex items-center justify-center w-10 h-10 bg-spark-green text-white rounded-full border-4 border-white dark:border-slate-900 shadow-lg cursor-pointer hover:bg-emerald-600 transition-colors active:scale-95 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                              <Icons.Camera className="w-5 h-5" />
                              <input type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={uploading} />
                          </label>
                     </div>
                     <div className="mt-4 text-center">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-nunito">{values.name}</h2>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{values.role} • {values.unit}</p>
                     </div>
                </div>

                {/* Form Section */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-5">
                     <div className="space-y-4">
                         <Input label="Full Name" value={values.name} onChange={e => handleChange('name', e.target.value)} />
                         <Input label="Email" value={values.email} onChange={e => handleChange('email', e.target.value)} />
                         <Input label="Phone" value={values.phone} onChange={e => handleChange('phone', e.target.value)} />
                         <Input label="Unit / Apartment" value={values.unit} onChange={e => handleChange('unit', e.target.value)} />
                     </div>
                     <Button fullWidth onClick={() => handleSubmit(updateUser)}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
};
