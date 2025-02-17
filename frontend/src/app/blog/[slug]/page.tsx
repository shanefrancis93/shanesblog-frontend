'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';
import { AIBadge } from '../../../components/ui/ai-badge';
import type { BlogPost, BlogSection, QuizQuestion } from '../../api/blog/route';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [quizResponses, setQuizResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog/${params.slug}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error('Error loading post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) {
      loadPost();
    }
  }, [params.slug]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleQuizResponse = async (questionId: string, response: string) => {
    setQuizResponses(prev => ({
      ...prev,
      [questionId]: response
    }));

    try {
      await fetch('/api/blog/quiz-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: params.slug,
          questionId,
          response
        })
      });
    } catch (error) {
      console.error('Failed to submit quiz response:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500 dark:text-red-400">
            {error || 'Post not found'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 prose dark:prose-invert
        prose-headings:font-serif prose-a:text-theme-light-primary dark:prose-a:text-theme-dark-primary
        max-w-none md:max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-theme-light-secondary dark:text-theme-dark-secondary">
            <div className="flex items-center gap-4">
              <time>{post.date}</time>
              {post.aiMetadata && (
                <AIBadge metadata={post.aiMetadata} />
              )}
            </div>
            <span>{post.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 text-sm rounded-full
                  bg-gray-100 dark:bg-gray-800
                  text-theme-light-text dark:text-theme-dark-text"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        {post.sections ? (
          <div className="space-y-6">
            {post.sections.map((section: BlogSection) => (
              <Collapsible
                key={section.id}
                open={expandedSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between
                  bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900
                  text-left font-medium transition-colors">
                  <span>{section.title}</span>
                  <span className="text-2xl">
                    {expandedSections.includes(section.id) ? '−' : '+'}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4">
                  <div dangerouslySetInnerHTML={{ 
                    __html: post.content.split(`## ${section.title}`)[1]?.split('##')[0] || ''
                  }} />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}

        {/* Interactive Quiz */}
        {post.quiz && (
          <div className="mt-12 space-y-8">
            <h2>Interactive Elements</h2>
            {post.quiz.map((question: QuizQuestion) => (
              <div key={question.id} className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <h3 className="mb-4">{question.question}</h3>
                <div className="space-y-2">
                  {question.options.map((option: string) => (
                    <button
                      key={option}
                      onClick={() => handleQuizResponse(question.id, option)}
                      className={`w-full px-4 py-2 text-left rounded-lg transition-colors
                        ${quizResponses[question.id] === option
                          ? 'bg-theme-light-primary dark:bg-theme-dark-primary text-white'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </Layout>
  );
}
