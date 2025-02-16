import os
import asyncio
import aiohttp
import aiofiles
import frontmatter
import yaml
import google.generativeai as genai
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI
from pathlib import Path
import git
from dataclasses import dataclass
from typing import Optional, Dict, List
import argparse
from datetime import datetime
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

@dataclass
class LLMResponse:
    favorite_lines: str
    interpretation: str
    criticism: str
    emotional_impact: str
    image_prompt: str

class PoemAnalyzer:
    def __init__(self, llms_to_run: Optional[List[str]] = None):
        """
        Initialize PoemAnalyzer with optional list of LLMs to run.
        Args:
            llms_to_run: List of LLM names to analyze with. If None, will use all available LLMs.
                        Valid values are: 'gemini', 'claude', 'gpt'
        """
        # Track which LLMs to use
        self.llms_to_run = llms_to_run
        
        # Initialize only the LLM clients we need
        self.gemini = self._init_gemini() if not llms_to_run or 'gemini' in llms_to_run else None
        self.claude = self._init_claude() if not llms_to_run or 'claude' in llms_to_run else None
        self.gpt = self._init_gpt() if not llms_to_run or 'gpt' in llms_to_run else None
        self.dalle = self._init_gpt()  # We'll use the same client for DALL-E
        
        # Rate limiting semaphores and timestamps
        self.gemini_semaphore = asyncio.Semaphore(5)
        self.claude_semaphore = asyncio.Semaphore(5)
        self.gpt_semaphore = asyncio.Semaphore(3)
        self.dalle_semaphore = asyncio.Semaphore(3)  # Conservative rate limit for DALL-E
        self.last_dalle_request = 0
        
        # Set up paths
        self.project_root = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.poems_dir = self.project_root / "frontend" / "public" / "poems" / "Poems"
        self.repo = git.Repo(search_parent_directories=True)

    def _init_gemini(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        return genai.GenerativeModel('gemini-pro')

    def _init_claude(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        return AsyncAnthropic(api_key=api_key)

    def _init_gpt(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("OPENAI_API_KEY not found in environment variables")
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        print(f"OpenAI API Key found: {api_key[:8]}...")  # Only print first few chars for security
        client = AsyncOpenAI(api_key=api_key)
        print("OpenAI client initialized successfully")
        return client

    def _get_gemini_prompt(self, poem_text: str) -> str:
        return f'''Analyze this poem and create a DALL-E image prompt. Format your response EXACTLY like this example, with no deviations:

Poem:
{poem_text}

favorite_lines: "6-7: These lines beautifully capture the essence of the city"
interpretation: "The poem explores themes of urban life"
criticism: "12: This line could be improved by being more specific"
emotional_impact: "8: The poem effectively conveys a strong sense of place"
image_prompt: "A detailed digital art piece showing a rain-soaked cityscape at twilight, neon lights reflecting in puddles, towering skyscrapers fade into misty clouds, people with umbrellas casting long shadows, impressionistic style with muted colors except for vibrant neon reflections"

Keep your response concise and focused. Use line numbers in your analysis. For the image_prompt, create a vivid, detailed description that captures the poem's essence, mood, and imagery. Specify art style, medium, lighting, and key visual elements. The prompt should be 1-3 sentences.'''

    def _get_claude_prompt(self, poem_text: str) -> str:
        return f'''Analyze this poem and create a DALL-E image prompt. Format your response exactly as shown:

Poem:
{poem_text}

For each aspect, provide a concise but insightful analysis. For the image prompt, create a detailed visual description that captures the poem's essence.

1. Favorite Lines: Choose your favorite line and explain why
2. Interpretation: Give a brief overall interpretation
3. Criticism: Be constructively critical
4. Emotional Impact: Rate the emotional impact from 1-10 and explain why
5. Image Prompt: Create a detailed DALL-E prompt that captures the poem's mood, imagery, and themes. Specify artistic style, medium, lighting, and key visual elements.

Example format:
favorite_lines: "21: This line masterfully captures..."
interpretation: "The poem explores themes of..."
criticism: "15: This line feels cliched because..."
emotional_impact: "7: The poem effectively conveys..."
image_prompt: "A serene watercolor landscape at dawn, soft morning mist rising from a mountain lake, delicate brush strokes in pastel blues and purples, rays of golden sunlight filtering through pine trees, reflections rippling on the water's surface"'''

    def _get_gpt_prompt(self, poem_text: str) -> str:
        return f'''Analyze this poem and create a DALL-E image prompt. Format your response exactly as shown:

Poem:
{poem_text}

For each aspect, provide a concise but insightful analysis. For the image prompt, create a detailed visual description that captures the poem's essence.

1. Favorite Lines: Choose your favorite line and explain why
2. Interpretation: Give a brief overall interpretation
3. Criticism: Be constructively critical
4. Emotional Impact: Rate the emotional impact from 1-10 and explain why
5. Image Prompt: Create a detailed DALL-E prompt that captures the poem's mood, imagery, and themes. Specify artistic style, medium, lighting, and key visual elements.

Example format:
favorite_lines: "21: This line masterfully captures..."
interpretation: "The poem explores themes of..."
criticism: "15: This line feels cliched because..."
emotional_impact: "7: The poem effectively conveys..."
image_prompt: "An oil painting in the style of the Hudson River School, depicting a dramatic sunset over rugged wilderness, towering storm clouds tinged with golden light, a solitary figure contemplating the vast landscape, rich earth tones contrasting with luminous sky"'''

    def _parse_llm_response(self, text: str) -> Optional[LLMResponse]:
        """Parse LLM response into structured format"""
        try:
            # Clean up the text first
            text = text.replace('\r', '').strip()
            
            # Split response into sections
            sections = {}
            current_section = None
            current_text = []
            
            for line in text.split('\n'):
                line = line.strip()
                if not line or line.startswith('Poem:'):
                    continue
                    
                # Check for section headers
                found_section = False
                for section in ['favorite_lines:', 'interpretation:', 'criticism:', 'emotional_impact:', 'image_prompt:']:
                    if line.lower().startswith(section.lower()):
                        if current_section:
                            sections[current_section] = ' '.join(current_text).strip().strip('"')
                        current_section = section[:-1]  # Remove the colon
                        current_text = [line[len(section):].strip().strip('"')]
                        found_section = True
                        break
                
                if not found_section and current_section:
                    current_text.append(line.strip('"'))
            
            # Don't forget the last section
            if current_section:
                sections[current_section] = ' '.join(current_text).strip().strip('"')
            
            # Create response object
            response = LLMResponse(
                favorite_lines=sections.get('favorite_lines', ''),
                interpretation=sections.get('interpretation', ''),
                criticism=sections.get('criticism', ''),
                emotional_impact=sections.get('emotional_impact', ''),
                image_prompt=sections.get('image_prompt', '')
            )
            
            # Validate response
            if not all(getattr(response, field) for field in ['favorite_lines', 'interpretation', 'criticism', 'emotional_impact', 'image_prompt']):
                print("Warning: Some fields are empty in the parsed response")
                print("Sections found:", sections)
            
            return response
            
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            print(f"Original text: {text}")
            return None

    async def _analyze_with_gemini(self, poem_content: str) -> Optional[LLMResponse]:
        async with self.gemini_semaphore:
            try:
                print("Starting Gemini analysis...")
                prompt = self._get_gemini_prompt(poem_content)
                
                # Configure Gemini for more structured output
                response = self.gemini.generate_content(
                    prompt,
                    generation_config={
                        "temperature": 0.7,
                        "top_p": 0.8,
                        "top_k": 40,
                        "max_output_tokens": 1024,
                    },
                    safety_settings=[
                        {
                            "category": "HARM_CATEGORY_HARASSMENT",
                            "threshold": "BLOCK_NONE",
                        },
                        {
                            "category": "HARM_CATEGORY_HATE_SPEECH",
                            "threshold": "BLOCK_NONE",
                        },
                        {
                            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            "threshold": "BLOCK_NONE",
                        },
                        {
                            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                            "threshold": "BLOCK_NONE",
                        },
                    ]
                )
                
                if not response.text:
                    print("Warning: Empty response from Gemini")
                    return None
                    
                print("Received Gemini response")
                return self._parse_llm_response(response.text)
                
            except Exception as e:
                print(f"Error in Gemini analysis: {e}")
                return None

    async def _analyze_with_claude(self, poem_content: str) -> Optional[LLMResponse]:
        async with self.claude_semaphore:
            try:
                print("Starting Claude analysis...")
                prompt = self._get_claude_prompt(poem_content)
                
                response = await self.claude.messages.create(
                    model="claude-3-opus-20240229",
                    max_tokens=1024,
                    temperature=0.7,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                if not response.content or not response.content[0].text:
                    print("Warning: Empty response from Claude")
                    return None
                    
                print("Received Claude response")
                return self._parse_llm_response(response.content[0].text)
                
            except Exception as e:
                print(f"Error in Claude analysis: {e}")
                return None

    async def _analyze_with_gpt(self, poem_content: str) -> Optional[LLMResponse]:
        async with self.gpt_semaphore:
            try:
                print("Starting GPT analysis...")
                prompt = self._get_gpt_prompt(poem_content)
                
                response = await self.gpt.chat.completions.create(
                    model="gpt-4-turbo-preview",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=1024,
                    temperature=0.7,
                )
                
                if not response.choices or not response.choices[0].message.content:
                    print("Warning: Empty response from GPT")
                    return None
                    
                print("Received GPT response")
                return self._parse_llm_response(response.choices[0].message.content)
                
            except Exception as e:
                print(f"Error in GPT analysis: {e}")
                return None

    async def generate_image(self, prompt: str, llm_name: str, poem_name: str) -> Optional[str]:
        """Generate an image using DALL-E based on the prompt."""
        try:
            # Rate limiting: ensure at least 1 second between requests
            current_time = time.time()
            time_since_last = current_time - self.last_dalle_request
            if time_since_last < 1:
                await asyncio.sleep(1 - time_since_last)
            
            async with self.dalle_semaphore:
                self.last_dalle_request = time.time()
                print(f"\nGenerating DALL-E image...")
                print(f"Prompt: {prompt}")
                
                response = await self.dalle.images.generate(
                    model="dall-e-3",
                    prompt=prompt,
                    size="1024x1024",
                    quality="standard",
                    n=1,
                )
                
                if not response.data:
                    print("Warning: Empty response from DALL-E")
                    return None
                
                image_url = response.data[0].url
                print(f"Generated image URL: {image_url}")
                print("Note: This URL is temporary. Save the image manually if you want to keep it.")
                return image_url
                
        except Exception as e:
            print(f"Error generating image: {e}")
            return None

    def _has_file_changed(self, file_path: Path) -> bool:
        """Check if file has changed since last commit"""
        try:
            # Get the last commit that modified this file
            last_commit = next(self.repo.iter_commits(paths=str(file_path)))
            
            # Get the file's current state
            with open(file_path, 'rb') as f:
                current_content = f.read()
            
            # Get the file's state in the last commit
            old_content = last_commit.tree[str(file_path)].data_stream.read()
            
            return current_content != old_content
        except (StopIteration, KeyError):
            # File is new or not tracked
            return True

    def _needs_analysis(self, post: frontmatter.Post, llm_name: Optional[str] = None) -> bool:
        """Check if a poem needs analysis from a specific LLM"""
        if not post.get('published', False):
            return False
            
        llm_analysis = post.get('llm_analysis', {})
        if llm_name not in llm_analysis:
            return True
            
        return self._has_file_changed(post.metadata.get('_file_path'))

    async def analyze_poem_file(self, file_path: Path) -> None:
        """Analyze a single poem file and generate images."""
        try:
            print(f"\nProcessing {file_path}...")
            
            # Load the post
            with open(file_path, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            # Skip if not published
            if not post.get('published', False):
                print(f"Skipping {file_path} - not published")
                return
            
            # Initialize llm_analysis if it doesn't exist
            if 'llm_analysis' not in post:
                post['llm_analysis'] = {}
            
            # Get ONLY the poem content, not the frontmatter
            poem_content = post.content.strip()
            print(f"Poem length: {len(poem_content)} characters")
            
            # Track which LLMs we'll use
            llms_to_analyze = []
            
            # Only analyze with specified LLMs or if they're missing
            if self.gemini and (not self.llms_to_run or 'gemini' in self.llms_to_run):
                print("Will analyze with Gemini")
                # Reset Gemini analysis if it exists
                if self._should_reset_frontmatter(post, 'gemini'):
                    print("Resetting Gemini analysis...")
                    post = self._reset_frontmatter_for_llm(str(file_path), 'gemini')
                llms_to_analyze.append(('gemini', self._analyze_with_gemini))
            
            if self.claude and (not self.llms_to_run or 'claude' in self.llms_to_run):
                print("Will analyze with Claude")
                # Reset Claude analysis if it exists
                if self._should_reset_frontmatter(post, 'claude'):
                    print("Resetting Claude analysis...")
                    post = self._reset_frontmatter_for_llm(str(file_path), 'claude')
                llms_to_analyze.append(('claude', self._analyze_with_claude))
            
            if self.gpt and (not self.llms_to_run or 'gpt' in self.llms_to_run):
                print("Will analyze with GPT")
                # Reset GPT analysis if it exists
                if self._should_reset_frontmatter(post, 'gpt'):
                    print("Resetting GPT analysis...")
                    post = self._reset_frontmatter_for_llm(str(file_path), 'gpt')
                llms_to_analyze.append(('gpt', self._analyze_with_gpt))
            
            # Run analyses
            analyses = {}
            for llm_name, analyze_func in llms_to_analyze:
                analysis = await analyze_func(poem_content)
                if analysis:
                    print(f"\nGot analysis from {llm_name}")
                    analyses[llm_name] = analysis
                else:
                    print(f"Failed to get analysis from {llm_name}")
            
            # Generate images
            for llm_name, analysis in analyses.items():
                if analysis and analysis.image_prompt:
                    image_url = await self.generate_image(analysis.image_prompt, llm_name, file_path.stem)
                    if image_url:
                        # Add the image URL to the frontmatter
                        post[f"{llm_name}_image"] = image_url
            
            # Update the frontmatter with analyses and image URLs
            await self._update_frontmatter(str(file_path), analyses)
            
            print("Analysis complete")
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

async def generate_images_from_existing_analysis(analyzer: PoemAnalyzer):
    """Generate DALL-E images from existing analysis in poem files."""
    for poem_file in analyzer.poems_dir.glob('*.md'):
        try:
            print(f"\nProcessing {poem_file.name} for DALL-E image generation...")
            
            # Get poem name without extension
            poem_name = poem_file.stem
            
            # Read the current poem file
            with open(poem_file, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            # Get the poem content
            poem_content = post.content
            
            # Process each LLM's existing analysis
            for llm_name, llm_data in (post.get('llm_analysis') or {}).items():
                if llm_name not in ('claude', 'gpt', 'gemini'):
                    continue
                    
                print(f"\nProcessing {llm_name.upper()} analysis...")
                
                # Skip if we already have an image URL
                if llm_data.get('image_url'):
                    print(f"Image already exists for {llm_name}")
                    continue
                
                # Get existing analysis
                analysis = llm_data.get('analysis', {})
                if not analysis:
                    print(f"No existing analysis found for {llm_name}")
                    continue
                
                # Create a prompt for generating DALL-E prompt
                prompt = f'''Based on this poem and your previous analysis, create a detailed DALL-E prompt.

Poem:
{poem_content}

Your previous analysis:
Favorite Lines: {analysis.get('favorite_lines', '')}
Interpretation: {analysis.get('interpretation', '')}
Emotional Impact: {analysis.get('emotional_impact', '')}

Create a vivid, detailed DALL-E prompt that captures the essence of this poem based on your analysis.
Focus on artistic style, medium, lighting, mood, and key visual elements.
Format your response as a single, detailed prompt of 1-3 sentences.'''

                # Get the image prompt from the appropriate LLM
                image_prompt = None
                if llm_name == 'claude' and analyzer.claude:
                    response = await analyzer.claude.messages.create(
                        model="claude-3-opus-20240229",
                        max_tokens=1024,
                        temperature=0.7,
                        messages=[{"role": "user", "content": prompt}]
                    )
                    image_prompt = response.content[0].text.strip()
                elif llm_name == 'gpt' and analyzer.gpt:
                    response = await analyzer.gpt.chat.completions.create(
                        model="gpt-4-turbo-preview",
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=1024,
                        temperature=0.7,
                    )
                    image_prompt = response.choices[0].message.content.strip()
                elif llm_name == 'gemini' and analyzer.gemini:
                    response = analyzer.gemini.generate_content(prompt)
                    image_prompt = response.text.strip()
                
                if image_prompt:
                    print(f"\nGenerated prompt for {llm_name}:")
                    print(image_prompt)
                    
                    # Safely update only the image-related fields
                    if 'llm_analysis' not in post:
                        post['llm_analysis'] = {}
                    if llm_name not in post['llm_analysis']:
                        post['llm_analysis'][llm_name] = {}
                    if 'analysis' not in post['llm_analysis'][llm_name]:
                        post['llm_analysis'][llm_name]['analysis'] = {}
                    
                    # Update only the image prompt
                    post['llm_analysis'][llm_name]['analysis']['image_prompt'] = image_prompt
                    
                    # Generate the image
                    print("\nGenerating DALL-E image...")
                    image_url = await analyzer.generate_image(image_prompt, llm_name, poem_name)
                    
                    if image_url:
                        print(f"Image generated successfully: {image_url}")
                        post['llm_analysis'][llm_name]['image_url'] = image_url
                    else:
                        print("Failed to generate image")
                    
                    # Save the updated frontmatter while preserving existing content
                    with open(poem_file, 'w', encoding='utf-8') as f:
                        f.write(frontmatter.dumps(post))
                    print(f"Updated {poem_file.name} with new image data")
                
        except Exception as e:
            print(f"Error processing {poem_file.name}: {e}")

async def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Analyze poems using multiple LLMs')
    parser.add_argument('mode', choices=['analyze', 'dalle-3'], 
                       help='Mode to run: "analyze" for full analysis, "dalle-3" to generate images from existing analysis')
    parser.add_argument('--llms', nargs='+', choices=['claude', 'gpt', 'gemini'],
                       help='Specific LLMs to use (default: all)')
    args = parser.parse_args()

    analyzer = PoemAnalyzer(args.llms)
    
    if args.mode == 'dalle-3':
        await generate_images_from_existing_analysis(analyzer)
    else:
        # Process all poem files
        for poem_file in analyzer.poems_dir.glob('*.md'):
            await analyzer.analyze_poem_file(poem_file)

if __name__ == "__main__":
    asyncio.run(main())
