import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { BlogPost } from '../route';

const BLOG_DIR = path.join(process.cwd(), 'public', 'blog', 'posts');

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const filePath = path.join(BLOG_DIR, params.slug, 'index.md');
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

    const post: BlogPost = {
      id: params.slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      excerpt: excerpt,
      content: parsedContent,
      readingTime: `${Math.ceil(content.split(/\s+/).length / 200)} min read`,
      slug: params.slug,
      sections: data.sections,
      quiz: data.quiz
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error reading blog post:', error);
    return new NextResponse('Blog post not found', { status: 404 });
  }
}
