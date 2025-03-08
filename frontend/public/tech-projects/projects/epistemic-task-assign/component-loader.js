// JavaScript to dynamically load component descriptions from index.md
document.addEventListener('DOMContentLoaded', function() {
  // Create a container for component descriptions if it doesn't exist
  let componentContainer = document.getElementById('component-descriptions');
  if (!componentContainer) {
    componentContainer = document.createElement('div');
    componentContainer.id = 'component-descriptions';
    componentContainer.className = 'mt-8 component-descriptions';
    
    // Find where to insert the component container (after the diagram section)
    const mainContent = document.querySelector('main .max-w-5xl');
    if (mainContent) {
      mainContent.appendChild(componentContainer);
    }
  }
  
  // Function to fetch and parse markdown content
  async function fetchComponentDescriptions() {
    try {
      // Show loading indicator
      componentContainer.innerHTML = '<div class="text-center py-8"><p>Loading component descriptions...</p></div>';
      
      const response = await fetch('/tech-projects/projects/epistemic-task-assign/index.md');
      if (!response.ok) {
        throw new Error(`Failed to fetch index.md: ${response.status}`);
      }
      
      const markdownText = await response.text();
      
      // Remove frontmatter
      const contentWithoutFrontmatter = markdownText.replace(/^---[\s\S]*?---/, '').trim();
      
      // Function to create consistent IDs from text
      function createSlug(text) {
        return text.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')     // Replace spaces with dashes
          .replace(/-+/g, '-');     // Replace multiple dashes with single dash
      }
      
      // Map of component names to their section IDs for navigation
      const componentMap = {
        'Input Processing': '1-input-processing-implemented',
        'Vector Database Integration': '2-vector-database-integration-to-implement',
        'Multi-LLM Orchestration': '3-multi-llm-orchestration-to-implement',
        'Research Generation': '4-research-generation-to-implement',
        'Content Assembly': '5-content-assembly-to-implement'
      };

      // Track section hierarchy
      let currentH2Section = null;
      let currentH3Section = null;
      let sections = [];
      let currentSection = { content: '', subsections: [] };
      
      // Simple markdown to HTML conversion for basic elements
      const lines = contentWithoutFrontmatter.split('\n');
      let html = '';
      let inList = false;
      let listItems = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle headers with collapsible sections
        if (line.startsWith('## ')) {
          if (currentSection.content) {
            sections.push(currentSection);
          }
          const title = line.replace('## ', '').replace(/\{#[\w-]+\}/, '').trim();
          const id = line.match(/\{#([\w-]+)\}/) ? line.match(/\{#([\w-]+)\}/)[1] : createSlug(title);
          currentSection = {
            level: 2,
            title,
            id,
            content: '',
            subsections: []
          };
        } else if (line.startsWith('### ')) {
          const title = line.replace('### ', '').replace(/\{#[\w-]+\}/, '').trim();
          const id = line.match(/\{#([\w-]+)\}/) ? line.match(/\{#([\w-]+)\}/)[1] : createSlug(title);
          if (currentSection.subsections) {
            currentSection.subsections.push({
              level: 3,
              title,
              id,
              content: ''
            });
          }
        } else {
          // Handle lists
          if (line.startsWith('- ')) {
            if (!inList) {
              inList = true;
              listItems = [];
            }
            listItems.push(line.replace('- ', ''));
          } else if (inList && line.trim() === '') {
            inList = false;
            const listHtml = '<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>';
            if (currentSection.subsections.length > 0) {
              currentSection.subsections[currentSection.subsections.length - 1].content += listHtml;
            } else {
              currentSection.content += listHtml;
            }
          } else if (!inList) {
            // Handle regular content
            if (line.trim() !== '') {
              const processedLine = line
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/_(.+?)_/g, '<em>$1</em>')
                .replace(/`(.+?)`/g, '<code>$1</code>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-theme-light-primary dark:text-theme-dark-primary hover:underline">$1</a>');
              
              if (currentSection.subsections.length > 0) {
                currentSection.subsections[currentSection.subsections.length - 1].content += `<p>${processedLine}</p>`;
              } else {
                currentSection.content += `<p>${processedLine}</p>`;
              }
            }
          }
        }
      }
      
      // Add the last section
      if (currentSection.content) {
        sections.push(currentSection);
      }
      
      // Generate HTML for sections
      html = sections.map(section => {
        const subsectionsHtml = section.subsections.map(subsection => `
          <div class="subsection mb-4" id="${subsection.id}">
            <button class="collapsible-header w-full text-left py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <h3 class="text-lg font-semibold flex items-center">
                <span class="transform transition-transform duration-200">▶</span>
                <span class="ml-2">${subsection.title}</span>
              </h3>
            </button>
            <div class="collapsible-content hidden px-4 py-2">
              ${subsection.content}
            </div>
          </div>
        `).join('');
        
        return `
          <div class="section mb-8" id="${section.id}">
            <button class="collapsible-header w-full text-left py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <h2 class="text-xl font-bold flex items-center">
                <span class="transform transition-transform duration-200">▶</span>
                <span class="ml-2">${section.title}</span>
              </h2>
            </button>
            <div class="collapsible-content hidden px-6 py-4">
              ${section.content}
              ${subsectionsHtml}
            </div>
          </div>
        `;
      }).join('');
      
      // Add a table of contents
      let toc = '<div class="component-toc mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">';
      toc += '<h3 class="text-lg font-semibold mb-2">Quick Navigation</h3>';
      toc += '<ul class="space-y-1">';
      
      sections.forEach(section => {
        toc += `<li><a href="#${section.id}" class="text-theme-light-primary dark:text-theme-dark-primary hover:underline">${section.title}</a>`;
        if (section.subsections.length > 0) {
          toc += '<ul class="ml-4 mt-1 space-y-1">';
          section.subsections.forEach(subsection => {
            toc += `<li><a href="#${subsection.id}" class="text-theme-light-primary dark:text-theme-dark-primary hover:underline">${subsection.title}</a></li>`;
          });
          toc += '</ul>';
        }
        toc += '</li>';
      });
      
      toc += '</ul></div>';
      
      // Set the HTML content
      componentContainer.innerHTML = toc + html;
      
      // Add click handlers for collapsible sections
      document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function() {
          const content = this.nextElementSibling;
          const arrow = this.querySelector('span');
          
          // Toggle content visibility
          content.classList.toggle('hidden');
          
          // Rotate arrow
          if (content.classList.contains('hidden')) {
            arrow.style.transform = 'rotate(0deg)';
          } else {
            arrow.style.transform = 'rotate(90deg)';
          }
        });
      });
      
      // Add click event listeners to TOC links
      componentContainer.querySelectorAll('.component-toc a').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            // Expand the section if it's collapsed
            const content = targetElement.querySelector('.collapsible-content');
            const arrow = targetElement.querySelector('.collapsible-header span');
            if (content && content.classList.contains('hidden')) {
              content.classList.remove('hidden');
              arrow.style.transform = 'rotate(90deg)';
            }
            
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.classList.add('highlight-section');
            setTimeout(() => {
              targetElement.classList.remove('highlight-section');
            }, 2000);
          }
        });
      });
      
      // Notify that components are loaded
      console.log('Component descriptions loaded successfully');
      
      // Dispatch an event that components are loaded
      document.dispatchEvent(new CustomEvent('componentsLoaded'));
      
    } catch (error) {
      console.error('Error loading component descriptions:', error);
      componentContainer.innerHTML = `<div class="text-center py-8 text-red-500"><p>Error loading component descriptions: ${error.message}</p></div>`;
    }
  }
  
  // Load the component descriptions
  fetchComponentDescriptions();
});
