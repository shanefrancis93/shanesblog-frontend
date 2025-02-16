import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'public', 'blog', 'posts');

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readingTime: string;
  slug: string;
}

function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const dirs = await fs.readdir(BLOG_DIR);
    const posts = await Promise.all(
      dirs.map(async (dir) => {
        const filePath = path.join(BLOG_DIR, dir, 'index.md');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        // Parse markdown content
        const parsedContent = marked(content);
        
        // Extract first paragraph for excerpt if not provided in frontmatter
        let excerpt = data.excerpt;
        if (!excerpt) {
          const firstParagraph = content.split('\n\n')[0];
          excerpt = firstParagraph.replace(/[#*`]/g, '').trim();
        }

        return {
          id: dir,
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          excerpt: excerpt,
          content: parsedContent,
          readingTime: estimateReadingTime(content),
          slug: dir
        };
      })
    );

    // Sort posts by date in descending order
    return posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}
