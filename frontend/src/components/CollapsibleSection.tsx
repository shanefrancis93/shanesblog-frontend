import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, children, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-theme-light-secondary/20 dark:border-theme-dark-secondary/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 
          text-theme-light-primary dark:text-theme-dark-primary 
          hover:text-theme-light-text dark:hover:text-theme-dark-text 
          transition-colors duration-300"
      >
        <h2 className="text-xl font-serif">{title}</h2>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 
        ${isOpen ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection; 