'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';

// Actual blog posts
const blogPosts = [
  {
    id: '1',
    title: "AI Ethics and Cultural Impact: A Deep Dive",
    date: "February 18, 2025",
    tags: ["AI Ethics", "Cultural Impact", "Technology", "Society"],
    excerpt: "An exploration of how artificial intelligence is reshaping our cultural landscape and the ethical considerations we must address...",
    readingTime: "8 min read",
    slug: "ai-ethics-cultural-impact"
  }
];

// Actual tech projects
const techProjects = [
  {
    id: '1',
    title: 'Modern Blog Platform with Next.js',
    description: 'A modern, performant blog platform built with Next.js 14, TypeScript, and Tailwind CSS. Features AI-assisted content generation and management.',
    status: 'In Progress',
    lastUpdated: 'February 19, 2025',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'AI'],
    slug: 'modern-blog-platform'
  },
  {
    id: '2',
    title: 'Sherlock Market Definition Assistant',
    description: 'AI-powered tool for market research and competitive analysis, helping define market boundaries and identify opportunities.',
    status: 'Active',
    lastUpdated: 'February 15, 2025',
    tags: ['AI', 'Market Research', 'Python'],
    slug: 'sherlock-market-assistant'
  },
  {
    id: '3',
    title: 'Poetry Analysis with LLMs',
    description: 'Leveraging large language models to analyze poetry, exploring themes, style, and cultural context through AI lens.',
    status: 'In Development',
    lastUpdated: 'February 10, 2025',
    tags: ['LLM', 'Poetry', 'NLP', 'Python'],
    slug: 'poetry-llm-analysis'
  }
];

export default function Home() {
  const [hoveredBlogIndex, setHoveredBlogIndex] = useState<number | null>(null);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);

  return (
    <Layout>
      <div className="relative">
        <main className="relative container mx-auto px-4 pt-2">
          {/* Introduction */}
          <div className="max-w-5xl mb-12 font-serif">
            <p className="text-2xl leading-relaxed mb-8 
              text-theme-light-primary dark:text-theme-dark-primary">
              This website is a collection of my research and writings, intended as a journal and as a lantern to draw in kindred spirits.
            </p>
            <div className="prose prose-xl max-w-none 
              text-theme-light-text dark:text-theme-dark-text">
              <p className="mb-6 leading-relaxed text-xl">
                The ubiquity of large language models stoked in me a fire meant to heat a brand, for now our writings make for sigils to commune 
                with the esprit de corp of the written word.
              </p>
            </div>
            <p className="text-2xl leading-relaxed italic 
              text-theme-light-primary dark:text-theme-dark-primary">
              In writing my seance, I hope I invoke your curiosity.
            </p>
          </div>

          {/* Content Feeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Blog Posts Feed */}
            <div>
              <h2 className="text-2xl font-serif mb-6 text-theme-light-primary dark:text-theme-dark-primary">
                Latest Writings
              </h2>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-4">
                  {blogPosts.map((post, index) => (
                    <Link href={`/blog/${post.slug}`} key={post.id}>
                      <Card 
                        className={`
                          group relative overflow-hidden
                          backdrop-blur-sm
                          bg-white/80 dark:bg-[#112240]
                          hover:bg-white dark:hover:bg-[#1a365d]
                          transition-all duration-300
                          ${hoveredBlogIndex === index ? 'shadow-2xl' : 'shadow-lg'}
                        `}
                        onMouseEnter={() => setHoveredBlogIndex(index)}
                        onMouseLeave={() => setHoveredBlogIndex(null)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-theme-light-primary dark:text-theme-dark-primary font-medium">
                                {post.date}
                              </span>
                              <span className="text-theme-light-secondary dark:text-theme-dark-secondary">
                                {post.readingTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-serif text-theme-light-text dark:text-theme-dark-text">
                              {post.title}
                            </h3>
                            <p className="text-theme-light-secondary dark:text-theme-dark-secondary line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="px-2 py-1 text-sm rounded-full
                                    bg-gray-100 dark:bg-gray-800
                                    text-theme-light-secondary dark:text-theme-dark-secondary"
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
              </ScrollArea>
            </div>

            {/* Tech Projects Feed */}
            <div>
              <h2 className="text-2xl font-serif mb-6 text-theme-light-primary dark:text-theme-dark-primary">
                Tech Projects
              </h2>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-4">
                  {techProjects.map((project, index) => (
                    <Link href={`/tech-projects/${project.slug}`} key={project.id}>
                      <Card 
                        className={`
                          group relative overflow-hidden
                          backdrop-blur-sm
                          bg-white/80 dark:bg-[#112240]
                          hover:bg-white dark:hover:bg-[#1a365d]
                          transition-all duration-300
                          ${hoveredProjectIndex === index ? 'shadow-2xl' : 'shadow-lg'}
                        `}
                        onMouseEnter={() => setHoveredProjectIndex(index)}
                        onMouseLeave={() => setHoveredProjectIndex(null)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-theme-light-primary dark:text-theme-dark-primary font-medium">
                                Last Updated: {project.lastUpdated}
                              </span>
                              <span className={`
                                px-2 py-1 rounded-full text-xs
                                ${project.status === 'In Progress' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                                  : project.status === 'Active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                }
                              `}>
                                {project.status}
                              </span>
                            </div>
                            <h3 className="text-xl font-serif text-theme-light-text dark:text-theme-dark-text">
                              {project.title}
                            </h3>
                            <p className="text-theme-light-secondary dark:text-theme-dark-secondary line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="px-2 py-1 text-sm rounded-full
                                    bg-gray-100 dark:bg-gray-800
                                    text-theme-light-secondary dark:text-theme-dark-secondary"
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
              </ScrollArea>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}