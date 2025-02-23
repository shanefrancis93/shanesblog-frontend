---
title: "Modern Blog Platform with Next.js"
status: "Live"
date: "2025-02-15"
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
  - title: "Poetry Analysis Integration"
    description: "Seamless integration with Poetry Analysis LLM system for enhanced content creation"
  - title: "Modern Design"
    description: "Responsive, dark-mode enabled interface using TailwindCSS with smooth transitions"
github: "https://github.com/shanefrancis93/blog-platform"
---

A modern, type-safe blog platform built with Next.js 13+ and TypeScript, featuring dynamic content loading, dark mode support, and seamless integration with AI tools. The platform serves as both a blog and a project showcase, with a focus on developer experience and content management.

## Architecture

### Content Management
The platform uses a file-based content management system with markdown files, enabling:
- Blog posts organized by date and category
- Technical project documentation with rich metadata
- Dynamic asset management for images and resources

### Dynamic Routing
Leverages Next.js App Router for efficient page handling:
- Dynamic routes for blog posts (`/blog/[year]/[month]/[slug]`)
- Project showcase pages (`/tech-projects/[slug]`)
- API routes for dynamic content loading

### Data Processing Pipeline
1. Markdown Processing
   - Uses `gray-matter` for frontmatter parsing
   - `marked` for markdown-to-HTML conversion
   - Custom parsers for code blocks and metadata

2. Content Organization
   - Date-based blog post organization
   - Tag-based categorization
   - Project metadata extraction

## Key Features

### Project Showcase System
- Rich project cards with metadata
- Status tracking (Live/Completed/In Development)
- Tech stack visualization
- Automated overview extraction
- GitHub integration

### Blog System
- Date-based organization
- Category and tag support
- Code syntax highlighting
- Image optimization
- Reading time estimation

### Modern UI/UX
- Responsive design
- Dark/light mode theming
- Smooth transitions
- Accessibility features
- SEO optimization

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
  description: string;
  overview: string;
  slug: string;
}

// Example project data processing
const processProjectContent = async (dirName: string) => {
  const indexPath = path.join(PROJECTS_DIR, dirName, 'index.md');
  const fileContent = await fs.readFile(indexPath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  // Extract overview from content
  const tokens = marked.lexer(content);
  let overview = '';
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 2) break;
    if (token.type === 'paragraph') overview += token.text + ' ';
  }
  
  return {
    ...data,
    overview: overview.trim(),
    slug: dirName,
  };
};
```

### Dynamic Routing
```typescript
// [slug]/page.tsx
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  
  useEffect(() => {
    async function loadProject() {
      const response = await fetch(`/api/tech-projects/${params.slug}`);
      const data = await response.json();
      setProject(data);
    }
    loadProject();
  }, [params.slug]);
  
  // Render project content
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
