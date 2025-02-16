'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Card, CardContent } from '../../components/ui/card';

export default function TechProjects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const projects = [
    {
      id: '1',
      title: "Sherlock Market Definition Assistant",
      status: "In Development",
      tags: ["RAG", "LLM", "Healthcare", "Classification"],
      description: "An AI-powered system to help classify healthcare products into Sherlock administrative expense market categories using RAG and LLMs. Features intelligent market classification suggestions based on product descriptions.",
      techStack: ["Python", "FastAPI", "Next.js", "Google Gemini", "Pinecone", "PyPDF2"],
      highlights: [
        "PDF processing and structured data extraction",
        "Vector database for efficient retrieval",
        "Multi-market classification handling"
      ],
      slug: "sherlock-markets-rag"
    },
    {
      id: '2',
      title: "Poetry Analysis with LLMs",
      status: "In Development",
      tags: ["AI", "Poetry", "NLP", "Python"],
      description: "A sophisticated poetry analysis system leveraging multiple LLMs (Claude, GPT-4, Gemini) to provide deep literary insights. Features automated analysis of poetic devices, emotional impact, and interpretation.",
      techStack: ["Python", "Next.js", "React", "OpenAI API", "Anthropic API", "Google AI API"],
      highlights: [
        "Multi-model analysis for comprehensive insights",
        "Automated frontmatter management",
        "Beautiful web interface for displaying analyses"
      ],
      slug: "poetry-llm"
    },
    {
      id: '3',
      title: 'Research Blog Platform',
      status: "Live",
      description: 'A modern, responsive blog platform built with Next.js and React, featuring dark mode, dynamic content loading, and seamless markdown integration.',
      techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      highlights: [
        "Dark/light mode theming",
        "Responsive design",
        "Markdown content management"
      ],
      tags: ['Web Development', 'React', 'Blog'],
      slug: 'research-blog'
    }
  ];

  return (
    <Layout>
      <div className="relative">
        <main className="relative container mx-auto px-4 pt-2">
          {/* Introduction */}
          <div className="max-w-5xl mb-12 font-serif">
            <h1 className="text-4xl font-bold mb-8 
              text-theme-light-primary dark:text-theme-dark-primary">
              Technical Projects
            </h1>
            <p className="text-2xl leading-relaxed mb-8 
              text-theme-light-primary dark:text-theme-dark-primary">
              A showcase of my technical projects, where I explore the intersection of AI, web development, and creative computing.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {projects.map((project, index) => (
              <Link 
                key={project.id} 
                href={`/tech-projects/${project.slug}`}
                className="block transition-transform duration-300 ease-in-out hover:scale-[1.02]"
              >
                <Card
                  className={`relative overflow-hidden
                    bg-theme-light-card dark:bg-theme-dark-card
                    border-theme-light-border dark:border-theme-dark-border`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold mb-2 
                        text-theme-light-primary dark:text-theme-dark-primary">
                        {project.title}
                      </h2>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-sm rounded-full
                          ${project.status === "Live" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-sm rounded-full
                              bg-theme-light-tag dark:bg-theme-dark-tag
                              text-theme-light-text dark:text-theme-dark-text"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-lg mb-4 
                      text-theme-light-text dark:text-theme-dark-text">
                      {project.description}
                    </p>

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2
                        text-theme-light-primary dark:text-theme-dark-primary">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-sm rounded
                              bg-accentPurple dark:bg-accentPurple
                              text-white dark:text-white"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2
                        text-theme-light-primary dark:text-theme-dark-primary">
                        Key Highlights
                      </h3>
                      <ul className="list-disc list-inside
                        text-theme-light-text dark:text-theme-dark-text">
                        {project.highlights.map((highlight, i) => (
                          <li key={i} className="mb-1">{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
