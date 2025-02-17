"""
Model Coordinator - Handles model assignment and section coordination.
Focuses on essential functionality with clean extension points for future enhancements.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple, Any
import logging
from datetime import datetime
import asyncio

# Configuration constants
CONTENT_INDICATORS = {
    "technical": {
        "terms": ["algorithm", "system", "process", "data", "method", "technical"],
        "weight": 1.0
    },
    "contextual": {
        "terms": ["history", "background", "context", "relationship", "pattern"],
        "weight": 1.0
    },
    "subtextual": {
        "terms": ["culture", "meaning", "implication", "perspective", "value"],
        "weight": 1.0
    }
}

@dataclass
class ModelConfig:
    """Configuration for a model's capabilities and preferences"""
    primary_strength: str
    secondary_strengths: List[str]
    supported_sections: List[str]
    token_limit: int
    cost_per_token: float

@dataclass
class AssignmentConfig:
    """Core configuration for assignment logic"""
    primary_weight: float = 1.0
    secondary_weight: float = 0.7
    base_weight: float = 0.5
    min_confidence: float = 0.3
    max_sections_per_model: int = 2
    keyword_weight: float = 1.0

class ModelCoordinator:
    """
    Coordinates model assignments based on content analysis and model capabilities.
    Designed for simplicity and extensibility.
    """
    
    def __init__(
        self,
        models: Dict[str, ModelConfig],
        config: Optional[AssignmentConfig] = None
    ):
        """Initialize coordinator with models and configuration"""
        self.models = models
        self.config = config or AssignmentConfig()
        self.logger = logging.getLogger(__name__)
        
    async def analyze_content(
        self, 
        messages: List[Dict[str, str]]
    ) -> Dict[str, List[str]]:
        """
        Analyze content and assign sections to models.
        Main entry point for content processing.
        Returns a dict mapping model names to their assigned sections.
        """
        self.logger.info("Starting content analysis...")
        
        # Extract and combine message content
        combined_text = "\n".join(msg["content"] for msg in messages)
        self.logger.debug(f"Combined text length: {len(combined_text)}")
        
        # Calculate content characteristics
        content_profile = self._analyze_content_characteristics(combined_text)
        self.logger.info(f"Content profile: {content_profile}")
        
        # For now, just assign each model their primary sections
        section_assignments = {}
        for model_name, model_config in self.models.items():
            section_assignments[model_name] = model_config.supported_sections[:2]
            self.logger.info(f"Assigned sections for {model_name}: {section_assignments[model_name]}")
        
        return section_assignments
        
    def _analyze_content_characteristics(self, text: str) -> Dict[str, float]:
        """
        Analyze content characteristics using simple but effective heuristics.
        Returns normalized scores for different content aspects.
        """
        characteristics = {}
        text = text.lower()
        
        # Calculate characteristic scores
        for category, info in CONTENT_INDICATORS.items():
            matches = sum(term in text for term in info["terms"])
            score = min(matches / (len(info["terms"]) * 0.5), 1.0) * info["weight"]
            characteristics[f"{category}_score"] = score
            
        return characteristics
        
    def get_research_prompt(self, context: Dict[str, Any], template: str) -> str:
        """Generate a comprehensive research prompt based on context and template"""
        # Extract key information
        topic = context["topic"]
        messages = context["messages"]
        sections = context["sections"]
        timestamp = context["timestamp"]
        
        # Build section assignments text
        section_text = []
        for model, assigned_sections in sections.items():
            model_sections = [
                f"- {section}: {self.models[model].primary_strength} analysis"
                for section in assigned_sections
            ]
            section_text.append(f"\n{model} sections:\n" + "\n".join(model_sections))
        
        # Format the prompt using the template
        prompt = template.format(
            topic=topic,
            timestamp=timestamp,
            section_assignments="\n".join(section_text),
            message_count=len(messages),
            message_preview="\n".join(
                f"- {msg['content'][:100]}..."
                for msg in messages[:3]
            )
        )
        
        return prompt
