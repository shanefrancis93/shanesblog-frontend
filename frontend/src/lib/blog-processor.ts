import matter from 'gray-matter';
import { BlogPost } from '../app/api/blog/route';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export interface PublishingMetadata {
  published: boolean;
  publishedAt?: string;
  featured?: boolean;
  draft?: boolean;
}

export function processBackendPost(content: string, filename: string): BlogPost & PublishingMetadata {
  const { data, content: markdownContent } = matter(content);
  
  // Generate a slug from the title or filename
  const title = data.title || filename.replace(/\.md$/, '').replace(/_/g, ' ');
  const slug = generateSlug(title);

  // Extract first paragraph for excerpt if not provided
  let excerpt = data.excerpt;
  if (!excerpt) {
    const firstParagraph = markdownContent.split('\n\n')[0];
    excerpt = firstParagraph.replace(/[#*`]/g, '').trim();
  }

  // Process sections if they exist
  const sections = data.sections || extractSections(markdownContent);

  // Process AI metadata
  const aiMetadata = data.aiMetadata || {
    models: data.models || [],
    contributions: data.contributions || []
  };

  // Ensure date is properly formatted
  let date = data.date;
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate.toISOString();
    } else {
      date = new Date().toISOString();
    }
  } else if (!date) {
    date = new Date().toISOString();
  }

  // Process publishing metadata
  const publishingMetadata: PublishingMetadata = {
    published: data.published ?? false, // Default to unpublished
    publishedAt: data.publishedAt || (data.published ? date : undefined),
    featured: data.featured ?? false,
    draft: data.draft ?? !data.published // If not explicitly published, mark as draft
  };

  return {
    id: `backend-${slug}`,
    title: title,
    date: date,
    tags: data.tags || [],
    excerpt: excerpt,
    content: markdownContent,
    readingTime: `${Math.ceil(markdownContent.split(/\s+/).length / 200)} min read`,
    slug: slug,
    sections: sections,
    aiMetadata: aiMetadata,
    ...publishingMetadata
  };
}

function extractSections(content: string) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let sectionContent = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{2,3})\s+(.+)$/);
    
    if (headerMatch) {
      if (currentSection) {
        currentSection.content = sectionContent.join('\n').trim();
        sections.push(currentSection);
        sectionContent = [];
      }

      currentSection = {
        id: generateSlug(headerMatch[2]),
        title: headerMatch[2],
        level: headerMatch[1].length,
        content: ''
      };
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = sectionContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}
