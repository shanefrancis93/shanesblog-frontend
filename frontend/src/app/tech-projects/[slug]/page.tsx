'use client';

import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import { Card } from '../../../components/ui/card';
import matter from 'gray-matter';

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
  tags: string[];
  techStack: { name: string; icon: string; }[];
  highlights: { title: string; description: string; }[];
  demo?: {
    type: string;
    url: string;
  };
  github?: string;
  content: string;
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        // In production, this would be pre-rendered
        const response = await fetch(`/api/tech-projects/${params.slug}`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [params.slug]);

  if (loading) {
    return <Layout>Loading...</Layout>;
  }

  if (!project) {
    return <Layout>Project not found</Layout>;
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {project.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(project.status)}`}>
              {project.status}
            </span>
            
            {project.github && (
              <a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on GitHub
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {project.demo && (
          <section className="mb-8">
            {project.demo.type === 'video' && (
              <video 
                className="w-full rounded-lg shadow-lg"
                controls
                src={project.demo.url}
              />
            )}
            {project.demo.type === 'image' && (
              <img
                className="w-full rounded-lg shadow-lg"
                src={project.demo.url}
                alt={`${project.title} demo`}
              />
            )}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Overview
            </h2>
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ 
                __html: project.content.replace(
                  /<img([^>]*?)src="([^"]*?\.svg)"([^>]*?)>/g,
                  (match, before, src, after) => `
                    <object
                      type="image/svg+xml"
                      data="${src}"
                      className="w-full h-auto"
                      ${before} ${after}
                    >
                      <img src="${src}" ${before} ${after} />
                    </object>
                  `
                )
              }}
            />
          </Card>

          <aside>
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map(tech => (
                  <div 
                    key={tech.name} 
                    className="flex items-center gap-2 px-3 py-2 rounded bg-blue-50 dark:bg-blue-900/30"
                  >
                    {tech.icon && (
                      <img 
                        src={tech.icon} 
                        alt={tech.name}
                        className="w-5 h-5"
                      />
                    )}
                    <span className="text-blue-900 dark:text-blue-100">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Key Highlights
              </h2>
              <div className="space-y-4">
                {project.highlights.map(highlight => (
                  <div key={highlight.title}>
                    <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-100">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </article>
    </Layout>
  );
}
