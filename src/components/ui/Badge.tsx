import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center font-medium rounded-full tracking-wide';
  
  const variants = {
    primary: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30',
    secondary: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30',
    accent: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30',
    neutral: 'bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 border border-slate-100 dark:border-slate-700/80',
    danger: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/30',
    info: 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
