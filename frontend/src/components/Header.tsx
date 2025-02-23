import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const navigationItems = [
  { name: 'Blog', mobileName: 'Blog', path: '/blog' },
  { name: 'Tech Projects', mobileName: 'Tech', path: '/tech-projects' },
  { name: 'Creative Projects', mobileName: 'Creative', path: '/creative-writing' },
  { name: 'About', mobileName: 'About', path: '/about' }
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/20 dark:border-transparent 
      bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 flex flex-col items-center max-w-6xl">
        {/* Title */}
        <Link 
          href="/" 
          className="text-2xl md:text-4xl font-serif text-theme-light-primary dark:text-theme-dark-primary 
            hover:text-theme-light-text dark:hover:text-theme-dark-text transition-colors
            py-3 md:py-6 text-center"
        >
          <span className="md:hidden">
            The Writing Desk of<br />
            Shane Farrow
          </span>
          <span className="hidden md:inline">
            The Writing Desk of Shane Farrow
          </span>
        </Link>
        
        {/* Navigation */}
        <nav className="py-2 md:py-4 w-full overflow-x-auto">
          <div className="flex items-center justify-center flex-nowrap gap-3 md:gap-6">
            {navigationItems.map((item, index, array) => (
              <span key={item.name} className="flex items-center whitespace-nowrap">
                <Link 
                  href={item.path}
                  className="font-serif text-base md:text-3xl text-theme-light-text dark:text-theme-dark-text 
                    hover:text-theme-light-primary dark:hover:text-theme-dark-primary 
                    transition-colors"
                >
                  <span className="md:hidden">{item.mobileName}</span>
                  <span className="hidden md:inline">{item.name}</span>
                </Link>

                {index < array.length - 1 && (
                  <span className="ml-3 md:ml-8 text-xs md:text-2xl text-theme-light-secondary dark:text-theme-dark-secondary">
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
