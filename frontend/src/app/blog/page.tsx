'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Card, CardContent } from '../../components/ui/card';
import type { BlogPost } from '../api/blog/route';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
            {filteredPosts.map((post, index) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <Card 
                  className={`
                    group relative overflow-hidden border-0
                    backdrop-blur-sm
                    bg-white/80 dark:bg-[#112240]
                    hover:bg-white dark:hover:bg-[#1a365d]
                    transition-all duration-300
                    ${hoveredIndex === index ? 'shadow-2xl' : 'shadow-lg'}
                  `}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
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
                  
                  <CardContent className="relative p-6 md:p-8">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-theme-light-primary dark:text-theme-dark-primary font-medium">
                          {post.date}
                        </span>
                        <span className="text-theme-light-secondary dark:text-theme-dark-secondary">
                          {post.readingTime}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-serif 
                        text-theme-light-text dark:text-theme-dark-text
                        group-hover:text-theme-light-primary dark:group-hover:text-theme-dark-primary 
                        transition-colors duration-300">
                        {post.title}
                      </h2>
                      
                      <p className="text-theme-light-text/80 dark:text-theme-dark-text/80">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
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
