import React from 'react';
import Header from './Header';
import { ThemeToggle } from './ThemeToggle'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen transition-all duration-200">
      {/* Mobile-optimized background */}
      <div className="fixed inset-0 md:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F0FE] via-[#FAFAFA] to-[#F0F7FF] dark:from-[#1A2B3B] dark:via-[#0F1D2D] dark:to-[#162635] opacity-100"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-[#6BA5F7]/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-l from-[#9B7EF8]/20 to-transparent"></div>
      </div>
      
      {/* Desktop-optimized background */}
      <div className="fixed inset-0 hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F0FE] via-[#FAFAFA] to-[#F0F7FF] dark:from-[#1A2B3B] dark:via-[#0F1D2D] dark:to-[#162635] opacity-100"></div>
        <div className="absolute top-0 left-0 w-1/2 h-screen bg-gradient-to-r from-[#6BA5F7]/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-[#9B7EF8]/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-2 md:py-4 max-w-6xl backdrop-blur-sm bg-white/30 dark:bg-[#1A2B3B]/30 rounded-lg shadow-lg">
          {children}
        </main>
        
        <footer className="border-t border-current/20">
          <div className="container mx-auto px-4 py-6 text-center 
            font-serif text-theme-light-primary dark:text-theme-dark-primary
            text-sm tracking-wide">
            {new Date().getFullYear()} Shane's Blog. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
