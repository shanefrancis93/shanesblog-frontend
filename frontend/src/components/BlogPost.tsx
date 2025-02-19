'use client';

import { useState } from 'react';
import { marked } from 'marked';
import CollapsibleSection from './CollapsibleSection';
import { BlogPost as BlogPostType, BlogSection } from '../app/api/blog/route';
import { AIBadge } from './ui/ai-badge';
import { Card } from './ui/card';

interface BlogPostProps {
  post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Ensure sections have content
  const validSections = post.sections?.filter(section => 
    section && section.title && section.content
  ) || [];

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-6">
        <article className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-serif mb-4 text-theme-light-text dark:text-theme-dark-text">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm mb-6">
              <time className="text-theme-light-primary dark:text-theme-dark-primary">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="text-theme-light-secondary dark:text-theme-dark-secondary">
                {post.readingTime}
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full
                      bg-gray-100 dark:bg-gray-800
                      text-theme-light-secondary dark:text-theme-dark-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* AI Badge */}
            {post.aiMetadata && (
              <div className="mb-6">
                <AIBadge metadata={post.aiMetadata} />
              </div>
            )}

            {/* Excerpt */}
            <p className="text-xl text-theme-light-secondary dark:text-theme-dark-secondary">
              {post.excerpt}
            </p>
          </header>

          {/* Main Content */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
          </div>

          {/* Sections */}
          {validSections.length > 0 && (
            <div className="space-y-6">
              {validSections.map((section) => (
                <CollapsibleSection
                  key={section.id}
                  section={section}
                  defaultExpanded={expandedSections.has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                />
              ))}
            </div>
          )}
        </article>
      </div>
    </Card>
  );
}
