"""
Tests for the new pipeline components.
"""
import pytest
from datetime import datetime
import json
from pathlib import Path

from blog_generator.pipeline.data_models import (
    ModelType, ResearchType, ModelScore, ResearchQuestion,
    SearchParameters, ResearchPrompt, DataValidator
)
from blog_generator.pipeline.model_weights import ModelWeightSystem
from blog_generator.pipeline.research_questions import ResearchQuestionGenerator
from blog_generator.pipeline.o3_interface import O3PromptGenerator, O3Query
from blog_generator.pipeline.prompt_transformer import PromptTransformer

# Sample test data
SAMPLE_TOPIC = "AI System Architecture and Implementation"
SAMPLE_CONTEXT = """
Analysis of modern AI system architectures focusing on:
1. Scalability considerations
2. Performance optimization
3. Integration patterns
"""

class TestDataModels:
    """Test data model validation and conversion."""
    
    def test_model_score_validation(self):
        """Test ModelScore validation."""
        valid_score = ModelScore(
            model_type=ModelType.GPT4,
            score=0.85,
            confidence=0.9,
            timestamp=datetime.now()
        )
        assert DataValidator.validate_model_score(valid_score)
        
        invalid_score = ModelScore(
            model_type=ModelType.GPT4,
            score=1.5,  # Invalid: > 1
            confidence=0.9,
            timestamp=datetime.now()
        )
        assert not DataValidator.validate_model_score(invalid_score)
    
    def test_research_question_validation(self):
        """Test ResearchQuestion validation."""
        valid_question = ResearchQuestion(
            question_text="What are the key components?",
            model=ModelType.GPT4,
            research_type=ResearchType.TECHNICAL,
            category="technical",
            metadata={"priority": "high"},
            generated_at=datetime.now()
        )
        assert DataValidator.validate_research_question(valid_question)
        
        invalid_question = ResearchQuestion(
            question_text="",  # Invalid: empty
            model=ModelType.GPT4,
            research_type=ResearchType.TECHNICAL,
            category="technical",
            metadata={"priority": "high"},
            generated_at=datetime.now()
        )
        assert not DataValidator.validate_research_question(invalid_question)

class TestModelWeights:
    """Test model selection and weighting system."""
    
    def test_technical_topic_weighting(self):
        """Test weights for technical topics."""
        weight_system = ModelWeightSystem()
        model, scores = weight_system.analyze_topic(
            "Technical implementation details of distributed systems"
        )
        
        assert model == ModelType.GPT4.value
        assert scores["gpt4"] > scores["claude"]
        assert isinstance(scores["gpt4"], float)
    
    def test_theoretical_topic_weighting(self):
        """Test weights for theoretical topics."""
        weight_system = ModelWeightSystem()
        model, scores = weight_system.analyze_topic(
            "Theoretical foundations of AI consciousness"
        )
        
        assert model == ModelType.CLAUDE.value
        assert scores["claude"] > scores["gemini"]
        assert isinstance(scores["claude"], float)

class TestResearchQuestions:
    """Test research question generation."""
    
    def test_question_generation(self):
        """Test generating research questions."""
        generator = ResearchQuestionGenerator()
        questions = generator.generate_questions(
            SAMPLE_TOPIC,
            ModelType.GPT4.value
        )
        
        assert len(questions) > 0
        for q in questions:
            assert isinstance(q.question_text, str)
            assert q.model == ModelType.GPT4
            assert isinstance(q.research_type, ResearchType)
            assert isinstance(q.metadata, dict)
    
    def test_question_categories(self):
        """Test question categorization."""
        generator = ResearchQuestionGenerator()
        questions = generator.generate_questions(
            SAMPLE_TOPIC,
            ModelType.GPT4.value
        )
        
        categories = {q.category for q in questions}
        assert len(categories) > 1
        assert "technical" in categories

class TestO3Interface:
    """Test O3 interface and query generation."""
    
    def test_o3_query_generation(self):
        """Test generating O3 queries."""
        generator = ResearchQuestionGenerator()
        o3_gen = O3PromptGenerator()
        
        # Generate questions
        questions = generator.generate_questions(
            SAMPLE_TOPIC,
            ModelType.GPT4.value
        )
        
        # Create research prompt
        prompt = ResearchPrompt(
            research_type=ResearchType.TECHNICAL,
            topic=SAMPLE_TOPIC,
            context=SAMPLE_CONTEXT,
            questions=questions,
            search_params={
                "source_types": ["documentation", "papers"],
                "time_range": "last_5_years",
                "required_details": ["implementation", "architecture"],
                "quality_filters": ["verified_source"]
            },
            generated_at=datetime.now(),
            metadata={"test": True}
        )
        
        # Generate O3 query
        query = o3_gen.generate_o3_query(prompt)
        formatted_query = o3_gen.format_query(query)
        
        # Verify structure
        assert isinstance(query, O3Query)
        assert SAMPLE_TOPIC in formatted_query
        assert "Research Query:" in formatted_query
        assert "Methodology Requirements:" in formatted_query
        assert "Source Requirements:" in formatted_query
        
        # Verify questions
        for question in questions:
            assert question.question_text in formatted_query
    
    def test_methodology_requirements(self):
        """Test methodology requirements generation."""
        o3_gen = O3PromptGenerator()
        
        technical = o3_gen._get_methodology(ResearchType.TECHNICAL)
        academic = o3_gen._get_methodology(ResearchType.ACADEMIC)
        trend = o3_gen._get_methodology(ResearchType.TREND)
        
        # Verify unique requirements
        assert set(technical) != set(academic)
        assert set(academic) != set(trend)
        
        # Verify common elements
        for methods in [technical, academic, trend]:
            assert any("sources" in m.lower() for m in methods)
            assert any("analysis" in m.lower() for m in methods)

class TestPromptTransformer:
    """Test prompt transformation and formatting."""
    
    def test_prompt_transformation(self):
        """Test transforming research questions into prompts."""
        transformer = PromptTransformer()
        generator = ResearchQuestionGenerator()
        
        # Generate questions
        questions = generator.generate_questions(
            SAMPLE_TOPIC,
            ModelType.GPT4.value
        )
        
        # Transform questions
        prompts = transformer.transform_questions(
            SAMPLE_TOPIC,
            [q.to_dict() for q in questions],
            SAMPLE_CONTEXT
        )
        
        assert isinstance(prompts, dict)
        assert len(prompts) > 0
        
        # Verify prompt structure
        for prompt_type, prompt in prompts.items():
            assert SAMPLE_TOPIC in prompt
            assert isinstance(prompt, str)
            assert "Research Context" in prompt
            assert "Required Information Types" in prompt
