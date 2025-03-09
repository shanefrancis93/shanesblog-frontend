# Epistemic Task Assignment Pipeline

## Project Description

The Epistemic Task Assignment Pipeline is an advanced AI research system designed to decompose complex research tasks into manageable components, distribute them across multiple specialized AI models, and reassemble the results into coherent content.

This interactive visualization demonstrates the pipeline's architecture and workflow, highlighting both implemented and planned components.

## Pipeline Components

### 1. Input Processing (Implemented)

The input processing component extracts and structures user messages from conversation transcripts:

- **democracy.py**: Core extraction module that identifies and isolates user messages
- **Temporal Context Preservation**: Maintains timestamp information for chronological understanding
- **Structured Output**: Converts raw transcripts into structured markdown format

### 2. Vector Database Integration (To Implement)

The knowledge infrastructure component will provide semantic search and retrieval capabilities:

- **Chroma DB**: Local vector database for efficient storage and retrieval
- **text-embedding-ada-002**: OpenAI's embedding model for converting text to vector representations
- **Dual Storage**: Maintains both user messages and research outputs for comprehensive context

### 3. Multi-LLM Orchestration (To Implement)

The orchestration layer will manage the routing and coordination of multiple AI models:

- **Orchestrator Class**: Central controller for model selection and task routing
- **Multi-Model Support**: Integration with Claude, GPT-4, and Gemini models
- **Structured Prompting**: Standardized prompt templates for consistent model interactions

### 4. Research Generation (To Implement)

The research component will handle in-depth information gathering and analysis:

- **Deep Research Prompts**: Specialized prompts designed for thorough investigation
- **Structured Output**: Consistent markdown/JSON formatting for downstream processing
- **Automatic Processing**: Built-in chunking and embedding for efficient storage

### 5. Content Assembly (To Implement)

The final component will transform research outputs into cohesive content:

- **Blog Post Generation**: Creation of complete, publication-ready content
- **Section Management**: Intelligent organization and formatting of content sections
- **Citation System**: Automated reference tracking and citation formatting

## Technical Implementation

The visualization is built using:

- **Mermaid.js**: For rendering interactive diagrams
- **Tailwind CSS**: For responsive styling that matches the blog's aesthetic
- **TypeScript/JavaScript**: For implementing the interaction logic

## Future Development

Future enhancements to this project will include:

- Implementation of the remaining pipeline components
- More detailed component descriptions and documentation
- Enhanced interactive features like tooltips and animations
- Improved mobile responsiveness and accessibility
- Integration with actual AI models for demonstration purposes
