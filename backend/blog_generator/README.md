# Blog Generator

A Python-based tool for generating blog posts using multiple AI models (GPT-4, Claude-3, and Gemini) working together to create rich, multi-perspective content.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your API keys:
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
```

## Usage

1. Create a new blog post template:
```bash
cp template.md my_blog_post.md
```

2. Edit the frontmatter in `my_blog_post.md`:
   - Update the title, tags, and topic
   - Adjust the sections as needed
   - Modify the model assignments if desired

3. Run the generator:
```bash
python blog_generator.py
```

4. When prompted, enter the path to your markdown file:
```
Enter the path to your markdown template: my_blog_post.md
```

The generator will:
- Process each section in sequence
- Use the assigned AI model for each section
- Save progress after each section
- Update the markdown file with generated content

## Template Structure

The template uses frontmatter to define:
- Basic metadata (title, date, tags)
- Topic details and requirements
- AI model configurations
- Section structure and assignments
- Interactive elements (quizzes)

Example section assignment:
```yaml
sections:
  - id: "introduction"
    title: "Introduction"
    level: 1
    assignedTo: "GPT-4"
```

## Models and Roles

- **GPT-4**: Primary author, handles introduction, main analysis, and synthesis
- **Claude-3**: Expert analysis and specialized perspectives
- **Gemini**: Alternative viewpoints and comparative analysis

Each model can be assigned different temperatures and roles based on the needs of the blog post.

## Output

The generator produces a markdown file that:
- Preserves the original structure
- Includes AI-generated content for each section
- Maintains proper markdown formatting
- Tracks generation metadata
- Supports interactive elements

The generated blog post will automatically display AI attribution badges in the frontend when rendered.
