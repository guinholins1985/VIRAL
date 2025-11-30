import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'border-blue-500', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${color} ${className}`} role="status">
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;