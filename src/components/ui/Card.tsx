import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = true,
  glass = false,
  glow = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/65 card-shadow transition-all duration-300';
  const hoverStyle = hoverable ? 'hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-950/40 hover:border-slate-200 dark:hover:border-slate-700/80' : '';
  const glassStyle = glass ? 'glass-effect' : '';
  const glowStyle = glow ? 'glow-indigo border-indigo-500/20 dark:border-indigo-400/20' : '';

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${glassStyle} ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-b border-slate-100 dark:border-slate-800/60 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl ${className}`} {...props}>
    {children}
  </div>
);
