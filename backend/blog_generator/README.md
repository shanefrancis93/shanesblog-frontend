# Blog Generator with RAGFlow Integration

A powerful blog generation system that leverages multiple LLMs (GPT-4, Claude, Gemini) and RAGFlow for context-aware content creation.

## Features

- Multi-model support (OpenAI GPT-4, Anthropic Claude, Google Gemini)
- RAGFlow integration for context-aware generation
- Flexible configuration system
- Markdown-based blog post templates
- Comprehensive testing infrastructure
- Async-first architecture

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
4. Configure RAGFlow:
   - Ensure RAGFlow server is running
   - Set up your datasets in RAGFlow
   - Update RAGFLOW_DEFAULT_DATASET in .env if needed

## Usage

1. Create a blog post template in `test_posts/` directory
2. Run the test pipeline:
   ```bash
   python test_pipeline.py
   ```
3. Generated content will be saved in the `processed_text/` directory

## Configuration

- `config.py`: Central configuration for models, RAGFlow, and generation settings
- `llm_orchestrator.py`: LLM integration and routing
- `blog_generator.py`: Main blog generation logic

## Testing

Run the test suite:
```bash
python -m pytest
```

## Directory Structure

```
blog_generator/
├── config.py              # Configuration settings
├── llm_orchestrator.py    # LLM integration
├── blog_generator.py      # Main generation logic
├── test_pipeline.py       # Pipeline testing
├── test_posts/           # Blog post templates
└── processed_text/       # Generated content
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License
