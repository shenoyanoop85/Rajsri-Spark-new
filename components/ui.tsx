
import React from 'react';
import { Icons } from '../constants';

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

// --- IMAGE UPLOAD ---
export const ImageUpload: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}> = ({ label, value, onChange, error }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       const reader = new FileReader();
       reader.onloadend = () => onChange(reader.result as string);
       reader.readAsDataURL(file);
     }
  };

  return (
    <div className="space-y-2">
       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
       <div className="flex items-center gap-4">
           {/* Preview Area */}
           <div className={`relative w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} overflow-hidden flex-shrink-0 shadow-sm group`}>
               {value ? (
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
               <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm active:scale-95">
                   <Icons.Camera className="w-4 h-4 text-spark-green" />
                   {value ? 'Change Image' : 'Take / Upload Photo'}
                   <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
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
               <p className="text-[10px] text-slate-400 px-1">Supports JPG, PNG</p>
           </div>
       </div>
       {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};
