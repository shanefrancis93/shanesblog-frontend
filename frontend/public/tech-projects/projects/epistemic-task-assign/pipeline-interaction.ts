// pipeline-interaction.ts
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const mainPipeline = document.getElementById('main-pipeline');
        const llmOrchestration = document.getElementById('llm-orchestration');
        const knowledgeInfrastructure = document.getElementById('knowledge-infrastructure');
        const backButton = document.getElementById('back-button');
        
        // Add click event listeners
        document.addEventListener('click', (event) => {
            const target = event.target as Element;
            
            // Check if clicked element is a diagram node
            if (target.tagName === 'tspan' || target.tagName === 'rect') {
                const text = target.textContent || '';
                if (text.includes('LLM Orchestration')) {
                    showDetail('llm-orchestration');
                } else if (text.includes('Knowledge Infrastructure')) {
                    showDetail('knowledge-infrastructure');
                } else if (text.includes('Research Template')) {
                    // Add more details views as needed
                }
            }
            
            // Handle back button click
            if (target === backButton || target.parentElement === backButton) {
                showMain();
            }
        });
        
        function showDetail(id: string): void {
            // Hide main view
            mainPipeline?.classList.add('hidden');
            
            // Hide all detail views
            llmOrchestration?.classList.add('hidden');
            knowledgeInfrastructure?.classList.add('hidden');
            
            // Show selected detail view
            document.getElementById(id)?.classList.remove('hidden');
            
            // Show back button
            backButton?.classList.remove('hidden');
        }
        
        function showMain(): void {
            // Hide all detail views
            llmOrchestration?.classList.add('hidden');
            knowledgeInfrastructure?.classList.add('hidden');
            
            // Show main view
            mainPipeline?.classList.remove('hidden');
            
            // Hide back button
            backButton?.classList.add('hidden');
        }
    }, 1000); // Allow time for mermaid to render
});