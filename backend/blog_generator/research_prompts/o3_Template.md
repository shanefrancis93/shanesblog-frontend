### **Deep Research Prompt Template v2**

**Executive Summary:**  
Generate a comprehensive, multi-perspective analysis of the specified topic, leveraging the unique strengths of each AI model in our ensemble. This research framework is designed to produce rich, nuanced content through coordinated model specialization.

**Model Specializations & Section Assignments:**

1. **GPT-4 (Technical Analysis Lead)**
   - Primary: Technical & methodological analysis
   - Secondary: Contextual interpretation
   - Focus: Quantitative insights, system architecture, implementation details
   - Output Format: Structured technical analysis with supporting data

2. **Claude (Contextual Analysis Lead)**
   - Primary: Long-form contextual analysis
   - Secondary: Subtextual interpretation
   - Focus: Historical patterns, relationship mapping, trend analysis
   - Output Format: Narrative-driven analysis with clear temporal progression

3. **Gemini (Subtextual Analysis Lead)**
   - Primary: Cultural and subtextual analysis
   - Secondary: Technical pattern recognition
   - Focus: Implicit meanings, cultural implications, value systems
   - Output Format: Nuanced interpretation with multi-dimensional perspective

**Section Framework:**

1. **Technical Deep Dive** (GPT-4 Primary)
   ```json
   {
     "section_type": "technical",
     "components": [
       "system_architecture",
       "implementation_details",
       "performance_metrics",
       "technical_constraints",
       "optimization_opportunities"
     ],
     "output_format": "structured_analysis"
   }
   ```

2. **Contextual Analysis** (Claude Primary)
   ```json
   {
     "section_type": "contextual",
     "components": [
       "historical_background",
       "evolutionary_patterns",
       "relationship_mapping",
       "future_trajectories",
       "comparative_analysis"
     ],
     "output_format": "narrative_analysis"
   }
   ```

3. **Subtextual Insights** (Gemini Primary)
   ```json
   {
     "section_type": "subtextual",
     "components": [
       "cultural_implications",
       "value_systems",
       "implicit_assumptions",
       "stakeholder_perspectives",
       "ethical_considerations"
     ],
     "output_format": "interpretive_analysis"
   }
   ```

**Cross-Model Integration Guidelines:**

1. **Content Synthesis**
   - Each model should reference and build upon insights from others
   - Maintain consistent terminology across sections
   - Highlight complementary findings and potential contradictions

2. **Quality Metrics**
   - Technical Accuracy: Verifiable claims and methodologies
   - Contextual Depth: Clear historical and relational understanding
   - Subtextual Richness: Multiple layers of interpretation

3. **Output Structure**
   ```json
   {
     "metadata": {
       "topic": "string",
       "timestamp": "ISO-8601",
       "model_contributors": ["string"]
     },
     "executive_summary": {
       "overview": "string",
       "key_findings": ["string"]
     },
     "sections": [
       {
         "type": "string",
         "model": "string",
         "content": {
           "summary": "string",
           "analysis": "string",
           "supporting_data": ["string"],
           "cross_references": ["string"]
         }
       }
     ],
     "synthesis": {
       "integrated_insights": ["string"],
       "recommendations": ["string"]
     }
   }
   ```

**Model-Specific Instructions:**

1. **For Technical Analysis (GPT-4)**
   - Focus on system-level understanding
   - Provide concrete, implementable insights
   - Include relevant metrics and benchmarks
   - Reference authoritative technical sources

2. **For Contextual Analysis (Claude)**
   - Emphasize historical patterns and relationships
   - Draw connections across different domains
   - Provide rich narrative context
   - Map evolutionary trajectories

3. **For Subtextual Analysis (Gemini)**
   - Uncover implicit assumptions and biases
   - Analyze cultural and social implications
   - Consider multiple stakeholder perspectives
   - Identify emerging value patterns

**Integration with Vector Store:**
- Each section should include relevant embeddings
- Cross-reference related research
- Tag key concepts for future retrieval
- Enable semantic search across analyses

**Deep Research Request**

# Research Analysis: {topic}
Generated at: {timestamp}

## Overview
Analyzing {message_count} messages for insights on {topic}.

## Message Preview
{message_preview}

## Section Assignments
{section_assignments}

## Research Framework

1. Technical Analysis
- Focus on system architecture and implementation details
- Identify key technical patterns and methodologies
- Evaluate technical constraints and opportunities

2. Contextual Analysis
- Examine historical patterns and relationships
- Map evolutionary trajectories
- Identify key contextual factors

3. Subtextual Analysis
- Explore cultural implications
- Analyze value systems and ethical considerations
- Identify emerging societal patterns

## Output Format
For each section, provide:
1. Key findings
2. Supporting evidence
3. Implications
4. Recommendations