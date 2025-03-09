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
      console.log('Components loaded successfully');
      
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
      console.log('Components not loaded yet, setting pending scroll target:', sectionId);
      pendingScrollTarget = sectionId;
      return;
    }
    
    // Find the section element
    const sectionElement = document.getElementById(sectionId);
    
    if (sectionElement) {
      console.log('Scrolling to section:', sectionId);
      
      // Scroll to the section
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight the section temporarily
      sectionElement.classList.add('highlight-section');
      setTimeout(function() {
        sectionElement.classList.remove('highlight-section');
      }, 2000);
    } else {
      console.warn('Section not found:', sectionId);
      
      // Try to find a similar section by partial match
      const allHeadings = document.querySelectorAll('#component-descriptions h1, #component-descriptions h2, #component-descriptions h3, #component-descriptions h4');
      let bestMatch = null;
      let bestMatchScore = 0;
      
      // Convert sectionId to a more searchable format
      const searchTerm = sectionId.toLowerCase().replace(/-/g, ' ');
      
      allHeadings.forEach(heading => {
        const headingText = heading.textContent.toLowerCase();
        const headingId = heading.id.toLowerCase();
        
        // Check if the heading text contains any part of the search term
        if (headingText.includes(searchTerm) || searchTerm.includes(headingText) ||
            headingId.includes(searchTerm) || searchTerm.includes(headingId)) {
          const score = Math.max(
            headingText.includes(searchTerm) ? searchTerm.length / headingText.length : 0,
            searchTerm.includes(headingText) ? headingText.length / searchTerm.length : 0,
            headingId.includes(searchTerm) ? searchTerm.length / headingId.length : 0,
            searchTerm.includes(headingId) ? headingId.length / searchTerm.length : 0
          );
          
          if (score > bestMatchScore) {
            bestMatchScore = score;
            bestMatch = heading;
          }
        }
      });
      
      if (bestMatch && bestMatchScore > 0.3) {
        console.log('Found best match for', sectionId, ':', bestMatch.id, 'with score', bestMatchScore);
        bestMatch.scrollIntoView({ behavior: 'smooth' });
        bestMatch.classList.add('highlight-section');
        setTimeout(function() {
          bestMatch.classList.remove('highlight-section');
        }, 2000);
      }
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
          '1-input-processing-implemented': '1-input-processing-implemented',
          '4-research-generation-to-implement': '4-research-generation-to-implement',
          '5-content-assembly-to-implement': '5-content-assembly-to-implement',
          'research-problem': 'research-problem',
          'research-pipeline': 'research-pipeline',
          'research-template': 'research-template',
          'deep-research-model': 'deep-research-model',
          'augmented-research-composition': 'augmented-research-composition',
          'final-research-output': 'final-research-output',
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
