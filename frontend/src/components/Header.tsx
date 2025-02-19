import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Tech Projects', path: '/tech-projects' },
  { name: 'Creative Writing', path: '/creative-writing' },
  { name: 'About', path: '/about' }
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/20 dark:border-transparent 
      bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 flex flex-col items-center max-w-6xl">
        {/* Title */}
        <Link 
          href="/" 
          className="text-4xl font-serif text-theme-light-primary dark:text-theme-dark-primary 
            hover:text-theme-light-text dark:hover:text-theme-dark-text transition-colors
            py-6"
        >
          The Writing Desk of Shane Farrow
        </Link>
        
        {/* Navigation */}
        <nav className="py-4 w-full">
          <div className="flex items-center justify-center flex-wrap gap-6">
            {navigationItems.map((item, index, array) => (
              <span key={item.name} className="flex items-center">
                <Link 
                  href={item.path}
                  className="font-serif text-xl text-theme-light-text dark:text-theme-dark-text 
                    hover:text-theme-light-primary dark:hover:text-theme-dark-primary 
                    transition-colors"
                >
                  {item.name}
                </Link>
                {index < array.length - 1 && (
                  <span className="ml-6 text-xl text-theme-light-secondary dark:text-theme-dark-secondary">
                    ◆
                  </span>
                )}
              </span>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
