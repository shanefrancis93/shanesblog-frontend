// Wait for mermaid to render
document.addEventListener('DOMContentLoaded', function() {
    // Allow more time for mermaid to fully render
    setTimeout(() => {
        // Get all view containers
        const mainPipeline = document.getElementById('main-pipeline');
        const inputProcessing = document.getElementById('input-processing');
        const vectorDatabase = document.getElementById('knowledge-infrastructure'); // Using knowledge-infrastructure for vector database
        const llmOrchestration = document.getElementById('llm-orchestration');
        const researchGeneration = document.getElementById('research-generation');
        const contentAssembly = document.getElementById('content-assembly');
        const backButton = document.getElementById('back-button');
        
        console.log('Pipeline interaction script loaded');

        // Add direct click handlers to specific elements after Mermaid has rendered
        function addClickHandlers() {
            // Find all elements with the 'clickable' class
            const clickableElements = document.querySelectorAll('.clickable');
            console.log('Found clickable elements:', clickableElements.length);
            
            // Add direct click handlers to each clickable element
            clickableElements.forEach(element => {
                element.style.cursor = 'pointer'; // Ensure cursor shows as pointer
                element.addEventListener('click', function(e) {
                    const text = this.textContent || '';
                    console.log('Clickable element clicked:', text);
                    
                    if (text.includes('Input Processing')) {
                        showDetail('input-processing');
                    } else if (text.includes('Vector Database')) {
                        showDetail('knowledge-infrastructure');
                    } else if (text.includes('LLM Orchestration')) {
                        showDetail('llm-orchestration');
                    } else if (text.includes('Research Generation')) {
                        showDetail('research-generation');
                    } else if (text.includes('Content Assembly')) {
                        showDetail('content-assembly');
                    }
                    
                    e.stopPropagation(); // Prevent event bubbling
                });
            });
        }
        
        // Try to add click handlers after a delay
        setTimeout(addClickHandlers, 1000);
        
        // Add click event listeners to the entire document as a fallback
        document.addEventListener('click', (event) => {
            const target = event.target;
            console.log('Clicked element:', target.tagName, target.textContent);
            
            // Check if clicked element is within an SVG
            if (target.closest('svg')) {
                // Get all parent elements up to the SVG
                let currentElement = target;
                let found = false;
                
                // Check the clicked element and all its parent elements for relevant text
                while (currentElement && !found && !(currentElement.tagName === 'DIV' && currentElement.classList.contains('graph-container'))) {
                    const text = currentElement.textContent || '';
                    console.log('Checking element:', currentElement.tagName, text);
                    
                    if (text.includes('Input Processing')) {
                        console.log('Found Input Processing');
                        showDetail('input-processing');
                        found = true;
                    } else if (text.includes('Vector Database')) {
                        console.log('Found Vector Database');
                        showDetail('knowledge-infrastructure');
                        found = true;
                    } else if (text.includes('LLM Orchestration')) {
                        console.log('Found LLM Orchestration');
                        showDetail('llm-orchestration');
                        found = true;
                    } else if (text.includes('Research Generation')) {
                        console.log('Found Research Generation');
                        showDetail('research-generation');
                        found = true;
                    } else if (text.includes('Content Assembly')) {
                        console.log('Found Content Assembly');
                        showDetail('content-assembly');
                        found = true;
                    }
                    
                    currentElement = currentElement.parentElement;
                }
            }
            
            // Handle back button click
            if (target === backButton || target.closest('#back-button')) {
                showMain();
            }
        });
        
        // Function to show a specific detail view
        function showDetail(id) {
            console.log('Showing detail:', id);
            // Hide main view
            mainPipeline.classList.add('hidden');
            
            // Hide all detail views
            inputProcessing.classList.add('hidden');
            vectorDatabase.classList.add('hidden');
            llmOrchestration.classList.add('hidden');
            researchGeneration.classList.add('hidden');
            contentAssembly.classList.add('hidden');
            
            // Show selected detail view
            const detailElement = document.getElementById(id);
            if (detailElement) {
                detailElement.classList.remove('hidden');
            } else {
                console.error('Detail element not found:', id);
            }
            
            // Show back button
            backButton.classList.remove('hidden');
        }
        
        // Function to show the main pipeline view
        function showMain() {
            console.log('Showing main view');
            // Hide all detail views
            inputProcessing.classList.add('hidden');
            vectorDatabase.classList.add('hidden');
            llmOrchestration.classList.add('hidden');
            researchGeneration.classList.add('hidden');
            contentAssembly.classList.add('hidden');
            
            // Show main view
            mainPipeline.classList.remove('hidden');
            
            // Hide back button
            backButton.classList.add('hidden');
        }

        // Add Mermaid callback function to window object
        window.callback = function(id) {
            console.log('Mermaid callback called with id:', id);
            if (id === 'A') {
                showDetail('input-processing');
            } else if (id === 'B') {
                showDetail('knowledge-infrastructure');
            } else if (id === 'C') {
                showDetail('llm-orchestration');
            } else if (id === 'D') {
                showDetail('research-generation');
            } else if (id === 'E') {
                showDetail('content-assembly');
            }
        };
    }, 2000); // Increased timeout to ensure mermaid has fully rendered
});
