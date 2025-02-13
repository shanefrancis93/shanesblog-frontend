import { format } from 'date-fns';
import Link from 'next/link';

interface BlogPostProps {
  title: string;
  date: string;
  content: string;
  readingTime?: string;
  tags?: string[];
}

const BlogPost = ({ title, date, content, readingTime, tags }: BlogPostProps) => {
  return (
    <article className="prose prose-lg dark:prose-invert mx-auto">
      {/* Back link */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Header section */}
      <header className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
        <h1 className="text-4xl font-bold mb-4">
          {title}
        </h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <time>{format(new Date(date), 'MMMM d, yyyy')}</time>
          {readingTime && (
            <>
              <span className="mx-2">•</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>
        {tags && (
          <div className="flex gap-2 mt-4">
            {tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* Footer section */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Share this post
          </div>
          <div className="flex gap-4">
            {/* Add social share buttons here */}
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogPost;
