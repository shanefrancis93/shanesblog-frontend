"""
Test suite for the research generator implementation.
"""
import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timezone
from pathlib import Path

from ..research_generator import ResearchGenerator, ResearchSection, ResearchOutput
from ..model_coordinator_REBORN import ModelCoordinator

@pytest.fixture
def mock_openai():
    with patch("openai.Client") as mock:
        client = MagicMock()
        client.chat.completions.create = AsyncMock()
        mock.return_value = client
        yield mock

@pytest.fixture
def mock_anthropic():
    with patch("anthropic.Anthropic") as mock:
        client = MagicMock()
        client.messages.create = AsyncMock()
        mock.return_value = client
        yield mock

@pytest.fixture
def mock_genai():
    with patch("google.generativeai") as mock:
        model = MagicMock()
        model.generate_content = AsyncMock()
        mock.GenerativeModel.return_value = model
        yield mock

@pytest.fixture
def mock_vector_store():
    with patch("vector_store.VectorStore") as mock:
        store = MagicMock()
        store.add_document = AsyncMock()
        mock.return_value = store
        yield mock

@pytest.fixture
def research_generator(mock_openai, mock_anthropic, mock_genai, mock_vector_store):
    with patch.dict("os.environ", {
        "OPENAI_API_KEY": "test-key",
        "ANTHROPIC_API_KEY": "test-key",
        "GEMINI_API_KEY": "test-key"
    }):
        return ResearchGenerator()

@pytest.mark.asyncio
async def test_generate_section_gpt4(research_generator, mock_openai):
    """Test GPT-4 section generation"""
    mock_response = MagicMock()
    mock_response.choices[0].message.content = json.dumps({
        "type": "technical",
        "model": "gpt-4",
        "content": {"analysis": "test"}
    })
    research_generator.openai_client.chat.completions.create.return_value = mock_response

    result = await research_generator._generate_section(
        prompt="Test prompt",
        model="gpt-4",
        section_type="technical",
        context={"test": "data"}
    )

    assert result["type"] == "technical"
    assert result["model"] == "gpt-4"
    assert "content" in result

@pytest.mark.asyncio
async def test_generate_section_claude(research_generator, mock_anthropic):
    """Test Claude section generation"""
    mock_response = MagicMock()
    mock_response.content = [MagicMock(text=json.dumps({
        "type": "contextual",
        "model": "claude",
        "content": {"analysis": "test"}
    }))]
    research_generator.anthropic_client.messages.create.return_value = mock_response

    result = await research_generator._generate_section(
        prompt="Test prompt",
        model="claude",
        section_type="contextual",
        context={"test": "data"}
    )

    assert result["type"] == "contextual"
    assert result["model"] == "claude"
    assert "content" in result

@pytest.mark.asyncio
async def test_generate_research_flow(research_generator):
    """Test the complete research generation flow"""
    # Mock coordinator responses
    research_generator.coordinator.analyze_content = AsyncMock(return_value={
        "gpt-4": ["technical"],
        "claude": ["contextual"],
        "gemini": ["subtextual"]
    })
    research_generator.coordinator.get_section_prompt = MagicMock(return_value="test prompt")
    research_generator.coordinator.get_summary_prompt = MagicMock(return_value="summary prompt")
    research_generator.coordinator.get_synthesis_prompt = MagicMock(return_value="synthesis prompt")

    # Mock section generation
    async def mock_generate_section(*args, **kwargs):
        return {
            "type": kwargs["section_type"],
            "model": kwargs["model"],
            "content": {"analysis": "test"},
            "cross_references": []
        }
    research_generator._generate_section = mock_generate_section

    # Test research generation
    result = await research_generator.generate_research(
        topic="Test Topic",
        messages=[{"role": "user", "content": "test"}]
    )

    assert isinstance(result, ResearchOutput)
    assert len(result.sections) == 3
    assert "technical" in [s.type for s in result.sections]
    assert "contextual" in [s.type for s in result.sections]
    assert "subtextual" in [s.type for s in result.sections]
    assert result.metadata["topic"] == "Test Topic"
    assert isinstance(result.metadata["timestamp"], str)

@pytest.mark.asyncio
async def test_vector_store_integration(research_generator, mock_vector_store):
    """Test vector store document storage"""
    # Mock section generation
    research_generator.coordinator.analyze_content = AsyncMock(return_value={
        "gpt-4": ["technical"]
    })
    research_generator.coordinator.get_section_prompt = MagicMock(return_value="test prompt")
    research_generator.coordinator.get_summary_prompt = MagicMock(return_value="summary prompt")
    research_generator.coordinator.get_synthesis_prompt = MagicMock(return_value="synthesis prompt")

    async def mock_generate_section(*args, **kwargs):
        return {
            "type": "technical",
            "model": "gpt-4",
            "content": {"analysis": "test"},
            "cross_references": []
        }
    research_generator._generate_section = mock_generate_section

    await research_generator.generate_research(
        topic="Test Topic",
        messages=[{"role": "user", "content": "test"}]
    )

    # Verify vector store interaction
    assert research_generator.vector_store.add_document.called
    call_args = research_generator.vector_store.add_document.call_args[0][0]
    assert call_args.metadata["type"] == "technical"
    assert call_args.metadata["model"] == "gpt-4"
    assert call_args.metadata["topic"] == "Test Topic"
