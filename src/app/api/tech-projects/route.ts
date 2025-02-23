import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

interface ProjectData {
  title: string;
  status: string;
  date: string;
  tags: string[];
  techStack: Array<{ name: string; icon: string; }>;
  highlights: Array<{ title: string; description: string; }>;
  demo?: { type: string; url: string; };
  github?: string;
  description: string;
  overview: string;
  slug: string;
}

const PROJECTS_DIR = path.join(process.cwd(), 'public', 'tech-projects', 'projects');

export async function GET() {
  try {
    // Read all project directories
    const projectDirs = await fs.readdir(PROJECTS_DIR);
    
    // Process each project directory
    const projects = await Promise.all(
      projectDirs.map(async (dirName) => {
        const indexPath = path.join(PROJECTS_DIR, dirName, 'index.md');
        
        try {
          // Read and parse the markdown file
          const fileContent = await fs.readFile(indexPath, 'utf-8');
          const { data, content } = matter(fileContent);
          
          // Get the first section of content as overview (up to first h2)
          const tokens = marked.lexer(content);
          let overview = '';
          for (const token of tokens) {
            if (token.type === 'heading' && token.depth === 2) {
              break;
            }
            if (token.type === 'paragraph') {
              overview += token.text + ' ';
            }
          }
          
          // Ensure the data matches our ProjectData interface
          const project: ProjectData = {
            title: data.title,
            status: data.status,
            date: data.date || new Date().toISOString().split('T')[0],
            tags: data.tags || [],
            techStack: data.techStack || [],
            highlights: data.highlights || [],
            demo: data.demo,
            github: data.github,
            description: data.description || '',
            overview: overview.trim(),
            slug: dirName,
          };

          return project;
        } catch (error) {
          console.error(`Error processing ${dirName}:`, error);
          return null;
        }
      })
    );

    // Filter out any null results from failed processing
    const validProjects = projects.filter((p): p is NonNullable<typeof p> => p !== null);

    // Sort projects by date if available, or title as fallback
    validProjects.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return NextResponse.json(validProjects);
  } catch (error) {
    console.error('Error in tech-projects API route:', error);
    return NextResponse.json(
      { error: 'Failed to load projects' },
      { status: 500 }
    );
  }
}
