/// <reference path="./mermaid.d.ts" />

// This is the source of truth for pipeline interaction code.
// Edit this file and then run 'npm run compile-public-ts' to generate the JS file.

// pipeline-interaction.ts - Advanced interaction for the Epistemic Task Assignment Pipeline visualization

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing pipeline interaction');
    
    try {
        console.log('Pipeline interaction script initialized');
        
        // Define the callback function for SVG node clicks
        (window as any).callback = function(nodeId: string): void {
            console.log('Node clicked:', nodeId);
            showDetailView(nodeId);
        };
        
        // Initialize theme based on time of day
        initializeTheme();
        
        // Set up event handlers
        setupEventHandlers();
        
        // Setup theme toggle
        setupThemeToggle();
        
    } catch (error) {
        console.error('Error initializing pipeline interaction:', error);
    }
    
    // Function to initialize theme based on time of day, matching the main site's approach
    function initializeTheme(): void {
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
    function setupThemeToggle(): void {
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
    function updateThemeToggleButton(): void {
        const themeToggleButton = document.getElementById('theme-toggle-button');
        if (!themeToggleButton) return;

        const isDark = document.documentElement.classList.contains('dark');

        // Set the appropriate icon based on the current theme
        themeToggleButton.innerHTML = isDark
            ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" /></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>';
    }
    
    // Function to show a specific detail view
    function showDetailView(componentId: string): void {
        console.log('Showing detail view:', componentId);
        
        // Hide the main pipeline view
        const mainPipeline = document.getElementById('main-pipeline');
        mainPipeline?.classList.add('hidden');
        
        // Hide all detail views first
        const views = [
            document.getElementById('input-processing-detail'),
            document.getElementById('knowledge-infrastructure-detail'),
            document.getElementById('llm-orchestration-detail'),
            document.getElementById('research-generation-detail'),
            document.getElementById('content-assembly-detail')
        ];
        
        views.forEach(view => {
            if (view) view.classList.add('hidden');
        });
        
        // Show the requested detail view
        const detailView = document.getElementById(`${componentId}-detail`);
        if (detailView) {
            detailView.classList.remove('hidden');
            // Show the back button
            const backButton = document.getElementById('back-button');
            if (backButton) backButton.classList.remove('hidden');
            
            // Update component info
            updateComponentInfo(componentId);
        } else {
            console.error('Detail view not found:', `${componentId}-detail`);
        }
    }
    
    // Function to show the main view
    function showMainView(): void {
        console.log('Showing main view');
        
        // Hide all detail views
        const views = [
            document.getElementById('input-processing-detail'),
            document.getElementById('knowledge-infrastructure-detail'),
            document.getElementById('llm-orchestration-detail'),
            document.getElementById('research-generation-detail'),
            document.getElementById('content-assembly-detail')
        ];
        
        views.forEach(view => {
            if (view) view.classList.add('hidden');
        });
        
        // Show the main pipeline view
        const mainPipeline = document.getElementById('main-pipeline');
        if (mainPipeline) mainPipeline.classList.remove('hidden');
        
        // Hide the back button
        const backButton = document.getElementById('back-button');
        if (backButton) backButton.classList.add('hidden');
        
        // Reset component info
        resetComponentInfo();
    }
    
    // Function to update component information
    function updateComponentInfo(componentId: string): void {
        console.log('Updating component info for:', componentId);
        
        const componentTitle = document.getElementById('component-title');
        const componentStatus = document.getElementById('component-status');
        const componentDescription = document.getElementById('component-description');
        
        if (!componentTitle || !componentStatus || !componentDescription) {
            console.error('Component info elements not found');
            return;
        }
        
        let title = '';
        let status = '';
        let description = '';
        
        switch(componentId) {
            case 'input-processing':
                title = 'Input Processing';
                status = 'Implemented';
                description = 'Extracts and structures user messages from transcripts, preserving temporal context and formatting as markdown.';
                break;
            case 'knowledge-infrastructure':
                title = 'Vector Database';
                status = 'Planned';
                description = 'Stores and retrieves knowledge using Chroma DB with text-embedding-ada-002 embeddings for both user messages and research outputs.';
                break;
            case 'llm-orchestration':
                title = 'LLM Orchestration';
                status = 'Planned';
                description = 'Coordinates multiple AI models (Claude, GPT-4, Gemini) with a structured prompting system for optimal task routing.';
                break;
            case 'research-generation':
                title = 'Research Generation';
                status = 'Planned';
                description = 'Creates in-depth research content with sectioned output in markdown/JSON format and automatic chunking for embedding.';
                break;
            case 'content-assembly':
                title = 'Content Assembly';
                status = 'Planned';
                description = 'Generates the final blog post with section collapsing, formatting, and citation/reference management.';
                break;
            default:
                console.error('Unknown component ID:', componentId);
                return;
        }
        
        componentTitle.textContent = title;
        componentStatus.textContent = status;
        componentDescription.textContent = description;
        
        // Update status based on theme-compatible classes
        componentStatus.className = 'px-2 py-1 rounded text-sm font-semibold';
        if (status === 'Implemented') {
            componentStatus.classList.add('implemented-label');
        } else {
            componentStatus.classList.add('planned-label');
        }
    }
    
    // Function to reset component information
    function resetComponentInfo(): void {
        console.log('Resetting component info');
        
        const componentTitle = document.getElementById('component-title');
        const componentStatus = document.getElementById('component-status');
        const componentDescription = document.getElementById('component-description');
        
        if (componentTitle) componentTitle.textContent = 'Pipeline Overview';
        if (componentStatus) {
            componentStatus.textContent = 'Interactive';
            componentStatus.className = 'px-2 py-1 rounded text-sm font-semibold text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-700';
        }
        if (componentDescription) componentDescription.textContent = 'Click on any component in the diagram to see more details.';
    }
    
    // Function to setup event handlers
    function setupEventHandlers(): void {
        // Set up back button functionality
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', function() {
                showMainView();
            });
        }
        
        // Add more event handlers as needed
    }
});