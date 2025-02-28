"""
Test suite for the research pipeline components.
"""
import pytest
from datetime import datetime
from unittest.mock import Mock, patch
import json

from ..pipeline.data_models import (
    ModelType, ResearchType, ModelScore, ResearchQuestion,
    SearchParameters, ResearchPrompt, DataValidator,
    ValidationError, ModelSelectionError
)
from ..pipeline.model_weights import ModelWeightSystem
from ..pipeline.research_questions import ResearchQuestionGenerator
from ..pipeline.prompt_transformer import PromptTransformer

@pytest.fixture
def model_score():
    return ModelScore(
        model_type=ModelType.GPT4,
        score=0.85,
        confidence=0.9,
        timestamp=datetime.now()
    )

@pytest.fixture
def research_question():
    return ResearchQuestion(
        question="What are the technical implications?",
        model=ModelType.GPT4,
        research_type=ResearchType.TECHNICAL,
        category="technical",
        metadata={"priority": "high"},
        generated_at=datetime.now()
    )

@pytest.fixture
def search_params():
    return SearchParameters(
        source_types=["documentation", "papers"],
        time_range="last_5_years",
        required_details=["implementation", "architecture"],
        quality_filters=["verified_source"]
    )

@pytest.fixture
def research_prompt(research_question, search_params):
    return ResearchPrompt(
        research_type=ResearchType.TECHNICAL,
        topic="AI Systems",
        context="Technical analysis of AI systems",
        questions=[research_question],
        search_params=search_params,
        generated_at=datetime.now(),
        metadata={"source": "user_query"}
    )

class TestDataValidation:
    def test_model_score_validation(self, model_score):
        assert DataValidator.validate_model_score(model_score)

        # Test invalid score
        invalid_score = ModelScore(
            model_type=ModelType.GPT4,
            score=1.5,  # Invalid: > 1
            confidence=0.9,
            timestamp=datetime.now()
        )
        assert not DataValidator.validate_model_score(invalid_score)

    def test_research_question_validation(self, research_question):
        assert DataValidator.validate_research_question(research_question)

        # Test empty question
        invalid_question = ResearchQuestion(
            question="",  # Invalid: empty
            model=ModelType.GPT4,
            research_type=ResearchType.TECHNICAL,
            category="technical",
            metadata={},
            generated_at=datetime.now()
        )
        assert not DataValidator.validate_research_question(invalid_question)

    def test_research_prompt_validation(self, research_prompt):
        assert DataValidator.validate_research_prompt(research_prompt)

        # Test empty topic
        invalid_prompt = ResearchPrompt(
            research_type=ResearchType.TECHNICAL,
            topic="",  # Invalid: empty
            context="context",
            questions=research_prompt.questions,
            search_params=research_prompt.search_params,
            generated_at=datetime.now(),
            metadata={}
        )
        assert not DataValidator.validate_research_prompt(invalid_prompt)

class TestModelWeightSystem:
    def test_analyze_topic(self):
        weight_system = ModelWeightSystem()
        topic = "Technical implementation of neural networks"
        
        model, scores = weight_system.analyze_topic(topic)
        assert isinstance(model, str)
        assert isinstance(scores, dict)
        assert model in [m.value for m in ModelType]
        assert all(0 <= score <= 1 for score in scores.values())

    def test_ambiguous_topic_handling(self):
        weight_system = ModelWeightSystem()
        topic = "general discussion"  # Ambiguous topic
        
        model, scores = weight_system.analyze_topic(topic)
        # Should select a fallback model when topic is ambiguous
        assert model in [m.value for m in ModelType]
        # Scores should be relatively close
        score_values = list(scores.values())
        assert max(score_values) - min(score_values) < 0.3

class TestResearchQuestionGenerator:
    def test_question_generation(self):
        generator = ResearchQuestionGenerator()
        topic = "AI Ethics"
        model = ModelType.CLAUDE.value
        
        questions = generator.generate_questions(topic, model)
        assert isinstance(questions, list)
        assert len(questions) > 0
        assert all(isinstance(q, dict) for q in questions)
        assert all("question" in q for q in questions)
        assert all("research_type" in q for q in questions)

    def test_invalid_model_handling(self):
        generator = ResearchQuestionGenerator()
        topic = "AI Ethics"
        invalid_model = "invalid_model"
        
        with pytest.raises(ValueError):
            generator.generate_questions(topic, invalid_model)

class TestPromptTransformer:
    def test_prompt_transformation(self, research_question):
        transformer = PromptTransformer()
        topic = "AI Systems"
        context = "Technical analysis"
        questions = [research_question.to_dict()]
        
        prompts = transformer.transform_questions(topic, questions, context)
        assert isinstance(prompts, dict)
        assert len(prompts) > 0
        assert all(isinstance(p, str) for p in prompts.values())
        assert all(topic in p for p in prompts.values())

    def test_search_parameter_generation(self):
        transformer = PromptTransformer()
        params = transformer._generate_search_params(ResearchType.TECHNICAL.value)
        
        assert isinstance(params, dict)
        assert "source_types" in params
        assert "time_range" in params
        assert "required_details" in params
        assert "quality_filters" in params

if __name__ == "__main__":
    pytest.main([__file__])
