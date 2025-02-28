import os
import yaml
from datetime import datetime
from typing import Dict, List, Optional
import json
from pathlib import Path

class AIModel:
    def __init__(self, name: str, api_key: str):
        self.name = name
        self.api_key = api_key
        
    async def generate_content(self, prompt: str, temperature: float) -> str:
        """
        Generate content using the AI model.
        To be implemented by specific model classes.
        """
        raise NotImplementedError

class GPT4Model(AIModel):
    async def generate_content(self, prompt: str, temperature: float) -> str:
        # Implement GPT-4 API call
        pass

class ClaudeModel(AIModel):
    async def generate_content(self, prompt: str, temperature: float) -> str:
        # Implement Claude API call
        pass

class GeminiModel(AIModel):
    async def generate_content(self, prompt: str, temperature: float) -> str:
        # Implement Gemini API call
        pass

class BlogPost:
    def __init__(self, markdown_path: str):
        self.markdown_path = Path(markdown_path)
        self.frontmatter: Dict = {}
        self.content: Dict[str, str] = {}
        self.load_markdown()

    def load_markdown(self):
        """Load the markdown file and parse its frontmatter and content."""
        with open(self.markdown_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Split frontmatter and content
        _, frontmatter, content = content.split('---', 2)
        self.frontmatter = yaml.safe_load(frontmatter)
        
        # Parse content into sections
        current_section = None
        current_content = []
        
        for line in content.split('\n'):
            if line.startswith('## '):
                if current_section:
                    self.content[current_section] = '\n'.join(current_content).strip()
                current_section = line[3:].strip()
                current_content = []
            elif current_section:
                current_content.append(line)
                
        if current_section:
            self.content[current_section] = '\n'.join(current_content).strip()

    def save_markdown(self):
        """Save the current state back to the markdown file."""
        # Rebuild the markdown content
        frontmatter = yaml.dump(self.frontmatter, default_flow_style=False)
        
        content_parts = []
        for section in self.frontmatter['sections']:
            title = section['title']
            content = self.content.get(title, f"[{section['assignedTo']}'s {title.lower()} will be inserted here]")
            content_parts.append(f"## {title}\n{content}\n")

        markdown_content = f"---\n{frontmatter}---\n\n" + '\n'.join(content_parts)
        
        with open(self.markdown_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

    def get_section_prompt(self, section: Dict) -> str:
        """Generate a prompt for a specific section."""
        base_prompt = f"""You are analyzing a poem for a blog post. This is for the '{section['title']}' section.
Your role is to provide {section['assignedTo']}'s perspective on this aspect of the poem.

Previous sections: {json.dumps(self.content, indent=2)}

Please provide a detailed analysis focusing on this section's specific aspect.
Your response should be in markdown format and around 300-500 words.
"""
        return base_prompt

class BlogGenerator:
    def __init__(self, models_config: Dict[str, str]):
        self.models = {
            "GPT-4": GPT4Model("GPT-4", models_config["GPT4_API_KEY"]),
            "Claude-3": ClaudeModel("Claude-3", models_config["CLAUDE_API_KEY"]),
            "Gemini": GeminiModel("Gemini", models_config["GEMINI_API_KEY"])
        }

    async def generate_section(self, blog_post: BlogPost, section: Dict) -> str:
        """Generate content for a specific section using the assigned AI model."""
        model = self.models[section['assignedTo']]
        prompt = blog_post.get_section_prompt(section)
        
        # Get the model's temperature from the blog post metadata
        model_metadata = next(
            (m for m in blog_post.frontmatter['aiMetadata']['models'] 
             if m['name'] == section['assignedTo']),
            {'temperature': 0.7}  # default temperature
        )
        
        content = await model.generate_content(prompt, model_metadata['temperature'])
        return content

    async def generate_blog_post(self, markdown_path: str):
        """Generate content for all sections in the blog post."""
        blog_post = BlogPost(markdown_path)
        
        # Update generation timestamp
        blog_post.frontmatter['aiMetadata']['generatedAt'] = datetime.now().isoformat()
        
        # Generate content for each section in sequence
        for section in blog_post.frontmatter['sections']:
            print(f"Generating {section['title']} with {section['assignedTo']}...")
            content = await self.generate_section(blog_post, section)
            blog_post.content[section['title']] = content
            
            # Save after each section to preserve progress
            blog_post.save_markdown()
            print(f"Completed {section['title']}")
        
        print("Blog post generation complete!")
        return blog_post

async def main():
    # Load API keys from environment variables
    models_config = {
        "GPT4_API_KEY": os.getenv("GPT4_API_KEY"),
        "CLAUDE_API_KEY": os.getenv("CLAUDE_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY")
    }
    
    generator = BlogGenerator(models_config)
    
    # Path to the markdown file
    markdown_path = "frontend/public/blog/posts/poetry-analysis-comparison/index.md"
    
    # Generate the blog post
    await generator.generate_blog_post(markdown_path)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
