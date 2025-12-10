
import React from 'react';
import { Icons } from '../constants';
import { ToastMessage } from '../types';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-spark-green hover:bg-spark-darkGreen text-white shadow-lg shadow-emerald-500/30 focus:ring-spark-green",
    secondary: "bg-spark-orange hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 focus:ring-spark-orange",
    outline: "border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${width} ${className}`} 
      disabled={props.disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// --- CARD ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

// --- FEED CARD (Events/Announcements) ---
interface FeedCardProps {
  imageUrl?: string;
  title: string;
  date: string | Date;
  onClick: () => void;
  badges?: React.ReactNode;
  children?: React.ReactNode;
  isSoldOut?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({ 
  imageUrl, title, date, onClick, badges, children, isSoldOut = false 
}) => {
    const dateObj = new Date(date);
    
    return (
        <div 
            onClick={onClick}
            className="group bg-white dark:bg-slate-800 overflow-hidden cursor-pointer transition-all duration-300 relative w-full h-[65vh] rounded-[8vw] shadow-2xl first:rounded-t-none"
        >
            <div className="relative w-full h-full">
                {imageUrl ? (
                     <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                     <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Icons.Sparkles className="w-20 h-20 text-slate-400" />
                     </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Date Badge */}
                <div className="absolute top-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2.5 text-center min-w-[3.5rem] shadow-lg ring-1 ring-black/5 z-20">
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{dateObj.toLocaleDateString('default', { month: 'short' })}</span>
                    <span className="block text-xl font-extrabold text-slate-800 dark:text-white font-nunito">{dateObj.getDate()}</span>
                </div>
                
                {/* Sold Out Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="px-6 py-2 border-2 border-white text-white text-2xl font-black uppercase tracking-widest -rotate-12">Sold Out</div>
                    </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    {/* Badges Stacked Above Title */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {badges}
                    </div>

                    <h3 className="font-bold text-white mb-3 font-nunito leading-tight text-3xl line-clamp-2">{title}</h3>
                    
                    {/* Additional Content (Time/Location or Description) */}
                    <div className="flex flex-col gap-2 text-slate-200">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <input 
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-spark-green'} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

// --- TEXTAREA ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <textarea 
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-spark-green'} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

// --- IMAGE COMPRESSION UTILITY ---
// Google Sheets cells have a limit of 50,000 characters.
// We must compress images to fit this limit. 
export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max dimensions to ensure base64 string stays under ~32k characters
        // A 400x400 image at 0.6 quality is usually around 20-30KB
        const MAX_SIZE = 450;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context missing');
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Initial compression
        let quality = 0.6;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Recursive reduction if still too large for Google Sheets (Safe margin 45k chars)
        while (dataUrl.length > 45000 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// --- IMAGE UPLOAD ---
export const ImageUpload: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}> = ({ label, value, onChange, error }) => {
  const [loading, setLoading] = React.useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       setLoading(true);
       try {
         const compressedBase64 = await compressImage(file);
         onChange(compressedBase64);
       } catch (err) {
         console.error("Image processing failed", err);
         alert("Failed to process image. Please try another one.");
       } finally {
         setLoading(false);
       }
     }
  };

  return (
    <div className="space-y-2">
       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
       <div className="flex items-center gap-4">
           {/* Preview Area */}
           <div className={`relative w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} overflow-hidden flex-shrink-0 shadow-sm group`}>
               {loading ? (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                       <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-spark-green mb-1"></span>
                   </div>
               ) : value ? (
                   <>
                     <img src={value} alt="Preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                   </>
               ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                       <Icons.Camera className="w-6 h-6 mb-1" />
                       <span className="text-[9px] font-bold uppercase">No Image</span>
                   </div>
               )}
           </div>
           
           {/* Actions */}
           <div className="flex flex-col items-start gap-2">
               <label className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm active:scale-95 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                   <Icons.Camera className="w-4 h-4 text-spark-green" />
                   {value ? 'Change Image' : 'Take / Upload Photo'}
                   {/* Added capture="environment" to prefer rear camera on mobile */}
                   <input 
                     type="file" 
                     accept="image/*" 
                     capture="environment"
                     className="hidden" 
                     onChange={handleFile} 
                     disabled={loading} 
                   />
               </label>
               
               {value && (
                   <button 
                     type="button" 
                     onClick={() => onChange('')}
                     className="text-xs font-bold text-red-500 hover:text-red-600 px-2"
                   >
                     Remove Image
                   </button>
               )}
               <p className="text-[10px] text-slate-400 px-1">Optimized for Sheets Storage</p>
           </div>
       </div>
       {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

// --- TOAST COMPONENTS ---

export const Toast: React.FC<ToastMessage & { onRemove: (id: string) => void }> = ({ id, message, type, onRemove }) => {
    // Styles based on type
    const styles = {
        success: "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white/95 dark:bg-slate-800/95",
        error: "border-red-500 text-red-700 dark:text-red-400 bg-white/95 dark:bg-slate-800/95",
        info: "border-blue-500 text-blue-700 dark:text-blue-400 bg-white/95 dark:bg-slate-800/95"
    };

    const icons = {
        success: <Icons.Check className="w-5 h-5 text-emerald-500" />,
        error: <Icons.Shield className="w-5 h-5 text-red-500" />, // Using shield as alert icon substitute
        info: <Icons.Megaphone className="w-5 h-5 text-blue-500" />
    };

    return (
        <div 
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border-l-4 animate-slide-in-top ${styles[type]} min-w-[300px] max-w-sm`}
            role="alert"
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-bold flex-1">{message}</p>
        </div>
    );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none p-4">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onRemove={onRemove} />
            ))}
        </div>
    );
};
