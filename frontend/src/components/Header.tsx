import Link from 'next/link';

const Header = () => {
  return (
    <header className="border-b border-gray-200/20 dark:border-transparent 
      bg-cream/0 dark:bg-black/0 backdrop-blur-sm">
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
        <nav className="py-4">
          <div className="flex items-center">
            {['Home', 'Creative Writing', 'About'].map((item, index, array) => (
              <span key={item} className="flex items-center">
                <Link 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="font-serif text-xl text-theme-light-text dark:text-theme-dark-text 
                    hover:text-theme-light-primary dark:hover:text-theme-dark-primary 
                    transition-colors"
                >
                  {item}
                </Link>
                {index < array.length - 1 && (
                  <span className="mx-6 text-xl text-theme-light-secondary dark:text-theme-dark-secondary">
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
