'use client';
import { ThemeToggle } from '../components/ThemeToggle';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Full-width background container
    <div className="min-h-screen relative">
      {/* Background image that spans full width */}
      <div className="fixed inset-0 
        bg-[url('/images/bg-light.webp')] dark:bg-[url('/images/bg-dark.webp')]
        bg-repeat-x bg-center
        [background-size:50%_100vh]
        transition-[background-image] duration-1000"
      />
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Main content container */}
      <div className="relative mx-auto max-w-6xl 
        bg-cream dark:bg-[#0a192f]
        min-h-screen shadow-xl backdrop-blur-sm
        z-10">
        {children}
      </div>
    </div>
  );
} 