import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: ((isOpen: boolean) => React.ReactNode) | React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ 
  title, 
  defaultOpen = true, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-full flex items-center justify-between p-4 
          bg-gradient-to-r from-gray-50 via-white to-gray-50 
          dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
          rounded-t-lg transition-all duration-300
          hover:from-gray-100 hover:via-gray-50 hover:to-gray-100
          dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-800
          border-b-2 border-theme-light-primary/20 dark:border-theme-dark-primary/20"
      >
        <div className="flex items-center space-x-4 flex-1">
          {/* Left decorative element */}
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-theme-light-primary/30 dark:via-theme-dark-primary/30 to-transparent"></div>
          
          {/* Title */}
          <span className="font-serif text-xl md:text-3xl text-theme-light-primary dark:text-theme-dark-primary
            px-4 py-1 md:px-6 md:py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
            border border-theme-light-primary/20 dark:border-theme-dark-primary/20
            group-hover:bg-white/80 dark:group-hover:bg-gray-800/80
            transition-all duration-300">
            {title}
          </span>
          
          {/* Right decorative element */}
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-theme-light-primary/30 dark:via-theme-dark-primary/30 to-transparent"></div>
          
          {/* Chevron */}
          <div className="text-theme-light-primary dark:text-theme-dark-primary">
            {isOpen ? (
              <ChevronUp className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <ChevronDown className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </div>
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {typeof children === 'function' ? children(isOpen) : children}
      </div>
    </div>
  );
};

export default Collapsible;
