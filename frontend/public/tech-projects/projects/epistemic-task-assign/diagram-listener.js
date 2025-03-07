// JavaScript to listen for messages from the diagram iframe
document.addEventListener('DOMContentLoaded', function() {
  // Flag to track if components have been loaded
  let componentsLoaded = false;
  let pendingScrollTarget = null;
  
  // Check if components are loaded
  function checkComponentsLoaded() {
    // If the component container has content beyond the loading indicator
    const container = document.getElementById('component-descriptions');
    if (container && container.querySelector('h1, h2, h3, h4')) {
      componentsLoaded = true;
      
      // If there's a pending scroll target, scroll to it now
      if (pendingScrollTarget) {
        scrollToSection(pendingScrollTarget);
        pendingScrollTarget = null;
      }
    } else {
      // Check again in a moment
      setTimeout(checkComponentsLoaded, 200);
    }
  }
  
  // Start checking if components are loaded
  checkComponentsLoaded();
  
  // Function to scroll to a section
  function scrollToSection(sectionId) {
    // If components aren't loaded yet, save the target and wait
    if (!componentsLoaded) {
      pendingScrollTarget = sectionId;
      return;
    }
    
    // Find the section element
    const sectionElement = document.getElementById(sectionId);
    
    if (sectionElement) {
      // Scroll to the section
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight the section temporarily
      sectionElement.classList.add('highlight-section');
      setTimeout(function() {
        sectionElement.classList.remove('highlight-section');
      }, 2000);
    } else {
      console.warn('Section not found:', sectionId);
    }
  }
  
  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    // Check if the message is from our diagram
    if (event.data && event.data.type) {
      console.log('Received message from diagram:', event.data);
      
      if (event.data.type === 'componentClick') {
        const componentId = event.data.componentId;
        
        // Map component IDs to section IDs in the page
        const sectionMap = {
          '3-multi-llm-orchestration-to-implement': '3-multi-llm-orchestration-to-implement',
          '2-vector-database-integration-to-implement': '2-vector-database-integration-to-implement',
          'interactive-diagram': 'interactive-diagram'
        };
        
        // Get the mapped section ID or use the original if not found
        const sectionId = sectionMap[componentId] || componentId;
        
        // Scroll to the section
        scrollToSection(sectionId);
      }
    }
  });
});
