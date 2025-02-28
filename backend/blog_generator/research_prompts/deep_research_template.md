# Deep Research Analysis: {topic}
Generated at: {timestamp}

## Conversation Context
Total Messages Analyzed: {message_count}
Topic: {topic}

## Key Conversation Excerpts
{message_preview}

## Research Objectives
1. Analyze the conversation dynamics and emergent themes
2. Identify areas requiring deeper external research
3. Generate specific research queries for external knowledge retrieval
4. Synthesize findings into a comprehensive analysis

## Research Areas
The following areas need investigation. Models should self-assign based on their capabilities:

### Technical Domain
- System architectures and implementations
- Technical methodologies and patterns
- Performance and constraint analysis
- Required External Sources: Technical documentation, academic papers, implementation guides

### Contextual Domain
- Historical development and patterns
- Current state of the field
- Relationship mapping between concepts
- Required External Sources: Academic literature, industry reports, case studies

### Societal Impact Domain
- Cultural and ethical implications
- Future trajectories and scenarios
- Value systems and philosophical frameworks
- Required External Sources: Ethics papers, social impact studies, policy documents

## Output Requirements
For each research area:
1. Model Assignment Rationale
2. Specific External Research Queries
3. Key Investigation Points
4. Expected Knowledge Gaps to Address

## Research Query Format
Each external research query should follow this structure:
```json
{
  "query_type": "academic|technical|news|policy",
  "search_terms": ["term1", "term2"],
  "time_range": "specific_period",
  "required_source_types": ["papers", "documentation", "reports"],
  "expected_insights": "Description of what we expect to learn"
}
```
