"""
Transform research questions into optimized prompts for deep research retrieval.
"""
from typing import List, Dict
import json
import logging

logger = logging.getLogger(__name__)

class PromptTransformer:
    def __init__(self):
        self.prompt_templates = self._load_prompt_templates()

    def _load_prompt_templates(self) -> Dict[str, str]:
        """Load specialized prompt templates for different research types."""
        return {
            "technical_documentation": """
# Technical Research Investigation
Topic: {topic}

## Research Context
{context}

## Key Technical Questions
{questions}

## Required Information Types
1. Technical specifications
2. Implementation details
3. System architecture
4. Performance metrics
5. Best practices

## Search Parameters
{search_params}

Please provide comprehensive technical analysis with concrete examples and implementation details.
""",
            "academic_research": """
# Academic Research Investigation
Topic: {topic}

## Research Context
{context}

## Key Research Questions
{questions}

## Required Information Types
1. Peer-reviewed research
2. Theoretical frameworks
3. Empirical studies
4. Literature reviews
5. Academic perspectives

## Search Parameters
{search_params}

Please provide in-depth academic analysis with citations and theoretical foundations.
""",
            "trend_analysis": """
# Trend Analysis Investigation
Topic: {topic}

## Research Context
{context}

## Key Trend Questions
{questions}

## Required Information Types
1. Industry reports
2. Market analyses
3. Expert predictions
4. Case studies
5. Emerging patterns

## Search Parameters
{search_params}

Please provide forward-looking analysis with supporting evidence and expert insights.
"""
        }

    def transform_questions(self, 
                          topic: str, 
                          questions: List[Dict[str, str]], 
                          context: str) -> Dict[str, str]:
        """
        Transform research questions into specialized deep research prompts.
        
        Args:
            topic: The research topic
            questions: List of research questions with metadata
            context: Additional context about the research
            
        Returns:
            Dictionary of research type to formatted prompt
        """
        # Group questions by research type
        grouped_questions = {}
        for q in questions:
            research_type = q["research_type"]
            if research_type not in grouped_questions:
                grouped_questions[research_type] = []
            grouped_questions[research_type].append(q["question"])

        # Generate prompts for each research type
        prompts = {}
        for research_type, questions_list in grouped_questions.items():
            if research_type in self.prompt_templates:
                search_params = self._generate_search_params(research_type)
                
                prompts[research_type] = self.prompt_templates[research_type].format(
                    topic=topic,
                    context=context,
                    questions="\n".join(f"- {q}" for q in questions_list),
                    search_params=json.dumps(search_params, indent=2)
                )
        
        logger.info(f"Generated {len(prompts)} specialized research prompts")
        for rtype, prompt in prompts.items():
            logger.debug(f"Prompt for {rtype}: {prompt[:200]}...")
            
        return prompts

    def _generate_search_params(self, research_type: str) -> Dict[str, any]:
        """Generate appropriate search parameters based on research type."""
        base_params = {
            "technical_documentation": {
                "source_types": ["documentation", "technical_papers", "code_repositories"],
                "time_range": "last_5_years",
                "required_details": ["implementation", "architecture", "performance"],
                "quality_filters": ["verified_source", "technical_accuracy"]
            },
            "academic_research": {
                "source_types": ["peer_reviewed", "academic_journals", "conference_papers"],
                "time_range": "last_10_years",
                "required_details": ["methodology", "findings", "theoretical_framework"],
                "quality_filters": ["peer_reviewed", "citation_count"]
            },
            "trend_analysis": {
                "source_types": ["industry_reports", "market_analysis", "expert_opinions"],
                "time_range": "last_2_years",
                "required_details": ["trends", "predictions", "market_impact"],
                "quality_filters": ["recency", "expert_authority"]
            }
        }
        
        return base_params.get(research_type, {
            "source_types": ["general"],
            "time_range": "last_5_years",
            "required_details": ["overview", "analysis"],
            "quality_filters": ["reliability"]
        })
