import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  count = 1,
}) => {
  const baseStyle = 'skeleton-bg animate-shimmer bg-[length:200%_100%]';
  
  const variantStyle = {
    text: 'h-4 w-3/4 rounded',
    rect: 'h-24 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
  };

  const skeletons = Array.from({ length: count });

  if (count > 1) {
    return (
      <div className="space-y-3 w-full">
        {skeletons.map((_, i) => (
          <div key={i} className={`${baseStyle} ${variantStyle[variant]} ${className}`} />
        ))}
      </div>
    );
  }

  return <div className={`${baseStyle} ${variantStyle[variant]} ${className}`} />;
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Skeleton variant="rect" className="h-28" count={4} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton variant="rect" className="h-96 lg:col-span-2" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    </div>
  );
};
