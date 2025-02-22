import React from 'react';
import Header from './Header';
import { ThemeToggle } from './ThemeToggle'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen transition-all duration-200">
      <Header />
      
      {/* Divider Image */}
      <div className="w-full flex justify-center pb-0 pt-6">
        <img 
          src="/images/light-divider.png" 
          alt="decorative divider"
          className="h-40 object-contain block dark:hidden opacity-80"
        />
        <img 
          src="/images/dark-divider.png" 
          alt="decorative divider"
          className="h-40 object-contain hidden dark:block opacity-80"
        />
      </div>

      <main className="container mx-auto px-4 py-4 max-w-6xl">
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
  );
};

export default Layout;
