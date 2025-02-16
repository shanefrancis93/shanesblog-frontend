---
title: 'Sherlock Market Definition Assistant'
description: 'An AI-powered system to help classify healthcare products into Sherlock administrative expense market categories using RAG and LLMs'
date: '2025-02-15'
repository: 'https://github.com/SFEcosystem/sherlock-markets'
status: 'In Development'
tags: ['RAG', 'LLM', 'Healthcare', 'Classification', 'PDF Processing']
---

# Sherlock Market Definition Assistant

## Overview
The Sherlock Market Definition Assistant is an AI-powered tool designed to help healthcare professionals and analysts accurately classify products and services into Sherlock's administrative expense market categories. By leveraging Retrieval-Augmented Generation (RAG) and advanced language models, this system provides intelligent market classification suggestions based on product descriptions.

## Problem
The Sherlock Common Guidelines document, which defines discrete market categories for administrative expenses across various healthcare lines of business (Medicare Advantage, Medicaid HMO, Commercial Risk, ASO), is extensive and complex. Healthcare professionals often struggle to:

1. Quickly navigate the large PDF document
2. Identify relevant market definitions for new products
3. Handle cases where a product's services might span multiple market categories
4. Maintain consistency in market classification across different analysts

## Solution
Our solution combines modern AI techniques to create an intelligent market classification assistant:

### 1. PDF Processing and Knowledge Base Creation
- Parse the Sherlock Common Guidelines PDF
- Extract and structure market definitions
- Create labeled datasets for each market category
- Build an efficient vector database for quick retrieval

### 2. RAG Implementation
- Convert user queries (product descriptions) into embeddings
- Retrieve relevant market definitions from the knowledge base
- Use context-aware prompting to generate accurate classifications

### 3. LLM Integration
- Leverage high-context window models like Google's Gemini
- Process complex product descriptions
- Handle multi-market classification scenarios
- Provide confidence scores and explanations

## Technical Architecture

### Components
1. **Document Processor**
   - PDF parsing and text extraction
   - Market definition segmentation
   - Structured data creation

2. **Vector Database**
   - Market definition embeddings
   - Efficient similarity search
   - Version control for guideline updates

3. **RAG Engine**
   - Query processing
   - Context retrieval
   - Response generation

4. **API Layer**
   - RESTful endpoints
   - Authentication
   - Rate limiting

### Technologies
- **PDF Processing**: PyPDF2, PDFPlumber
- **Vector Database**: Pinecone or Weaviate
- **Embeddings**: OpenAI Ada-2
- **LLM**: Google Gemini Pro
- **Backend**: FastAPI
- **Frontend**: Next.js, Tailwind CSS

## Current Status
The project is currently in development, with the following milestones:

- [x] Project planning and architecture design
- [ ] PDF processing and data extraction
- [ ] Vector database implementation
- [ ] RAG system development
- [ ] API development
- [ ] Frontend development
- [ ] Testing and validation
- [ ] Production deployment

## Future Enhancements
1. Support for multiple guideline versions
2. Batch classification capabilities
3. Integration with existing healthcare systems
4. Automated market definition updates
5. User feedback incorporation for continuous improvement

## Getting Started
*(Coming soon)*

## Contributing
*(Coming soon)*

## License
This project is proprietary and intended for internal use only.
