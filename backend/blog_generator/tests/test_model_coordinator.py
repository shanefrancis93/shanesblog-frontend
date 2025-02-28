"""
Test suite for model coordinator functionality.
Tests content analysis, model assignment, and prompt generation.
"""

import sys
from pathlib import Path
import asyncio
import pytest
from pprint import pprint

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from model_coordinator import ModelCoordinator
from usermessages import MessageProcessor, Message

# Test data
TECHNICAL_TEXT = """The algorithm's complexity is O(n log n) due to the divide-and-conquer approach. 
We need to consider memory overhead and CPU utilization when implementing distributed system architecture.
The data structures were chosen to optimize for quick lookups while maintaining reasonable space complexity.
Our technical implementation uses advanced algorithms and data structures to achieve optimal performance metrics.
The system architecture follows established patterns for distributed computing and parallel processing."""

CONTEXTUAL_TEXT = """Throughout history, these patterns have emerged repeatedly in different societies.
The current trends can be traced back to the industrial revolution, showing how technological advancement
shapes social structures. When we examine the broader context, we see interconnected relationships between
economic systems, cultural values, and technological progress. Previously, similar developments led to 
significant societal changes. The evolution of these patterns over time reveals consistent cycles of transformation."""

SUBTEXTUAL_TEXT = """The underlying cultural assumptions reveal deep-seated biases in how we approach this problem.
There's an implicit power dynamic at play that influences decision-making processes. The emotional resonance of 
these choices reflects broader societal values and unspoken norms. Cultural practices and traditions subtly shape
our perspectives, while social norms and beliefs create unstated expectations that impact behavior."""

@pytest.fixture
def coordinator():
    return ModelCoordinator()

@pytest.fixture
def message_processor():
    return MessageProcessor()

def test_content_analysis(coordinator, message_processor):
    """Test content characteristic analysis"""
    print("\n=== Testing Content Analysis ===")
    
    # Create test messages directly
    tech_messages = [{"content": TECHNICAL_TEXT}]
    context_messages = [{"content": CONTEXTUAL_TEXT}]
    subtext_messages = [{"content": SUBTEXTUAL_TEXT}]
    
    # Analyze each type
    async def run_analysis():
        tech_profile = await coordinator._analyze_content_characteristics(tech_messages)
        context_profile = await coordinator._analyze_content_characteristics(context_messages)
        subtext_profile = await coordinator._analyze_content_characteristics(subtext_messages)
        
        print("\nTechnical Content Profile:")
        pprint(tech_profile)
        print("\nContextual Content Profile:")
        pprint(context_profile)
        print("\nSubtextual Content Profile:")
        pprint(subtext_profile)
        
        # Verify relative scores
        assert tech_profile["technical_complexity"] > tech_profile["subtextual_richness"], \
            "Technical content should score higher on technical_complexity"
        assert context_profile["contextual_depth"] > context_profile["technical_complexity"], \
            "Contextual content should score higher on contextual_depth"
        assert subtext_profile["subtextual_richness"] > subtext_profile["technical_complexity"], \
            "Subtextual content should score higher on subtextual_richness"
        
        return tech_profile, context_profile, subtext_profile
    
    return asyncio.run(run_analysis())

def test_model_assignment(coordinator, message_processor):
    """Test section assignment to models"""
    print("\n=== Testing Model Assignment ===")
    
    # Create combined test messages
    messages = [
        {"content": TECHNICAL_TEXT},
        {"content": CONTEXTUAL_TEXT},
        {"content": SUBTEXTUAL_TEXT}
    ]
    
    async def run_assignment():
        assignments = await coordinator.analyze_content(messages)
        
        print("\nModel Assignments:")
        for model, sections in assignments.items():
            print(f"\n{model} assignments:")
            for section in sections:
                print(f"- {section.section_type} (confidence: {section.confidence_score:.2f})")
                
        # Verify each model got appropriate assignments
        for model, sections in assignments.items():
            assert len(sections) > 0, f"Model {model} received no assignments"
            
            # Check if models got their preferred sections
            model_config = coordinator.models[model].config
            primary_strength = model_config["primary_strength"]
            
            # At least one assignment should match primary strength
            strength_assignments = [
                s for s in sections 
                if s.section_type == primary_strength
            ]
            assert len(strength_assignments) > 0, \
                f"Model {model} didn't get assignments matching its strength {primary_strength}"
        
        return assignments
    
    return asyncio.run(run_assignment())

def test_prompt_generation(coordinator):
    """Test section-specific prompt generation"""
    print("\n=== Testing Prompt Generation ===")
    
    # Test prompt generation for each model and section type
    for model_name, profile in coordinator.models.items():
        print(f"\nTesting prompts for {model_name}:")
        
        for section_type in profile.config["supported_sections"]:
            prompt = coordinator.get_section_prompt(model_name, section_type)
            
            print(f"\n{section_type} section prompt preview:")
            print(prompt[:200] + "...")  # Show first 200 chars
            
            # Verify prompt customization
            assert profile.config["primary_strength"] in prompt, \
                f"Primary strength not in {section_type} prompt"
            assert section_type in prompt, \
                f"Section type not in {section_type} prompt"

if __name__ == "__main__":
    # Run tests
    coordinator = ModelCoordinator()
    processor = MessageProcessor()
    
    print("Running Model Coordinator Tests...")
    
    try:
        content_profiles = test_content_analysis(coordinator, processor)
        assignments = test_model_assignment(coordinator, processor)
        test_prompt_generation(coordinator)
        print("\n✅ All tests passed!")
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {str(e)}")
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
