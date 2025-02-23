import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { processBackendPost } from '../../../lib/blog-processor';

export interface BlogSection {
  id: string;
  title: string;
  content: string;
  level?: number;
}

export interface AIMetadata {
  models: string[];
  contributions: {
    model: string;
    role: string;
    section?: string;
  }[];
  generatedAt?: string;
  temperature?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readingTime: string;
  slug: string;
  sections: BlogSection[];
  aiMetadata?: AIMetadata;
  published?: boolean;
  draft?: boolean;
}

// Blog directories
const BLOG_DIR = path.join(process.cwd(), 'public', 'blog', 'posts');
const BACKEND_DIR = path.join(process.cwd(), '..', 'backend', 'blog_generator', 'processed_text');

// Specific backend files to include
const BACKEND_FILES = [
  'ai_ethics_test_latest.md'
];

async function getFrontendPosts(): Promise<BlogPost[]> {
  try {
    const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
    const posts: BlogPost[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      try {
        const postPath = path.join(BLOG_DIR, entry.name);
        const indexPath = path.join(postPath, 'index.md');
        const content = await fs.readFile(indexPath, 'utf-8');
        const { data, content: markdownContent } = matter(content);
        
        let excerpt = data.excerpt;
        if (!excerpt) {
          const firstParagraph = markdownContent.split('\n\n')[0];
          excerpt = firstParagraph.replace(/[#*`]/g, '').trim();
        }

        posts.push({
          id: entry.name,
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          excerpt: excerpt,
          content: markdownContent,
          readingTime: `${Math.ceil(markdownContent.split(/\s+/).length / 200)} min read`,
          slug: entry.name,
          sections: []
        });
      } catch (error) {
        console.error(`Error processing frontend post ${entry.name}:`, error);
      }
    }

    return posts;
  } catch (error) {
    console.error('Error reading frontend posts directory:', error);
    return [];
  }
}

async function getBackendPosts(): Promise<BlogPost[]> {
  try {
    const posts: BlogPost[] = [];

    for (const filename of BACKEND_FILES) {
      try {
        const filePath = path.join(BACKEND_DIR, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const post = processBackendPost(content, filename);
        posts.push(post);
      } catch (error) {
        console.error(`Error processing backend post ${filename}:`, error);
      }
    }

    return posts;
  } catch (error) {
    console.error('Error reading backend posts:', error);
    return [];
  }
}

export async function GET() {
  try {
    const [frontendPosts, backendPosts] = await Promise.all([
      getFrontendPosts(),
      getBackendPosts()
    ]);

    const allPosts = [...frontendPosts, ...backendPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
