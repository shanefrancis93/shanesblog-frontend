"""
Integration tests for the research pipeline.
"""
import pytest
from pathlib import Path
import json
from datetime import datetime
import asyncio
import logging
from unittest.mock import Mock, patch

from blog_generator.pipeline.model_weights import ModelWeightSystem
from blog_generator.pipeline.research_questions import ResearchQuestionGenerator
from blog_generator.pipeline.o3_interface import O3PromptGenerator
from blog_generator.pipeline.data_models import ResearchPrompt, ResearchType, ModelType

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def run_async(coro):
    """Helper to run async code in sync context."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

class TestModelSelection:
    """Test the model selection and weighting system."""
    
    def test_technical_topic(self):
        """Test model selection for technical topics."""
        logger.info("Starting technical topic test")
        weight_system = ModelWeightSystem()
        model, scores = weight_system.analyze_topic(
            "Technical implementation of distributed AI systems"
        )
        
        assert model == ModelType.GPT4.value
        assert scores["gpt4"] > scores["claude"]
        assert isinstance(scores["gpt4"], float)
        logger.info("Completed technical topic test")
        
    def test_theoretical_topic(self):
        """Test model selection for theoretical topics."""
        logger.info("Starting theoretical topic test")
        weight_system = ModelWeightSystem()
        model, scores = weight_system.analyze_topic(
            "Theoretical frameworks for AI consciousness"
        )
        
        assert model == ModelType.CLAUDE.value
        assert scores["claude"] > scores["gemini"]
        assert isinstance(scores["claude"], float)
        logger.info("Completed theoretical topic test")

class TestQuestionGeneration:
    """Test the research question generation system."""
    
    def test_question_generation(self):
        """Test generating research questions."""
        logger.info("Starting question generation test")
        question_gen = ResearchQuestionGenerator()
        questions = run_async(question_gen.generate_questions(
            "AI System Architecture",
            ModelType.GPT4.value
        ))
        
        assert len(questions) > 0
        for q in questions:
            assert isinstance(q.question_text, str)
            assert q.model == ModelType.GPT4
            assert isinstance(q.research_type, ResearchType)
            assert isinstance(q.metadata, dict)
        logger.info("Completed question generation test")
            
    def test_question_categorization(self):
        """Test question categorization."""
        logger.info("Starting question categorization test")
        question_gen = ResearchQuestionGenerator()
        questions = run_async(question_gen.generate_questions(
            "AI System Architecture",
            ModelType.GPT4.value
        ))
        
        # Verify we have different categories
        categories = {q.category for q in questions}
        assert len(categories) > 1, "Questions should have different categories"
        logger.info("Completed question categorization test")

class TestO3Integration:
    """Test O3 prompt generation and formatting."""
    
    def test_o3_query_generation(self):
        """Test generating O3 queries."""
        logger.info("Starting O3 query generation test")
        o3_gen = O3PromptGenerator()
        question_gen = ResearchQuestionGenerator()
        
        # Create test prompt
        questions = run_async(question_gen.generate_questions(
            "AI System Architecture",
            ModelType.GPT4.value
        ))
        
        test_prompt = ResearchPrompt(
            research_type=ResearchType.TECHNICAL,
            topic="AI System Architecture",
            context="Analysis of modern AI system design patterns",
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
        
        # Generate and verify O3 query
        query = run_async(o3_gen.generate_o3_query(test_prompt))
        formatted_query = run_async(o3_gen.format_query(query))
        
        # Verify structure
        assert "Research Query:" in formatted_query
        assert "Sub-Questions to Investigate:" in formatted_query
        assert "Methodology Requirements:" in formatted_query
        assert "Source Requirements:" in formatted_query
        assert test_prompt.topic in formatted_query
        
        # Verify all questions are included
        for question in questions:
            assert question.question_text in formatted_query
        logger.info("Completed O3 query generation test")
            
    def test_o3_methodology_requirements(self):
        """Test methodology requirements generation."""
        logger.info("Starting O3 methodology requirements test")
        o3_gen = O3PromptGenerator()
        
        technical_methods = o3_gen._get_methodology(ResearchType.TECHNICAL)
        academic_methods = o3_gen._get_methodology(ResearchType.ACADEMIC)
        trend_methods = o3_gen._get_methodology(ResearchType.TREND)
        
        # Verify each type has unique requirements
        assert set(technical_methods) != set(academic_methods)
        assert set(academic_methods) != set(trend_methods)
        assert set(technical_methods) != set(trend_methods)
        
        # Verify common methodology elements
        for methods in [technical_methods, academic_methods, trend_methods]:
            assert any("sources" in m.lower() for m in methods)
            assert any("analysis" in m.lower() for m in methods)
        logger.info("Completed O3 methodology requirements test")

class TestErrorHandling:
    """Test error handling across the pipeline."""
    
    def test_invalid_model_type(self):
        """Test handling of invalid model types."""
        logger.info("Starting invalid model type test")
        question_gen = ResearchQuestionGenerator()
        with pytest.raises(ValueError):
            run_async(question_gen.generate_questions("Test Topic", "invalid_model"))
        logger.info("Completed invalid model type test")
            
    def test_empty_topic(self):
        """Test handling of empty topics."""
        logger.info("Starting empty topic test")
        weight_system = ModelWeightSystem()
        model, scores = weight_system.analyze_topic("")
        assert model == ModelType.FALLBACK.value
        logger.info("Completed empty topic test")
        
    def test_invalid_research_type(self):
        """Test handling of invalid research types."""
        logger.info("Starting invalid research type test")
        o3_gen = O3PromptGenerator()
        with pytest.raises(Exception):
            o3_gen._get_methodology("invalid_type")
        logger.info("Completed invalid research type test")
