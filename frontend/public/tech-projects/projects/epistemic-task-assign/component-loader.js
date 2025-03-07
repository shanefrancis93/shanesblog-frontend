// JavaScript to dynamically load component descriptions from components.md
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
      const response = await fetch('/tech-projects/projects/epistemic-task-assign/components.md');
      if (!response.ok) {
        throw new Error(`Failed to fetch components.md: ${response.status}`);
      }
      
      const markdownText = await response.text();
      
      // Simple markdown to HTML conversion for basic elements
      let html = markdownText
        // Convert headers with IDs
        .replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>')
        .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
        .replace(/^#### (.+)$/gm, '<h4 id="$1">$1</h4>')
        // Convert lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Wrap consecutive list items in ul tags
        .replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')
        // Convert bold text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Convert paragraphs (any line that's not a header, list, or blank)
        .replace(/^(?!<h|<ul|<li|\s*$)(.+)$/gm, '<p>$1</p>');
      
      // Add specific IDs to sections for navigation
      // Create slug-friendly IDs by converting spaces to dashes and removing special chars
      function createSlug(text) {
        return text.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')     // Replace spaces with dashes
          .replace(/-+/g, '-');     // Replace multiple dashes with single dash
      }
      
      // Replace header IDs with slug versions
      html = html.replace(/<h([1-4]) id="([^"]+)">/g, function(match, level, id) {
        return `<h${level} id="${createSlug(id)}">`;
      });
      
      // Add specific IDs for main sections we need to target
      html = html.replace('<h3 id="llm-orchestration-layer-components">', '<h3 id="3-multi-llm-orchestration-to-implement">');
      html = html.replace('<h3 id="knowledge-infrastructure-components">', '<h3 id="2-vector-database-integration-to-implement">');
      
      // Add a heading for the component descriptions
      html = '<h2 id="detailed-component-descriptions">Detailed Component Descriptions</h2>' + html;
      
      // Insert the HTML content
      componentContainer.innerHTML = html;
      
      console.log('Component descriptions loaded successfully');
    } catch (error) {
      console.error('Error loading component descriptions:', error);
      componentContainer.innerHTML = `<p class="text-red-500">Error loading component descriptions: ${error.message}</p>`;
    }
  }
  
  // Load the component descriptions
  fetchComponentDescriptions();
});
