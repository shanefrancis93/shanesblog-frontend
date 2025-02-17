"""
Research generator module for creating structured research prompts.
"""

from typing import Dict, List, Any
from pathlib import Path
from datetime import datetime, timezone
import asyncio
import logging
import json

from dotenv import load_dotenv
from model_coordinator_REBORN import ModelCoordinator, ModelConfig

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('research_generator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Model configurations
MODEL_CONFIGS = {
    "gpt4": ModelConfig(
        primary_strength="technical",
        secondary_strengths=["contextual"],
        supported_sections=["technical_analysis", "system_architecture"],
        token_limit=8000,
        cost_per_token=0.01
    ),
    "claude": ModelConfig(
        primary_strength="contextual",
        secondary_strengths=["subtextual"],
        supported_sections=["background_analysis", "cultural_context"],
        token_limit=10000,
        cost_per_token=0.008
    ),
    "gemini": ModelConfig(
        primary_strength="subtextual",
        secondary_strengths=["contextual"],
        supported_sections=["ethical_implications", "future_directions"],
        token_limit=6000,
        cost_per_token=0.005
    )
}

class ResearchGenerator:
    def __init__(self):
        """Initialize the research generator"""
        # Load environment variables
        load_dotenv()
        
        # Initialize model coordinator with configurations
        self.coordinator = ModelCoordinator(models=MODEL_CONFIGS)
        
        # Load research templates
        self.templates = self._load_templates()
        
    def _load_templates(self) -> Dict[str, str]:
        """Load research prompt templates"""
        template_dir = Path(__file__).parent / "research_prompts"
        templates = {}
        
        try:
            template_path = template_dir / "deep_research.md"
            logger.info(f"Loading template from {template_path}")
            
            # Read template and escape any existing curly braces
            with open(template_path, encoding='utf-8') as f:
                content = f.read()
                templates["deep_research"] = content.replace("{{", "{{{{").replace("}}", "}}}}")
                
            logger.debug(f"Loaded template content: {templates['deep_research'][:200]}...")
            return templates
            
        except FileNotFoundError as e:
            logger.error(f"Template file not found: {template_path}")
            raise
        except Exception as e:
            logger.error(f"Error loading template: {e}")
            logger.error(f"Template path: {template_path}")
            raise
    
    def _extract_messages_from_markdown(self, content: str) -> List[Dict[str, str]]:
        """Extract messages from markdown content with improved parsing"""
        messages = []
        current_msg = {"content": "", "duration": None}
        in_message = False
        
        for line in content.split("\n"):
            if line.startswith("## Message"):
                # Start of a new message
                in_message = True
                if current_msg["content"]:
                    messages.append(current_msg.copy())
                current_msg = {"content": "", "duration": None}
                
                # Try to extract duration if present
                try:
                    duration_str = line.split("(Duration: ")[1].split(")")[0]
                    current_msg["duration"] = duration_str
                    logger.debug(f"Extracted duration: {duration_str}")
                except (IndexError, KeyError):
                    logger.warning(f"Could not parse duration from line: {line}")
                    
            elif line.startswith("---"):
                # End of current message
                in_message = False
                if current_msg["content"]:
                    messages.append(current_msg.copy())
                current_msg = {"content": "", "duration": None}
            elif in_message:
                # Only process content when we're inside a message block
                if line.startswith('"') and line.endswith('"'):
                    # Extract content between quotes
                    current_msg["content"] = line.strip('"').strip()
                    logger.debug(f"Extracted message content: {current_msg['content'][:50]}...")
                elif line.strip() and not line.startswith("#"):
                    current_msg["content"] += line.strip() + " "
                
        # Add the last message if there is one
        if current_msg["content"]:
            messages.append(current_msg)
            
        # Clean up message content
        for msg in messages:
            msg["content"] = msg["content"].strip()
            
        logger.info(f"Extracted {len(messages)} messages")
        if messages:
            logger.debug(f"First message preview: {messages[0]}")
            logger.debug(f"Last message preview: {messages[-1]}")
        
        return messages
    
    async def generate_research_prompt(self, topic: str, messages: List[Dict[str, str]]) -> str:
        """Generate a comprehensive research prompt"""
        logger.info("Starting research prompt generation...")
        
        try:
            # Have coordinator analyze content
            logger.info("Analyzing content with coordinator...")
            try:
                section_assignments = await self.coordinator.analyze_content(messages)
                logger.info(f"Section assignments: {section_assignments}")
            except Exception as e:
                logger.error(f"Error in analyze_content: {e}")
                logger.error(f"Messages: {json.dumps(messages[:3], indent=2, default=str)}...")
                raise
            
            # Prepare context and format variables
            logger.info("Preparing format variables...")
            try:
                format_vars = {
                    "topic": topic,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "message_count": len(messages),
                    "message_preview": "\n".join(
                        f"- {msg['content'][:100]}..."
                        for msg in messages[:3]
                    ),
                    "section_assignments": "\n".join(
                        f"{model}:\n" + "\n".join(f"- {section}" for section in sections)
                        for model, sections in section_assignments.items()
                    )
                }
                
                logger.info("Template variables prepared:")
                for key, value in format_vars.items():
                    logger.info(f"{key}: {str(value)[:100]}...")
                    
            except Exception as e:
                logger.error(f"Error preparing format variables: {e}")
                logger.error(f"Section assignments: {section_assignments}")
                logger.error(f"Messages: {json.dumps(messages[:3], indent=2, default=str)}...")
                raise
            
            # Generate the complete research prompt
            logger.info("Generating research prompt...")
            try:
                template = self.templates["deep_research"]
                logger.info(f"Template preview: {template[:500]}...")
                
                # Check for required template variables
                import re
                required_vars = set(re.findall(r'\{(\w+)\}', template))
                logger.info(f"Required template variables: {required_vars}")
                logger.info(f"Available variables: {set(format_vars.keys())}")
                
                missing_vars = required_vars - set(format_vars.keys())
                if missing_vars:
                    raise ValueError(f"Missing required template variables: {missing_vars}")
                
                prompt = template.format(**format_vars)
                logger.debug(f"Generated prompt preview: {prompt[:200]}...")
                
            except Exception as e:
                logger.error(f"Error in template formatting: {e}")
                logger.error("Template variables:")
                for key, value in format_vars.items():
                    logger.error(f"{key}: {str(value)[:100]}...")
                logger.error(f"Template preview: {template[:500]}...")
                raise
            
            # Save the generated prompt
            output_dir = Path(__file__).parent / "generated_prompts"
            output_dir.mkdir(exist_ok=True)
            output_path = output_dir / f"research_prompt_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            
            with open(output_path, "w", encoding='utf-8') as f:
                f.write(prompt)
                
            logger.info(f"Research prompt generated and saved to {output_path}")
            return prompt
            
        except Exception as e:
            logger.error("Error generating research prompt")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Error message: {str(e)}")
            raise

async def main():
    """Example usage of ResearchGenerator"""
    try:
        logger.info("Starting prompt generation process")
        generator = ResearchGenerator()
        
        # Load processed messages
        processed_file = Path(__file__).parent / "processed_text" / "avatars_processed.md"
        logger.info(f"Loading messages from {processed_file}")
        
        try:
            with open(processed_file, "r", encoding='utf-8') as f:
                content = f.read()
                
            # Extract messages using improved parser
            messages = generator._extract_messages_from_markdown(content)
            logger.info(f"Extracted {len(messages)} messages")
            
            # Generate research prompt
            prompt = await generator.generate_research_prompt(
                topic="Human-AI Interaction: Values, Agency, and Societal Impact",
                messages=messages
            )
            
            print("\nGenerated Research Prompt:")
            print("-------------------------")
            print(prompt)
            
        except FileNotFoundError:
            logger.error(f"Processed text file not found: {processed_file}")
            raise
            
    except Exception as e:
        logger.error("Fatal error in main function")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error message: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
