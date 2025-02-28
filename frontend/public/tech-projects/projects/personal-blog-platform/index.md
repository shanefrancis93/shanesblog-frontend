---
title: "Simulacra.Ink and Next.js"
status: "Live"
date: "2025-02-27"
tags: ["Next.js", "TypeScript", "React", "Markdown", "TailwindCSS"]
techStack: 
  - name: "Next.js"
    icon: "/tech-projects/assets/icons/nextjs.svg"
  - name: "React"
    icon: "/tech-projects/assets/icons/react.svg"
  - name: "TypeScript"
    icon: "/tech-projects/assets/icons/typescript.svg"
  - name: "TailwindCSS"
    icon: "/tech-projects/assets/icons/tailwind.svg"
highlights:
  - title: "Dynamic Content Loading"
    description: "Efficient markdown processing with gray-matter and marked for blog posts and project documentation"
  - title: "Project Showcase System"
    description: "Flexible project presentation system with dynamic routing and rich metadata support"
  - title: "API-Powered Content"
    description: "Server-side API routes for fetching and processing blog posts and projects metadata"
  - title: "Modern Responsive Design"
    description: "Elegant, mobile-optimized interface using TailwindCSS with smooth transitions and dark mode"
  - title: "AI-Generated Design"
    description: "All content, styling, and technical documentation generated and optimized using AI tools"
github: "https://github.com/shanefrancis93/blog-platform"
---

A modern, type-safe blog platform built with Next.js 14+ and TypeScript, featuring dynamic content loading, dark mode support, and API-driven content delivery. The platform serves as both a blog and a project showcase, with an elegant UI and strong focus on content organization and presentation.

## Architecture

### Content Management
The platform uses a file-based content management system with markdown files:
- Blog posts stored in the `/public` directory with frontmatter metadata
- Technical project documentation with rich metadata and image assets
- Automatic extraction of overviews from markdown content

### Next.js App Router
Leverages Next.js App Router for efficient page handling:
- Client-side rendered pages with data fetching through API routes
- Dynamic project showcase pages (`/tech-projects/[slug]`)
- API routes for delivering processed content
- Responsive layout system with mobile optimization

### Data Processing Pipeline
1. Content Processing
   - Uses `gray-matter` for frontmatter parsing
   - `marked` for markdown-to-HTML conversion
   - Automatic metadata extraction

2. Content Organization
   - API-based content delivery
   - Tag-based categorization
   - Project metadata extraction with rich display options

## Key Features

### Project Showcase System
- Card-based project gallery with hover effects
- Status indicators (Live/Completed/In Development)
- Tech stack visualization with icons
- Automatic overview extraction
- GitHub integration
- Responsive image galleries

### Blog System
- Clean, readable typography
- Code syntax highlighting
- Metadata display
- Mobile-optimized reading experience
- Rich content embedding

### Modern UI/UX
- Responsive design with mobile-first approach
- Dark/light mode theming with smooth transitions
- Gradient backgrounds and subtle animations
- Component-based UI architecture
- Accessibility-focused design

## Technical Implementation

### Content Processing
```typescript
interface ProjectData {
  title: string;
  status: string;
  date: string;
  tags: string[];
  techStack: Array<{ name: string; icon: string; }>;
  highlights: Array<{ title: string; description: string; }>;
  demo?: { type: string; url: string; };
  github?: string;
  content: string;
  assets: string[];
}

// Project data processing via API route
export async function GET() {
  try {
    const projectDirs = await fs.readdir(PROJECTS_DIR);
    
    const projects = await Promise.all(
      projectDirs.map(async (dirName) => {
        const indexPath = path.join(PROJECTS_DIR, dirName, 'index.md');
        
        // Read and parse the markdown file
        const fileContent = await fs.readFile(indexPath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        // Get the first section of content as overview
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
        
        return {
          ...data,
          overview: overview.trim(),
          slug: dirName,
        };
      })
    );

    return NextResponse.json(projects.filter(p => p !== null));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load projects' },
      { status: 500 }
    );
  }
}
```

## Future Enhancements

1. Content Features
   - Enhanced markdown extensions
   - Interactive code blocks
   - Automated table of contents
   - Image galleries

2. Developer Experience
   - Content validation
   - Preview system
   - Automated deployment
   - Analytics integration

3. User Experience
   - Search functionality
   - Related content suggestions
   - Newsletter integration
   - Social sharing
