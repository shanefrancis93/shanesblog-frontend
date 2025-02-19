import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { processBackendPost } from '../../../../lib/blog-processor';

// Blog directories
const BLOG_DIR = path.join(process.cwd(), 'public', 'blog', 'posts');
const BACKEND_DIR = path.join(process.cwd(), '..', 'backend', 'blog_generator', 'processed_text');

// Specific backend files to try
const BACKEND_FILES = [
  'ai_ethics_test_latest.md'
];

async function findPostBySlug(slug: string) {
  // First try frontend posts
  try {
    const frontendPath = path.join(BLOG_DIR, slug, 'index.md');
    const content = await fs.readFile(frontendPath, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    return {
      ...data,
      content: marked(markdownContent),
      slug
    };
  } catch (error) {
    // If not found in frontend, try backend posts
    try {
      for (const filename of BACKEND_FILES) {
        const filePath = path.join(BACKEND_DIR, filename);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const post = processBackendPost(content, filename);
          
          if (post.slug === slug) {
            return {
              ...post,
              content: marked(post.content)
            };
          }
        } catch (error) {
          console.error(`Error processing backend file ${filename}:`, error);
        }
      }
    } catch (error) {
      console.error('Error searching backend posts:', error);
    }
  }
  
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await findPostBySlug(params.slug);
    
    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error getting blog post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
