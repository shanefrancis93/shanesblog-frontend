"""
LLM orchestrator for managing model calls and contributions.
"""
import asyncio
from typing import Dict, List, Any, Optional
import logging
from pathlib import Path
from dotenv import load_dotenv
import os
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import google.generativeai as genai
import json

# Load environment variables
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)

class LLMOrchestrator:
    """Manages LLM model calls and contributions."""
    
    def __init__(self):
        """Initialize LLM clients."""
        # Initialize OpenAI client
        self.openai_client = AsyncOpenAI(
            api_key=os.getenv('OPENAI_API_KEY')
        )
        
        # Initialize Anthropic client
        self.anthropic_client = AsyncAnthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )
        
        # Initialize Gemini
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        
        self.model_configs = {
            "gpt4": {
                "name": "gpt-4",
                "temperature": 0.3,
                "max_tokens": 2000,
                "strengths": ["technical_analysis", "implementation", "architecture"]
            },
            "claude": {
                "name": "claude-3-opus-20240229",
                "temperature": 0.3,
                "max_tokens": 2000,
                "strengths": ["theoretical_analysis", "patterns", "frameworks"]
            },
            "gemini": {
                "name": "gemini-pro",
                "temperature": 0.3,
                "max_tokens": 2000,
                "strengths": ["societal_impact", "ethics", "trends"]
            }
        }

        # Log API key status
        logger.info("Checking API keys...")
        logger.info(f"OpenAI API key: {'Found' if os.getenv('OPENAI_API_KEY') else 'Not found'}")
        logger.info(f"Anthropic API key: {'Found' if os.getenv('ANTHROPIC_API_KEY') else 'Not found'}")
        logger.info(f"Gemini API key: {'Found' if os.getenv('GEMINI_API_KEY') else 'Not found'}")

    async def get_completion(self,
                           model: str,
                           prompt: str,
                           system_prompt: Optional[str] = None,
                           temperature: Optional[float] = None) -> str:
        """
        Get completion from specified model.
        
        Args:
            model: Model identifier (gpt4, claude, gemini)
            prompt: The prompt to send
            system_prompt: Optional system prompt
            temperature: Optional temperature override
            
        Returns:
            Model response text
        """
        try:
            config = self.model_configs[model]
            temp = temperature if temperature is not None else config["temperature"]
            
            if model == "gpt4":
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                
                response = await self.openai_client.chat.completions.create(
                    model=config["name"],
                    messages=messages,
                    temperature=temp
                )
                return response.choices[0].message.content
                
            elif model == "claude":
                messages = [{"role": "user", "content": prompt}]
                if system_prompt:
                    messages[0]["content"] = f"{system_prompt}\n\n{prompt}"
                
                response = await self.anthropic_client.messages.create(
                    model=config["name"],
                    messages=messages,
                    max_tokens=config["max_tokens"]
                )
                return response.content[0].text
                
            else:  # gemini
                model = genai.GenerativeModel(config["name"])
                response = await model.generate_content(prompt)
                return response.text
                
        except Exception as e:
            logger.error(f"Error getting completion from {model}: {str(e)}")
            raise

    async def get_structured_completion(self,
                                     model: str,
                                     prompt: str,
                                     output_structure: Dict[str, Any],
                                     system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """
        Get structured completion from model.
        
        Args:
            model: Model identifier
            prompt: The prompt to send
            output_structure: Expected output structure with examples
            system_prompt: Optional system prompt
            
        Returns:
            Structured response matching output_structure
        """
        try:
            # Add structure requirements to prompt
            structured_prompt = f"""
{prompt}

Your response must be valid JSON matching this structure:
{json.dumps(output_structure, indent=2)}

Ensure all fields are present and properly formatted.
Return ONLY the JSON, no other text.
"""

            # Get completion
            response_text = await self.get_completion(
                model=model,
                prompt=structured_prompt,
                system_prompt=system_prompt,
                temperature=0.3  # Lower temperature for structured output
            )
            
            # Clean response text
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            # Parse JSON response
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON response: {response_text}")
                raise ValueError("Model did not return valid JSON")
            
            # Validate structure
            for key in output_structure:
                if key not in result:
                    raise ValueError(f"Missing required field: {key}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting structured completion: {str(e)}")
            raise

    async def get_parallel_completions(self,
                                     prompts: Dict[str, str],
                                     system_prompt: Optional[str] = None) -> Dict[str, str]:
        """
        Get completions from multiple models in parallel.
        
        Args:
            prompts: Dict of model -> prompt
            system_prompt: Optional system prompt
            
        Returns:
            Dict of model -> response
        """
        async def get_single_completion(model: str, prompt: str) -> tuple[str, str]:
            try:
                response = await self.get_completion(model, prompt, system_prompt)
                return model, response
            except Exception as e:
                logger.error(f"Error from {model}: {str(e)}")
                return model, f"Error: {str(e)}"
            
        # Create tasks for each model
        tasks = [
            get_single_completion(model, prompt)
            for model, prompt in prompts.items()
        ]
        
        # Run tasks in parallel
        results = await asyncio.gather(*tasks)
        
        # Process results
        responses = {}
        for model, response in results:
            if not response.startswith("Error:"):
                responses[model] = response
            
        return responses

    def get_model_strengths(self, model: str) -> List[str]:
        """Get list of model's strengths."""
        return self.model_configs[model]["strengths"]
