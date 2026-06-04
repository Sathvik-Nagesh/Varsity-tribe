import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="pt-6 md:pt-8 min-h-[calc(100vh-96px)]">
      {children}
    </div>
  );
};
