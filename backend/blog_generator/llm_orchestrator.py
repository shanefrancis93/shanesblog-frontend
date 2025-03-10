"""
LLM Orchestrator for Blog Generation
Manages multiple LLM APIs (ChatGPT, Claude, Gemini)
"""

import os
from typing import List, Dict, Any, Optional
from enum import Enum
from dataclasses import dataclass
import asyncio
import google.generativeai as genai
from anthropic import Anthropic
import openai
import logging

logger = logging.getLogger(__name__)

class LLMType(Enum):
    """Supported LLM types"""
    CHATGPT = "chatgpt"
    CLAUDE = "claude"
    GEMINI = "gemini"

@dataclass
class LLMConfig:
    """Configuration for an LLM"""
    model_name: str
    temperature: float = 0.7
    top_p: float = 0.9
    max_tokens: int = 2000

class LLMOrchestrator:
    """Orchestrates multiple LLMs for blog generation"""
    
    def __init__(self, llm_configs: Dict[str, Dict[str, Any]]):
        """
        Initialize the orchestrator with LLM configurations
        
        Args:
            llm_configs: Dict containing API keys and configurations for each LLM
        """
        # Initialize OpenAI
        openai.api_key = llm_configs.get("openai", {}).get("api_key")
        self.openai_config = LLMConfig(**llm_configs.get("openai", {}).get("config", {}))
        
        # Initialize Anthropic
        self.anthropic_client = Anthropic(api_key=llm_configs.get("anthropic", {}).get("api_key"))
        self.anthropic_config = LLMConfig(**llm_configs.get("anthropic", {}).get("config", {}))
        
        # Initialize Gemini
        genai.configure(api_key=llm_configs.get("google", {}).get("api_key"))
        self.gemini_config = LLMConfig(**llm_configs.get("google", {}).get("config", {}))

    async def generate_with_chatgpt(self, prompt: str, context: str) -> str:
        """Generate content using ChatGPT"""
        config = self.openai_config
        try:
            messages = [
                {"role": "system", "content": "You are a professional blog writer with expertise in technology and AI."},
                {"role": "user", "content": f"Context:\n{context}\n\nPrompt:\n{prompt}"}
            ]
            
            response = await asyncio.to_thread(
                openai.chat.completions.create,
                model=config.model_name,
                messages=messages,
                temperature=config.temperature,
                max_tokens=config.max_tokens
            )
            
            content = response.choices[0].message.content
            return f"{content}\n\n_(Generated by ChatGPT)_"
        except Exception as e:
            logger.error(f"ChatGPT error: {str(e)}")
            return ""

    async def generate_with_claude(self, prompt: str, context: str) -> str:
        """Generate content using Claude"""
        config = self.anthropic_config
        try:
            messages = [
                {
                    "role": "assistant",
                    "content": "I am a professional blog writer with expertise in technology and AI."
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nPrompt:\n{prompt}"
                }
            ]
            
            response = await asyncio.to_thread(
                self.anthropic_client.messages.create,
                model=config.model_name,
                messages=messages,
                temperature=config.temperature,
                max_tokens=config.max_tokens
            )
            
            content = response.content[0].text
            return f"{content}\n\n_(Generated by Claude)_"
        except Exception as e:
            logger.error(f"Claude error: {str(e)}")
            return ""

    async def generate_with_gemini(self, prompt: str, context: str) -> str:
        """Generate content using Gemini"""
        config = self.gemini_config
        try:
            model = genai.GenerativeModel(
                model_name=config.model_name,
                generation_config={
                    "temperature": config.temperature,
                    "max_output_tokens": config.max_tokens
                }
            )
            
            prompt_text = f"Context:\n{context}\n\nPrompt:\n{prompt}"
            response = await asyncio.to_thread(
                model.generate_content,
                prompt_text
            )
            
            content = response.text
            return f"{content}\n\n_(Generated by Gemini)_"
        except Exception as e:
            logger.error(f"Gemini error: {str(e)}")
            return ""

    async def generate_blog_section(self, llm_type: LLMType, prompt: str, context: str = "") -> str:
        """Generate blog section content using the specified LLM."""
        try:
            if llm_type == LLMType.CHATGPT:
                return await self.generate_with_chatgpt(prompt, context)
            elif llm_type == LLMType.CLAUDE:
                return await self.generate_with_claude(prompt, context)
            elif llm_type == LLMType.GEMINI:
                return await self.generate_with_gemini(prompt, context)
            else:
                raise ValueError(f"Unsupported LLM type: {llm_type}")
        except Exception as e:
            logger.error(f"Error generating content with {llm_type}: {str(e)}")
            raise

    async def generate_blog_post(
        self,
        title: str,
        sections: List[Dict[str, Any]],
    ) -> Dict[str, str]:
        """
        Generate a complete blog post using multiple LLMs
        
        Args:
            title: Blog post title
            sections: List of section configurations with prompts and LLM preferences
        
        Returns:
            Dict containing generated sections and metadata
        """
        generated_sections = {}
        
        for section in sections:
            content = await self.generate_blog_section(section["llm_type"], section["prompt"])
            generated_sections[section["name"]] = content
        
        return {
            "title": title,
            "sections": generated_sections,
            "metadata": {
                "llms_used": [s["llm_type"].value for s in sections]
            }
        }
