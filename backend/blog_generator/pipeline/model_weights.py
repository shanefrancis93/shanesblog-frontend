"""
Model weighting system for determining the most suitable LLM for topic analysis.
"""
from typing import Dict, List, Tuple
import json
import logging
from pathlib import Path
from dotenv import load_dotenv
import os

from .llm_orchestrator import LLMOrchestrator

# Load environment variables
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)

class ModelWeightSystem:
    def __init__(self):
        """Initialize with LLM orchestrator."""
        self.llm_orchestrator = LLMOrchestrator()
        self.analysis_prompt = """
You are an expert in AI model capabilities analysis. Given a topic, analyze its characteristics and requirements.
Consider these aspects:
1. Technical complexity (implementation, systems, algorithms)
2. Theoretical depth (academic research, frameworks, patterns)
3. Societal implications (ethics, culture, impact)

Topic: {topic}

Provide a JSON response with these scores (0-1):
{
    "technical_score": <float>,
    "theoretical_score": <float>,
    "societal_score": <float>,
    "reasoning": "<brief explanation>"
}
"""

    async def analyze_topic(self, topic: str) -> Tuple[str, Dict[str, float]]:
        """
        Analyze a topic using LLMs to determine the most suitable model.
        
        Args:
            topic: The research topic to analyze
            
        Returns:
            Tuple of (selected_model, scores_dict)
        """
        try:
            # Get analysis from GPT-4
            analysis = await self.llm_orchestrator.get_structured_completion(
                model="gpt4",
                prompt=self.analysis_prompt.format(topic=topic),
                output_structure={
                    "technical_score": 0.5,
                    "theoretical_score": 0.5,
                    "societal_score": 0.5,
                    "reasoning": "Example reasoning"
                },
                system_prompt="You are an expert in AI model capabilities analysis."
            )
            
            # Calculate model scores
            scores = {
                "gpt4": analysis["technical_score"] * 0.8 + analysis["theoretical_score"] * 0.6,
                "claude": analysis["theoretical_score"] * 0.8 + analysis["societal_score"] * 0.6,
                "gemini": analysis["societal_score"] * 0.8 + analysis["technical_score"] * 0.4
            }
            
            # Select model with highest score
            selected_model = max(scores.items(), key=lambda x: x[1])[0]
            
            logger.info(f"Topic analysis results for: {topic}")
            logger.info(f"Raw analysis: {json.dumps(analysis, indent=2)}")
            logger.info(f"Model scores: {json.dumps(scores, indent=2)}")
            logger.info(f"Selected model: {selected_model}")
            logger.info(f"Reasoning: {analysis['reasoning']}")
            
            return selected_model, scores
            
        except Exception as e:
            logger.error(f"Error in LLM analysis: {str(e)}")
            logger.info("Falling back to keyword-based analysis")
            return self._fallback_analysis(topic)

    def _fallback_analysis(self, topic: str) -> Tuple[str, Dict[str, float]]:
        """Fallback to keyword-based analysis if LLM fails."""
        topic_keywords = {
            "technical": [
                "implementation", "system", "architecture", "algorithm",
                "performance", "optimization", "code", "framework",
                "infrastructure", "technical", "programming"
            ],
            "theoretical": [
                "history", "development", "evolution", "pattern",
                "relationship", "context", "background", "literature",
                "theory", "academic", "research"
            ],
            "societal": [
                "society", "ethics", "impact", "culture", "values",
                "implications", "future", "social", "philosophical",
                "moral", "human"
            ]
        }

        topic = topic.lower()
        scores = {model: 0.0 for model in ["gpt4", "claude", "gemini"]}
        
        # Calculate scores based on keyword presence
        for domain, keywords in topic_keywords.items():
            domain_score = sum(1 for kw in keywords if kw in topic) / len(keywords)
            if domain == "technical":
                scores["gpt4"] += domain_score * 0.8
            elif domain == "theoretical":
                scores["claude"] += domain_score * 0.8
            elif domain == "societal":
                scores["gemini"] += domain_score * 0.8

        # Add base scores to ensure non-zero values
        scores = {k: v + 0.2 for k, v in scores.items()}

        # Select model with highest score
        selected_model = max(scores.items(), key=lambda x: x[1])[0]
        
        logger.info(f"Fallback analysis results for: {topic}")
        logger.info(f"Model scores: {json.dumps(scores, indent=2)}")
        logger.info(f"Selected model: {selected_model}")
        
        return selected_model, scores
