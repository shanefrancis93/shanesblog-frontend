"""
Shared data models and validation for the research pipeline.
"""
from typing import Dict, List, Optional, Union
from dataclasses import dataclass, asdict
from datetime import datetime
import json
import logging
from enum import Enum

logger = logging.getLogger(__name__)

class ResearchType(Enum):
    TECHNICAL = "technical_documentation"
    ACADEMIC = "academic_research"
    TREND = "trend_analysis"
    GENERAL = "general_research"

class ModelType(Enum):
    GPT4 = "gpt4"
    CLAUDE = "claude"
    GEMINI = "gemini"
    FALLBACK = "fallback"  # Used when no clear winner

@dataclass
class ModelScore:
    model_type: ModelType
    score: float
    confidence: float
    timestamp: datetime

    def to_dict(self) -> Dict:
        return {
            "model_type": self.model_type.value,
            "score": self.score,
            "confidence": self.confidence,
            "timestamp": self.timestamp.isoformat()
        }

@dataclass
class ResearchQuestion:
    question_text: str  # Changed from 'question' to 'question_text' for clarity
    model: ModelType
    research_type: ResearchType
    category: str
    metadata: Dict[str, any]
    generated_at: datetime

    def to_dict(self) -> Dict:
        return {
            "question": self.question_text,  # Keep 'question' in dict for compatibility
            "model": self.model.value,
            "research_type": self.research_type.value,
            "category": self.category,
            "metadata": self.metadata,
            "generated_at": self.generated_at.isoformat()
        }

@dataclass
class SearchParameters:
    source_types: List[str]
    time_range: str
    required_details: List[str]
    quality_filters: List[str]
    min_confidence: float = 0.7

    def to_dict(self) -> Dict:
        return asdict(self)

@dataclass
class ResearchPrompt:
    research_type: ResearchType
    topic: str
    context: str
    questions: List[ResearchQuestion]
    search_params: Dict[str, any]  # Changed from SearchParameters to Dict for flexibility
    generated_at: datetime
    metadata: Dict[str, any]

    def to_dict(self) -> Dict:
        return {
            "research_type": self.research_type.value,
            "topic": self.topic,
            "context": self.context,
            "questions": [q.to_dict() for q in self.questions],
            "search_params": self.search_params,
            "generated_at": self.generated_at.isoformat(),
            "metadata": self.metadata
        }

class DataValidator:
    @staticmethod
    def validate_model_score(score: ModelScore) -> bool:
        """Validate model score data."""
        try:
            if not isinstance(score.score, (int, float)):
                logger.error("Invalid score type")
                return False
            if score.score < 0 or score.score > 1:
                logger.error("Score out of range [0,1]")
                return False
            if score.confidence < 0 or score.confidence > 1:
                logger.error("Confidence out of range [0,1]")
                return False
            return True
        except Exception as e:
            logger.error(f"Validation error for model score: {e}")
            return False

    @staticmethod
    def validate_research_question(question: ResearchQuestion) -> bool:
        """Validate research question data."""
        try:
            if not question.question_text.strip():
                logger.error("Empty question")
                return False
            if not isinstance(question.metadata, dict):
                logger.error("Invalid metadata format")
                return False
            return True
        except Exception as e:
            logger.error(f"Validation error for research question: {e}")
            return False

    @staticmethod
    def validate_research_prompt(prompt: ResearchPrompt) -> bool:
        """Validate research prompt data."""
        try:
            if not prompt.topic.strip():
                logger.error("Empty topic")
                return False
            if not prompt.questions:
                logger.error("No research questions")
                return False
            if not all(DataValidator.validate_research_question(q) for q in prompt.questions):
                logger.error("Invalid research questions")
                return False
            return True
        except Exception as e:
            logger.error(f"Validation error for research prompt: {e}")
            return False

class PipelineError(Exception):
    """Base exception for pipeline errors."""
    pass

class ValidationError(PipelineError):
    """Raised when data validation fails."""
    pass

class ModelSelectionError(PipelineError):
    """Raised when model selection fails."""
    pass

class QuestionGenerationError(PipelineError):
    """Raised when question generation fails."""
    pass

class PromptTransformationError(PipelineError):
    """Raised when prompt transformation fails."""
    pass
