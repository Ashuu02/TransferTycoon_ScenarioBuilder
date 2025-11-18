import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, description, className = '' }) => {
  return (
    <div className={`bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};