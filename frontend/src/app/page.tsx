'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const posts = [
    {
      id: '1',
      title: "Reviewing OpenAI's Deep Research on Health Policy Research",
      date: "February 15, 2024",
      tags: ["AI", "Healthcare", "Policy", "Research"],
      excerpt: "OpenAI researchers have demonstrated significant advances in applying large language models to health policy research...",
      readingTime: "6 min read",
      slug: "deep-research-review"
    },
    {
      id: '2',
      title: 'Building Robust Systems',
      excerpt: 'Understanding how to create reliable and scalable systems...',
      date: 'February 2, 2024',
      slug: 'building-robust-systems',
      tags: ['Systems', 'Architecture'],
      readingTime: "4 min read"
    }
  ];

  return (
    <Layout>
      <div className="relative">
        {/* Remove or comment out this div */}
        {/* <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center 
          [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" 
        /> */}
        
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
          
          {/* Posts */}
          <div className="space-y-8">
            {posts.map((post, index) => (
              <Card 
                key={post.id}
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
                {/* Decorative elements with lower hover opacity */}
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
                    
                    <p className="text-theme-light-text/90 dark:text-theme-dark-text/90 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
} 