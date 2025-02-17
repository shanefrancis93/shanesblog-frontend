import os
import yaml
from datetime import datetime
from typing import Dict, List, Optional
import json
from pathlib import Path
import openai
from openai import AsyncOpenAI
import anthropic
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize API clients
models_config = {
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
    "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY"),
    "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY")
}

openai_client = AsyncOpenAI(api_key=models_config["OPENAI_API_KEY"])
claude_client = anthropic.AsyncAnthropic(api_key=models_config["ANTHROPIC_API_KEY"])
genai.configure(api_key=models_config["GEMINI_API_KEY"])

class AIModel:
    def __init__(self, name: str):
        self.name = name
        
    async def generate_content(self, prompt: str, temperature: float) -> str:
        """Generate content using the AI model."""
        raise NotImplementedError

class GPT4Model(AIModel):
    async def generate_content(self, prompt: str, temperature: float) -> str:
        """Generate content using GPT-4."""
        try:
            response = await openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are an expert blog content creator."},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error with GPT-4 generation: {e}")
            return f"[Error generating content with GPT-4: {str(e)}]"

class ClaudeModel(AIModel):
    async def generate_content(self, prompt: str, temperature: float) -> str:
        """Generate content using Claude."""
        try:
            response = await claude_client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1000,
                temperature=temperature,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            return response.content[0].text
        except Exception as e:
            print(f"Error with Claude generation: {e}")
            return f"[Error generating content with Claude: {str(e)}]"

class GeminiModel(AIModel):
    async def generate_content(self, prompt: str, temperature: float) -> str:
        """Generate content using Gemini."""
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Error with Gemini generation: {e}")
            return f"[Error generating content with Gemini: {str(e)}]"

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
        topic = self.frontmatter.get('topic', {})
        model_info = next(
            (m for m in self.frontmatter['aiMetadata']['models'] 
             if m['name'] == section['assignedTo']),
            {'role': 'content_creator'}
        )
        
        base_prompt = f"""You are writing a section for a blog post about {topic.get('title', 'the specified topic')}.
This is for the '{section['title']}' section.

Your role: {model_info['role']}

Context:
{topic.get('description', '')}

Section Guidelines:
1. Write in a clear, engaging style
2. Use markdown formatting for headers, lists, and emphasis
3. Focus on this section's specific aspect: {section['title']}
4. Aim for approximately 300-500 words
5. Include relevant examples or evidence
6. Maintain a professional but conversational tone

Previous sections content for context:
{json.dumps(self.content, indent=2)}

Please provide your analysis and insights for this section.
"""
        return base_prompt

class BlogGenerator:
    def __init__(self, models_config: Dict):
        self.models_config = models_config
        self.models = {
            "GPT-4": GPT4Model("GPT-4"),
            "Claude-3": ClaudeModel("Claude-3"),
            "Gemini": GeminiModel("Gemini")
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
    generator = BlogGenerator(models_config)
    
    # Path to the markdown file
    markdown_path = input("Enter the path to your markdown template: ")
    
    # Generate the blog post
    await generator.generate_blog_post(markdown_path)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
