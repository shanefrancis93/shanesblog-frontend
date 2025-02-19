'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Card, CardContent } from '../../components/ui/card';
import { AIBadge } from '../../components/ui/ai-badge';
import type { BlogPost } from '../api/blog/route';

function truncateExcerpt(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const res = await fetch('/api/blog');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  // Get unique tags from all posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  // Sort posts by date in descending order
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // Log dates for debugging
    console.log(`Post ${a.title}: ${a.date} -> ${dateA.toISOString()}`);
    console.log(`Post ${b.title}: ${b.date} -> ${dateB.toISOString()}`);
    
    return dateB.getTime() - dateA.getTime();
  });

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500 dark:text-red-400">
            Error: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-serif mb-8 
          text-theme-light-primary dark:text-theme-dark-primary">
          Blog
        </h1>

        {/* Tags Filter */}
        {posts.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${!selectedTag 
                  ? 'bg-theme-light-primary dark:bg-theme-dark-primary text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-gray-800 text-theme-light-text dark:text-theme-dark-text hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedTag === tag
                    ? 'bg-theme-light-primary dark:bg-theme-dark-primary text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-gray-800 text-theme-light-text dark:text-theme-dark-text hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-theme-light-secondary dark:text-theme-dark-secondary">
              No blog posts found.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <Card 
                  className={`
                    group relative overflow-hidden border-0
                    backdrop-blur-sm h-[300px]
                    bg-white/80 dark:bg-[#112240]
                    hover:bg-white dark:hover:bg-[#1a365d]
                    transition-all duration-300
                    ${hoveredPost === post.id ? 'shadow-2xl' : 'shadow-lg'}
                  `}
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  {/* Decorative elements */}
                  <div className="absolute -right-32 -top-32 w-96 h-96 
                    bg-[#3d2952]/10 dark:bg-purple-400/10 rounded-full blur-3xl 
                    group-hover:bg-[#3d2952]/20 dark:group-hover:bg-purple-500/20 
                    transition-all duration-700" 
                  />
                  <div className="absolute -left-32 -bottom-32 w-96 h-96 
                    bg-[#2c4027]/10 dark:bg-green-400/10 rounded-full blur-3xl 
                    group-hover:bg-[#2c4027]/20 dark:group-hover:bg-green-500/20 
                    transition-all duration-700" 
                  />
                  
                  <CardContent className="relative p-6 md:p-8 h-full flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <time className="text-theme-light-primary dark:text-theme-dark-primary font-medium">
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

                      <h2 className="text-2xl font-semibold mb-3 text-theme-light-text dark:text-theme-dark-text">
                        {post.title}
                      </h2>

                      <p className="text-theme-light-secondary dark:text-theme-dark-secondary line-clamp-3">
                        {truncateExcerpt(post.excerpt)}
                      </p>
                    </div>

                    <div className="mt-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span
                            key={`${post.id}-${tag}`}
                            className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* AI Badge */}
                      {post.aiMetadata && (
                        <div>
                          <AIBadge metadata={post.aiMetadata} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
