"""
Test suite for the reborn model coordinator.
Tests both individual components and full integration.
"""

import pytest
from unittest.mock import Mock, patch
import numpy as np
from sentence_transformers import SentenceTransformer
import sys
from pathlib import Path
import asyncio

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from model_coordinator_REBORN import (
    ModelCoordinator,
    ModelConfig,
    AssignmentConfig,
    ModelAssignment,
    CONTENT_INDICATORS
)

# Test configurations
@pytest.fixture
def test_models():
    return {
        "gpt4": ModelConfig(
            primary_strength="technical",
            secondary_strengths=["contextual"],
            supported_sections=["technical", "contextual", "subtextual"],
            token_limit=8000,
            cost_per_token=0.01
        ),
        "claude": ModelConfig(
            primary_strength="contextual",
            secondary_strengths=["subtextual"],
            supported_sections=["technical", "contextual", "subtextual"],
            token_limit=12000,
            cost_per_token=0.008
        ),
        "gemini": ModelConfig(
            primary_strength="subtextual",
            secondary_strengths=["technical"],
            supported_sections=["technical", "contextual", "subtextual"],
            token_limit=10000,
            cost_per_token=0.005
        )
    }

@pytest.fixture
def test_config():
    return AssignmentConfig(
        primary_weight=1.0,
        secondary_weight=0.7,
        base_weight=0.5,
        min_confidence=0.3,
        max_sections_per_model=2,
        semantic_weight=0.4,
        keyword_weight=0.6
    )

@pytest.fixture
def coordinator(test_models, test_config):
    return ModelCoordinator(test_models, test_config)

# Test messages with different characteristics
@pytest.fixture
def technical_message():
    return [{
        "content": """
        The algorithm implements a distributed consensus protocol using Byzantine fault tolerance.
        System architecture includes redundant data structures for efficient processing.
        Technical implementation details focus on optimization and performance metrics.
        """
    }]

@pytest.fixture
def contextual_message():
    return [{
        "content": """
        Historical development of the pattern shows evolution over time.
        Background context reveals important relationships between components.
        Understanding the history helps explain current design choices.
        """
    }]

@pytest.fixture
def mixed_message():
    return [{
        "content": """
        The system architecture implements advanced algorithms.
        Historical context shows how the pattern evolved.
        Cultural implications suggest important perspectives.
        """
    }]

# Test content analysis
def test_content_analysis(coordinator, technical_message):
    """Test content characteristic analysis"""
    text = technical_message[0]["content"]
    characteristics = coordinator._analyze_content_characteristics(text)
    
    assert "technical_score" in characteristics
    assert characteristics["technical_score"] > characteristics["contextual_score"]
    assert characteristics["technical_score"] > characteristics["subtextual_score"]
    assert all(0 <= score <= 1 for score in characteristics.values())

def test_section_importance(coordinator, technical_message):
    """Test section importance calculation"""
    text = technical_message[0]["content"]
    characteristics = coordinator._analyze_content_characteristics(text)
    importance = coordinator._calculate_section_importance(characteristics)
    
    assert "technical" in importance
    assert importance["technical"] > importance["contextual"]
    assert all(0 <= score <= 1 for score in importance.values())

# Test confidence calculation
def test_confidence_calculation(coordinator):
    """Test confidence score calculation"""
    content_profile = {
        "technical_score": 0.8,
        "contextual_score": 0.4,
        "subtextual_score": 0.3
    }
    
    # Test primary strength
    score, reasoning = coordinator._calculate_confidence(
        "gpt4", "technical", content_profile, 0
    )
    assert score > 0.5  # Should be significant for primary strength
    assert "Primary strength" in reasoning
    
    # Test secondary strength
    score, reasoning = coordinator._calculate_confidence(
        "gpt4", "contextual", content_profile, 0
    )
    assert 0.3 < score < 0.8  # Should be moderate for secondary strength
    assert "Secondary strength" in reasoning
    
    # Test base capability
    score, reasoning = coordinator._calculate_confidence(
        "gpt4", "subtextual", content_profile, 0
    )
    assert score < 0.6  # Should be lower for base capability
    assert "Base capability" in reasoning

# Test assignment logic
@pytest.mark.asyncio
async def test_technical_content_assignment(coordinator, technical_message):
    """Test assignments for technical content"""
    assignments = await coordinator.analyze_content(technical_message)
    
    # Verify GPT-4 gets technical section
    gpt4_assignments = assignments["gpt4"]
    assert any(a.section_type == "technical" for a in gpt4_assignments)
    
    # Verify confidence scores
    for model, model_assignments in assignments.items():
        for assignment in model_assignments:
            assert assignment.confidence_score >= coordinator.config.min_confidence
            assert assignment.reasoning

@pytest.mark.asyncio
async def test_contextual_content_assignment(coordinator, contextual_message):
    """Test assignments for contextual content"""
    assignments = await coordinator.analyze_content(contextual_message)
    
    # Verify Claude gets contextual section
    claude_assignments = assignments["claude"]
    assert any(a.section_type == "contextual" for a in claude_assignments)

@pytest.mark.asyncio
async def test_mixed_content_assignment(coordinator, mixed_message):
    """Test assignments for mixed content"""
    assignments = await coordinator.analyze_content(mixed_message)
    
    # Verify each model gets appropriate sections
    for model, model_assignments in assignments.items():
        assert len(model_assignments) <= coordinator.config.max_sections_per_model
        
        # Check primary strengths are prioritized
        primary = coordinator.models[model].primary_strength
        if any(a.section_type == primary for a in model_assignments):
            primary_assignment = next(
                a for a in model_assignments if a.section_type == primary
            )
            assert primary_assignment.confidence_score >= coordinator.config.min_confidence

# Test workload balancing
@pytest.mark.asyncio
async def test_workload_balancing(coordinator, mixed_message):
    """Test workload balancing across models"""
    assignments = await coordinator.analyze_content(mixed_message)
    
    # Check assignment distribution
    assignment_counts = {
        model: len(model_assignments)
        for model, model_assignments in assignments.items()
    }
    
    # No model should have more than max_sections
    assert all(
        count <= coordinator.config.max_sections_per_model
        for count in assignment_counts.values()
    )
    
    # At least one assignment per model if possible
    total_sections = sum(assignment_counts.values())
    if total_sections >= len(coordinator.models):
        assert all(count > 0 for count in assignment_counts.values())

# Test prompt generation
def test_prompt_generation(coordinator):
    """Test section-specific prompt generation"""
    # Test primary strength prompt
    prompt = coordinator.get_section_prompt("gpt4", "technical")
    assert "primary strength" in prompt.lower()
    assert "technical" in prompt.lower()
    
    # Test secondary strength prompt
    prompt = coordinator.get_section_prompt("gpt4", "contextual")
    assert "secondary strength" in prompt.lower()
    assert "contextual" in prompt.lower()
    
    # Test base capability prompt
    prompt = coordinator.get_section_prompt("gpt4", "subtextual")
    assert "capabilities" in prompt.lower()
    assert "subtextual" in prompt.lower()
