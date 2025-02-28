"""
O3 research query orchestrator.
Handles the generation of optimized research queries for O3 by:
1. Selecting the best model for analysis
2. Generating targeted research questions
3. Creating O3-optimized queries
"""
import asyncio
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict

from pipeline.model_weights import ModelWeightSystem
from pipeline.research_questions import ResearchQuestionGenerator
from pipeline.o3_interface import O3PromptGenerator
from pipeline.data_models import ResearchPrompt, ResearchType, ModelType
from pipeline.llm_orchestrator import LLMOrchestrator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("o3_orchestrator.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class O3QueryOrchestrator:
    """Orchestrates the generation of O3 research queries."""
    
    def __init__(self):
        """Initialize orchestrator components."""
        self.weight_system = ModelWeightSystem()
        self.question_generator = ResearchQuestionGenerator()
        self.o3_generator = O3PromptGenerator()
        self.llm_orchestrator = LLMOrchestrator()
        
    async def process_content(self, content: str, topic: str = None) -> Dict:
        """
        Process content to generate an optimized O3 research query.
        
        Args:
            content: The content to analyze
            topic: Optional topic override
            
        Returns:
            Dictionary containing generated O3 query and metadata
        """
        try:
            logger.info(f"Processing content for topic: {topic or 'auto-detect'}")
            
            # 1. Model Selection
            selected_model, scores = await self.weight_system.analyze_topic(
                topic or content[:500]  # Use first 500 chars if no topic
            )
            logger.info(f"Selected model: {selected_model} with scores: {scores}")
            
            # 2. Generate Research Questions
            questions = await self.question_generator.generate_questions(
                topic or content[:500],
                selected_model
            )
            logger.info(f"Generated {len(questions)} research questions")
            
            # 3. Get Parallel Analysis from All Models
            model_prompts = {
                "gpt4": f"Analyze the technical aspects of: {topic}\n\nContext:\n{content[:1000]}",
                "claude": f"Analyze the theoretical framework of: {topic}\n\nContext:\n{content[:1000]}",
                "gemini": f"Analyze the societal implications of: {topic}\n\nContext:\n{content[:1000]}"
            }
            
            model_analyses = await self.llm_orchestrator.get_parallel_completions(
                prompts=model_prompts,
                system_prompt="You are an expert research analyst. Provide a focused analysis based on your model's strengths."
            )
            logger.info(f"Received analyses from {len(model_analyses)} models")
            
            # 4. Create Research Prompt
            prompt = ResearchPrompt(
                research_type=ResearchType.TECHNICAL,  # Default for now
                topic=topic or content[:100],
                context=content,
                questions=questions,
                search_params={
                    "source_types": ["documentation", "papers"],
                    "time_range": "last_5_years",
                    "required_details": ["implementation", "architecture"],
                    "quality_filters": ["verified_source"]
                },
                generated_at=datetime.now(),
                metadata={
                    "model_scores": {k: float(v) for k, v in scores.items()},
                    "model_analyses": model_analyses
                }
            )
            
            # 5. Generate O3 Query
            o3_query = await self.o3_generator.generate_o3_query(prompt)
            formatted_query = await self.o3_generator.format_query(o3_query)
            
            # 6. Return Results
            return {
                "model_selection": {
                    "model": selected_model,
                    "scores": {k: float(v) for k, v in scores.items()}
                },
                "questions": [q.to_dict() for q in questions],
                "model_analyses": model_analyses,
                "o3_query": formatted_query,
                "metadata": prompt.metadata
            }
            
        except Exception as e:
            logger.error(f"Error in O3 query generation: {str(e)}")
            raise

async def main():
    """Example usage of O3QueryOrchestrator."""
    try:
        orchestrator = O3QueryOrchestrator()
        
        # Example: Process a file
        input_file = Path(__file__).parent / "processed_text" / "avatars_processed.md"
        with open(input_file, encoding='utf-8') as f:
            content = f.read()
        
        results = await orchestrator.process_content(
            content=content,
            topic="Human-AI Interaction Analysis"
        )
        
        # Save results
        output_file = Path(__file__).parent / "generated_prompts" / f"o3_query_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(results["o3_query"])
            
        logger.info(f"O3 query generation complete. Results saved to {output_file}")
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
