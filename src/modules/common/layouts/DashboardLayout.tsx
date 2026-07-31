import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive checking
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#080B11] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isMobile={isMobile} 
      />

      {/* Main Container */}
      <div 
        className={`flex-grow flex flex-col min-h-screen min-w-0 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Navbar Header */}
        <Navbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          isMobile={isMobile} 
        />

        {/* Content Area */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
