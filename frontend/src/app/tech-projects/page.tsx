'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowUpRight, Github } from 'lucide-react';

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Completed":
    case "Live":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "In Development":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
  }
};

interface ProjectData {
  title: string;
  status: string;
  date: string;
  tags: string[];
  techStack: { name: string; icon: string; }[];
  highlights: { title: string; description: string; }[];
  demo?: {
    type: string;
    url: string;
  };
  github?: string;
  description: string;
  overview: string;
  slug: string;
}

export default function TechProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/api/tech-projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Technical Projects</h1>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 h-64" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Technical Projects</h1>
          <Card className="p-4 text-red-500">
            <p>Error loading projects: {error}</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="max-w-4xl mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Technical Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A collection of my technical projects exploring AI, web development, and creative computing.
          </p>
        </header>

        <div className="grid gap-8">
          {projects.map((project, index) => (
            <Card
              className={`relative overflow-hidden
                backdrop-blur-sm
                bg-white/80 dark:bg-[#112240]/80
                hover:bg-white/90 dark:hover:bg-[#1a365d]/90
                transition-all duration-300
                ${hoveredIndex === index ? 'shadow-2xl' : 'shadow-lg'}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column - Project Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {project.title}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                      {project.overview || project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={`/tech-projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Details <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                          <Github className="w-4 h-4" /> GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Tech Stack & Highlights */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => (
                          <div
                            key={tech.name}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30"
                          >
                            {tech.icon && (
                              <img
                                src={tech.icon}
                                alt={tech.name}
                                className="w-4 h-4"
                              />
                            )}
                            <span className="text-sm text-blue-900 dark:text-blue-100">
                              {tech.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {project.highlights && project.highlights.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                          Key Highlights
                        </h3>
                        <ul className="space-y-2">
                          {project.highlights.slice(0, 3).map(highlight => (
                            <li
                              key={highlight.title}
                              className="text-sm text-gray-600 dark:text-gray-300"
                            >
                              • {highlight.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
