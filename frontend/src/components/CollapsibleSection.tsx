'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { BlogSection } from '../app/api/blog/route';

interface Section {
  id: string;
  title: string;
  content: string;
  level?: number;
}

interface CollapsibleSectionProps {
  section?: Section;
  defaultExpanded?: boolean;
  className?: string;
  onToggle?: () => void;
}

export default function CollapsibleSection({ 
  section,
  defaultExpanded = false,
  className = '',
  onToggle
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!section) {
    return null;
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={handleToggle}
      className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between
        bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900
        text-left font-medium transition-colors">
        <span>{section.title}</span>
        <span className="text-2xl">
          {isExpanded ? '−' : '+'}
        </span>
      </CollapsibleTrigger>
      {isExpanded && (
        <CollapsibleContent className="px-6 py-4">
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content || '' }}
          />
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}