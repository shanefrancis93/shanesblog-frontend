'use client';  // Add this for client-side components in Next.js 13+
import React from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;  // Add this for the URL
  readingTime?: string;
  tags?: string[];
}

interface BlogListProps {
  posts: BlogPost[];
}

const BlogList = ({ posts }: BlogListProps) => {
  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <article key={post.id} 
          className="border-b border-gray-200 dark:border-gray-800 pb-10 
            hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
        >
          <Link href={`/posts/${post.slug}`} className="block group p-4">
            <h2 className="text-2xl font-heading font-semibold mb-3 
              text-[#2c2c2c] dark:text-gray-200 
              group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {post.title}
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <time className="text-sm text-[#666666] dark:text-gray-400">
                {post.date}
              </time>
              <div className="flex gap-2">
                {post.tags?.map(tag => (
                  <span key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 
                      rounded-full text-xs font-medium 
                      text-[#555555] dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-[#444444] dark:text-gray-400 leading-relaxed mb-4
              font-body text-base">
              {post.excerpt}
            </p>
            
            <span className="inline-flex items-center text-blue-600 dark:text-blue-400 
              group-hover:underline font-medium">
              Read more 
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default BlogList;
