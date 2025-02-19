"""
Configuration management for the blog generator pipeline.
Centralizes all configurable parameters and paths.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from typing import Dict, Any

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

# Base paths
BASE_DIR = Path(__file__).parent
RESEARCH_PROMPTS_DIR = BASE_DIR / "research_prompts"
PROCESSED_TEXT_DIR = BASE_DIR / "processed_text"
RAW_TEXT_DIR = BASE_DIR / "raw_text"
VECTOR_DB_DIR = BASE_DIR / "vector_db"

# Ensure directories exist
for dir_path in [RESEARCH_PROMPTS_DIR, PROCESSED_TEXT_DIR, RAW_TEXT_DIR, VECTOR_DB_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)

# Model configurations
MODEL_CONFIGS = {
    "claude": {
        "name": "claude-3-opus-20240229",
        "max_tokens": 4096,
        "temperature": 0.7,
        "primary_strength": "subtextual",
        "secondary_strengths": ["context", "technical"],
        "supported_sections": ["subtextual", "core_analysis", "long_context", "recommendations"],
        "description": "Specialized in nuanced understanding and cultural analysis"
    },
    "gpt4": {
        "name": "gpt-4-turbo-preview",
        "max_tokens": 4096,
        "temperature": 0.7,
        "primary_strength": "technical",
        "secondary_strengths": ["subtextual", "context"],
        "supported_sections": ["technical", "core_analysis", "emerging_trends", "recommendations"],
        "description": "Excels at technical analysis and structured reasoning"
    },
    "gemini": {
        "name": "gemini-pro",
        "max_tokens": 4096,
        "temperature": 0.7,
        "primary_strength": "context",
        "secondary_strengths": ["technical", "subtextual"],
        "supported_sections": ["long_context", "core_analysis", "emerging_trends", "recommendations"],
        "description": "Strong at synthesizing broad context and patterns"
    }
}

# Section configurations
SECTION_CONFIGS = {
    "core_analysis": {
        "token_budget": 2000,
        "required_elements": ["context", "key_points", "implications"],
        "description": "Foundation analysis establishing core concepts and context"
    },
    "long_context": {
        "token_budget": 3000,
        "required_elements": ["historical_context", "patterns", "trends"],
        "description": "Deep dive into historical and broader contextual factors"
    },
    "subtextual": {
        "token_budget": 2000,
        "required_elements": ["cultural_factors", "implicit_biases", "underlying_themes"],
        "description": "Analysis of subtle, implicit, and cultural dimensions"
    },
    "technical": {
        "token_budget": 2500,
        "required_elements": ["methodology", "data_points", "technical_details"],
        "description": "Technical deep-dive with precise analysis"
    },
    "emerging_trends": {
        "token_budget": 2000,
        "required_elements": ["current_trends", "future_projections", "key_drivers"],
        "description": "Analysis of emerging patterns and future directions"
    },
    "recommendations": {
        "token_budget": 1500,
        "required_elements": ["action_items", "justification", "implementation"],
        "description": "Actionable insights and recommendations"
    }
}

# Vector store configurations
VECTOR_STORE_CONFIG = {
    "embedding_model": "text-embedding-ada-002",
    "similarity_threshold": 0.7,
    "chunk_size": 1000,
    "chunk_overlap": 200
}

# Quality metric weights
QUALITY_METRICS = {
    "novelty_weight": 0.4,
    "coherence_weight": 0.6,
    "minimum_quality_score": 0.7
}

# RAGFlow configuration
RAGFLOW_CONFIG = {
    "api_key": "ragflow-FlN2VlNjcyZWU1ZDExZWY4ZTI5MDI0Mm",
    "base_url": "http://localhost:9380",
    "similarity_threshold": 0.2,
    "top_k": 5
}

# LLM API configurations
LLM_CONFIGS = {
    "openai": {
        "api_key": os.getenv("OPENAI_API_KEY"),
        "config": MODEL_CONFIGS["gpt4"]
    },
    "anthropic": {
        "api_key": os.getenv("ANTHROPIC_API_KEY"),
        "config": MODEL_CONFIGS["claude"]
    },
    "google": {
        "api_key": os.getenv("GEMINI_API_KEY"),
        "config": MODEL_CONFIGS["gemini"]
    }
}

# Validate required environment variables
required_env_vars = {
    "OPENAI_API_KEY": "OpenAI API key for GPT-4",
    "ANTHROPIC_API_KEY": "Anthropic API key for Claude",
    "GEMINI_API_KEY": "Google API key for Gemini",
    "RAGFLOW_API_KEY": "RAGFlow API key"
}

missing_vars = [var for var, desc in required_env_vars.items() if not os.getenv(var)]
if missing_vars:
    raise EnvironmentError(
        "Missing required environment variables:\n" +
        "\n".join(f"- {var}: {required_env_vars[var]}" for var in missing_vars)
    )

# Prompt templates
PROMPT_TEMPLATES = {
    "model_assessment": """
    Analyze the provided content and assess which sections you would be best suited to handle.
    Consider:
    1. Technical complexity
    2. Need for subtextual analysis
    3. Requirement for deep contextual understanding
    
    Rate your confidence (0-1) for each section type and explain your reasoning.
    """,
    
    "deep_research": """
    Generate a comprehensive research section based on the provided content.
    Focus on producing high-quality, well-structured analysis that:
    1. Maintains consistent depth and rigor
    2. Supports claims with evidence
    3. Considers multiple perspectives
    4. Connects ideas coherently
    
    Structure your response to include all required elements while staying within the token budget.
    """
}

def get_model_config(model_name: str) -> Dict[str, Any]:
    """Get configuration for specified model"""
    return MODEL_CONFIGS.get(model_name, {})

def get_section_config(section_type: str) -> Dict[str, Any]:
    """Get configuration for specified section type"""
    return SECTION_CONFIGS.get(section_type, {})

def get_prompt_template(template_name: str) -> str:
    """Get prompt template by name"""
    return PROMPT_TEMPLATES.get(template_name, "")
