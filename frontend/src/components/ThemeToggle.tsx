'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18; // Before 6am or after 6pm
  };

  useEffect(() => {
    setMounted(true);
    // Always use time-based theme on initial load
    const shouldBeDark = isNightTime();
    setTheme(shouldBeDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      {/* Mode label with fade effect */}
      <div 
        className={`hidden md:block px-3 py-2 rounded-full 
          bg-white dark:bg-gray-800 
          text-gray-800 dark:text-gray-200
          text-sm font-medium
          shadow-lg border border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${showLabel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onMouseEnter={() => setShowLabel(false)}
      >
        {theme === 'light' ? 'Light Mode Enabled' : 'Dark Mode Enabled'}
      </div>
      
      {/* Toggle button */}
      <button
        onClick={() => {
          const newTheme = theme === 'light' ? 'dark' : 'light';
          setTheme(newTheme);
          document.documentElement.classList.toggle('dark');
          // Only show label on desktop
          if (window.innerWidth >= 768) {
            setShowLabel(true);
          }
        }}
        onMouseEnter={() => setShowLabel(true)}
        className="p-2 rounded-full 
          bg-white dark:bg-gray-800 
          hover:bg-gray-100 dark:hover:bg-gray-700 
          shadow-lg border border-gray-200 dark:border-gray-700
          transition-all z-50"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        ) : (
          <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        )}
      </button>
    </div>
  );
} 