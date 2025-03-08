/// <reference path="./mermaid.d.ts" />
// This is the source of truth for pipeline interaction code.
// Edit this file and then run 'npm run compile-public-ts' to generate the JS file.
// pipeline-interaction.ts - Advanced interaction for the Epistemic Task Assignment Pipeline visualization
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing pipeline interaction');
    try {
        console.log('Pipeline interaction script initialized');
        
        // Initialize theme based on time of day
        initializeTheme();
        
        // Set up event handlers
        setupEventHandlers();
        
        // Setup theme toggle
        setupThemeToggle();
    }
    catch (error) {
        console.error('Error initializing pipeline interaction:', error);
    }
    
    // Function to initialize theme based on time of day, matching the main site's approach
    function initializeTheme() {
        const isNightTime = () => {
            const hour = new Date().getHours();
            return hour < 6 || hour >= 18; // Before 6am or after 6pm = dark mode
        };
        
        // Apply theme based on time
        const shouldBeDark = isNightTime();
        document.documentElement.classList.toggle('dark', shouldBeDark);
        console.log(`Time-based theme initialized: ${shouldBeDark ? 'dark' : 'light'} mode`);
        
        // Update theme toggle button appearance
        updateThemeToggleButton();
    }
    
    // Function to set up the theme toggle
    function setupThemeToggle() {
        const themeToggleButton = document.getElementById('theme-toggle-button');
        if (!themeToggleButton) {
            console.error('Theme toggle button not found');
            return;
        }
        
        // Add theme toggle button icons
        updateThemeToggleButton();
        
        // Add click event listener for theme toggle
        themeToggleButton.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            updateThemeToggleButton();
            console.log('Theme toggled to:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }
    
    // Function to update theme toggle button appearance
    function updateThemeToggleButton() {
        const themeToggleButton = document.getElementById('theme-toggle-button');
        if (!themeToggleButton)
            return;
        
        const isDark = document.documentElement.classList.contains('dark');
        
        // Set the appropriate icon based on the current theme
        themeToggleButton.innerHTML = isDark
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-yellow-300"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" /></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-700"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" /></svg>';
    }
    
    // Function to show a specific detail view
    function showDetailView(componentId) {
        console.log('Showing detail view for:', componentId);
        
        // Hide the main pipeline view
        const mainPipeline = document.getElementById('main-pipeline');
        if (mainPipeline) {
            mainPipeline.style.display = 'none';
        }
        
        // Show the detail view
        const detailView = document.getElementById(`${componentId}-detail`);
        if (detailView) {
            detailView.style.display = 'block';
        } else {
            console.warn(`Detail view not found for component: ${componentId}`);
        }
        
        // Show the back button
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.style.display = 'block';
        }
        
        // Update component information
        updateComponentInfo(componentId);
    }
    
    // Function to show the main view
    function showMainView() {
        console.log('Showing main pipeline view');
        
        // Show the main pipeline view
        const mainPipeline = document.getElementById('main-pipeline');
        if (mainPipeline) {
            mainPipeline.style.display = 'block';
        }
        
        // Hide all detail views
        const detailViews = document.querySelectorAll('[id$="-detail"]');
        detailViews.forEach(view => {
            view.style.display = 'none';
        });
        
        // Hide the back button
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.style.display = 'none';
        }
        
        // Reset component information
        resetComponentInfo();
    }
    
    // Function to update component information
    function updateComponentInfo(componentId) {
        console.log('Updating component info for:', componentId);
        
        // Scroll to the component description
        const iframe = document.getElementById('diagram-iframe');
        if (iframe && iframe.contentWindow) {
            // Send a message to the iframe to highlight the component
            iframe.contentWindow.postMessage({
                type: 'highlightComponent',
                componentId: componentId
            }, '*');
        }
    }
    
    // Function to reset component information
    function resetComponentInfo() {
        console.log('Resetting component info');
        
        // Clear any highlights or selections
        const iframe = document.getElementById('diagram-iframe');
        if (iframe && iframe.contentWindow) {
            // Send a message to the iframe to reset highlights
            iframe.contentWindow.postMessage({
                type: 'resetHighlights'
            }, '*');
        }
    }
    
    // Function to setup event handlers
    function setupEventHandlers() {
        console.log('Setting up event handlers');
        
        // Add click event listener for back button
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', showMainView);
        }
        
        // Listen for messages from the iframe
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'componentClick') {
                const componentId = event.data.componentId;
                console.log('Received component click from iframe:', componentId);
                
                // If it's a view ID, show the detail view
                if (componentId.endsWith('-view')) {
                    showDetailView(componentId.replace('-view', ''));
                }
            }
        });
    }
});
