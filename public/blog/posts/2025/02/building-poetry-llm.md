---
title: "Building a Poetry Analysis System with Multiple LLMs"
date: "2025-02-15"
author: "Shane"
tags: ["AI", "Poetry", "Development", "LLM"]
excerpt: "A deep dive into creating a system that combines multiple AI models for nuanced poetry analysis"
coverImage: "/blog/assets/images/poetry-llm-cover.jpg"
published: true
---

# Building a Poetry Analysis System with Multiple LLMs

When I first started exploring the intersection of poetry and artificial intelligence, I quickly realized that a single AI model, no matter how sophisticated, couldn't capture the full depth and nuance of poetic analysis. This led me to develop a system that combines the unique strengths of multiple Large Language Models (LLMs).

## The Challenge

Poetry analysis is inherently subjective and multifaceted. A good analysis considers:

- Technical elements (meter, rhyme, form)
- Literary devices
- Thematic interpretation
- Emotional resonance
- Historical and cultural context

No single AI model excels at all these aspects equally.

## The Solution

I developed a system that leverages three different LLMs:

1. **GPT-4**: Excellent at identifying subtle literary devices and making thematic connections
2. **Claude**: Strong at providing structured, academic-style analysis
3. **Gemini**: Particularly good at identifying cultural and historical references

## Technical Implementation

The system processes each poem through all three models in parallel, using carefully crafted prompts that play to each model's strengths. The results are then combined using a weighted scoring system that considers each model's confidence and expertise areas.

```python
async def analyze_poem(poem_text):
    tasks = [
        analyze_with_gpt4(poem_text),
        analyze_with_claude(poem_text),
        analyze_with_gemini(poem_text)
    ]
    results = await asyncio.gather(*tasks)
    return combine_analyses(results)
```

## Results

The combined analysis often reveals insights that no single model would have caught on its own. For example, when analyzing Robert Frost's "The Road Not Taken", the system provided:

- Technical analysis of the poem's form (GPT-4)
- Historical context about path-choice metaphors (Gemini)
- Deep dive into the irony of the narrator's perspective (Claude)

## Next Steps

I'm currently working on:
1. Adding more specialized models
2. Improving the analysis combination algorithm
3. Building a web interface for real-time analysis

Follow along with the development in the [tech projects section](/tech-projects/poetry-llm).
