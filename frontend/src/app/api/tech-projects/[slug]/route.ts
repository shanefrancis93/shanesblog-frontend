import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const projectPath = path.join(
      process.cwd(),
      'public/tech-projects/projects',
      params.slug,
      'index.md'
    );

    if (!fs.existsSync(projectPath)) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const fileContent = fs.readFileSync(projectPath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Convert markdown content to HTML
    const htmlContent = marked(content);

    // Check for project assets
    const projectDir = path.dirname(projectPath);
    const hasImages = fs.existsSync(path.join(projectDir, 'images'));
    const assets = hasImages ? fs.readdirSync(path.join(projectDir, 'images')) : [];

    return NextResponse.json({
      ...data,
      content: htmlContent,
      assets: assets.map(asset => `/tech-projects/projects/${params.slug}/images/${asset}`)
    });
  } catch (error) {
    console.error('Error loading project:', error);
    return new NextResponse('Error loading project', { status: 500 });
  }
}
