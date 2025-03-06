# Epistemic Task Assignment Pipeline

An interactive visualization for a multi-model AI research pipeline that demonstrates collaborative task decomposition and orchestration.

## Project Overview

This project visualizes an advanced AI research pipeline that breaks down complex research tasks into manageable components, distributes them across multiple specialized AI models, and reassembles the results into coherent content.

## Pipeline Components

1. **Input Processing** (Implemented)
   - democracy.py extracts user messages from transcripts
   - Preserves temporal context (timestamps)
   - Outputs structured markdown

2. **Vector Database Integration** (To Implement)
   - Add Chroma for local vector storage
   - Use text-embedding-ada-002 for embeddings
   - Store both user messages and research outputs

3. **Multi-LLM Orchestration** (To Implement)
   - Create orchestrator class to manage LLM routing
   - Support multiple models (Claude, GPT-4, Gemini)
   - Implement structured prompting system

4. **Research Generation** (To Implement)
   - Deep research prompt generation
   - Sectioned output in markdown/JSON
   - Automatic chunking and embedding

5. **Content Assembly** (To Implement)
   - Final blog post generation
   - Section collapsing and formatting
   - Citation and reference management

## Visualization Features

- Interactive Mermaid.js diagrams
- Clickable components with detailed views
- Responsive design with dark mode support
- Matches blog's design aesthetic

## Technical Implementation

### Frontend
- Mermaid.js for diagram rendering
- Tailwind CSS for styling
- TypeScript for type-safe interaction logic

### Files
- `index.html`: Main visualization page
- `pipeline-interaction.js`: JavaScript interaction handling
- `pipeline-interaction.ts`: TypeScript version with type annotations

## Development Notes

### TypeScript/JavaScript Setup

This project uses TypeScript for type safety and better development experience:

- `pipeline-interaction.ts` is the source file that should be edited
- `pipeline-interaction.js` is the compiled output and should not be edited directly
- Type definitions for Mermaid are in `mermaid.d.ts`

To compile the TypeScript files after making changes:

```bash
# From the frontend directory
npm run compile-public-ts
```

This will automatically update the JavaScript file that's loaded by the HTML.

## Usage

Open `index.html` in a web browser to view the interactive visualization. Click on any component in the main pipeline view to see a detailed breakdown of that component.

## Future Development

- Implement the remaining pipeline components
- Add more detailed component descriptions
- Create tooltips for additional context
- Enhance mobile responsiveness
