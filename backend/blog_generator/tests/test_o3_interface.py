"""
Test suite for O3 interface and prompt generation.
"""
import pytest
from datetime import datetime
from ..pipeline.o3_interface import O3PromptGenerator, O3Query
from ..pipeline.data_models import ResearchPrompt, ResearchQuestion, ResearchType, ModelType

@pytest.fixture
def research_prompt():
    """Create a sample research prompt for testing."""
    return ResearchPrompt(
        research_type=ResearchType.TECHNICAL,
        topic="AI System Architecture",
        context="Analyzing modern AI system architectures and implementation patterns",
        questions=[
            ResearchQuestion(
                question="What are the key components of scalable AI architectures?",
                model=ModelType.GPT4,
                research_type=ResearchType.TECHNICAL,
                category="technical",
                metadata={"priority": "high"},
                generated_at=datetime.now()
            ),
            ResearchQuestion(
                question="How do different AI frameworks handle distributed computing?",
                model=ModelType.GPT4,
                research_type=ResearchType.TECHNICAL,
                category="technical",
                metadata={"priority": "medium"},
                generated_at=datetime.now()
            )
        ],
        search_params={
            "source_types": ["documentation", "papers"],
            "time_range": "last_5_years",
            "required_details": ["implementation", "architecture"],
            "quality_filters": ["verified_source"]
        },
        generated_at=datetime.now(),
        metadata={"source": "user_query"}
    )

@pytest.fixture
def o3_generator():
    """Create O3PromptGenerator instance."""
    return O3PromptGenerator()

class TestO3Interface:
    def test_query_generation(self, o3_generator, research_prompt):
        """Test basic query generation."""
        query = o3_generator.generate_o3_query(research_prompt)
        
        assert isinstance(query, O3Query)
        assert research_prompt.topic in query.main_query
        assert len(query.sub_questions) == len(research_prompt.questions)
        assert query.context == research_prompt.context
        assert len(query.methodology_requirements) > 0
        assert len(query.source_requirements) > 0
        assert isinstance(query.output_format, dict)
        assert isinstance(query.metadata, dict)

    def test_methodology_requirements(self, o3_generator):
        """Test methodology requirements for different research types."""
        for research_type in ResearchType:
            methodology = o3_generator._get_methodology(research_type)
            assert isinstance(methodology, list)
            assert len(methodology) > 0
            # Should include both type-specific and default methodology
            assert len(methodology) >= len(o3_generator.default_methodology)

    def test_source_requirements(self, o3_generator):
        """Test source requirements for different research types."""
        for research_type in ResearchType:
            sources = o3_generator._get_source_requirements(research_type)
            assert isinstance(sources, list)
            assert len(sources) > 0
            # Should include both type-specific and default sources
            assert len(sources) >= len(o3_generator.default_sources)

    def test_output_format(self, o3_generator):
        """Test output format requirements for different research types."""
        for research_type in ResearchType:
            format_reqs = o3_generator._get_output_format(research_type)
            assert isinstance(format_reqs, dict)
            # Should include all default format keys
            assert all(key in format_reqs for key in o3_generator.default_format.keys())

    def test_query_formatting(self, o3_generator, research_prompt):
        """Test query formatting into template."""
        query = o3_generator.generate_o3_query(research_prompt)
        formatted = o3_generator.format_query(query)
        
        assert isinstance(formatted, str)
        assert query.main_query in formatted
        assert research_prompt.context in formatted
        assert all(q in formatted for q in query.sub_questions)
        assert "Overview:" in formatted
        assert "Research Query:" in formatted
        assert "Required Output Structure:" in formatted

    def test_error_handling(self, o3_generator):
        """Test error handling for invalid inputs."""
        with pytest.raises(Exception):
            o3_generator.generate_o3_query(None)
            
        with pytest.raises(Exception):
            o3_generator.format_query(None)

if __name__ == "__main__":
    pytest.main([__file__])
