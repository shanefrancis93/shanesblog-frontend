"""
O3 interface and prompt optimization for deep research queries.
"""
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import json
import logging
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import google.generativeai as genai

from .data_models import ResearchQuestion, ResearchPrompt, ResearchType

logger = logging.getLogger(__name__)

# Initialize clients
openai_client = AsyncOpenAI()
anthropic_client = AsyncAnthropic()
genai.configure()

# O3 Capability Template
O3_CAPABILITY_TEMPLATE = """
Overview:
---------
O3 is OpenAI's newly launched agentic research capability designed to perform multi-step research on the internet for complex tasks. It uses advanced reasoning, web browsing, and data analysis to complete in minutes what would take a human many hours.

Capabilities:
-------------
- **Multi-Step Research:** Independently searches for, analyzes, and synthesizes hundreds of online sources.
- **Comprehensive Analysis:** Adjusts its research trajectory based on newly encountered data, ensuring a deep dive into the subject.
- **Verified Reporting:** Produces detailed reports with clear citations, explanations of its reasoning, and evidence-based conclusions.
- **Integrated Visuals:** Capable of embedding images, graphs, and data visualizations to enhance clarity.
- **Flexible Application:** Suited for intensive knowledge work in areas such as finance, science, policy, engineering, and even personalized consumer recommendations.

Output Structure:
----------------
1. Executive Summary
   - Key findings and insights
   - Critical patterns identified
   - Major implications

2. Detailed Research Methodology
   - Search strategies employed
   - Sources evaluated
   - Analysis techniques used

3. Comprehensive Findings
   - Detailed analysis by sub-question
   - Supporting evidence and data
   - Counter-arguments and limitations

4. Source Documentation
   - Full citations
   - Credibility assessment
   - Access timestamps

5. Visual Elements
   - Relevant charts/graphs
   - Data visualizations
   - Supporting images

6. Future Implications
   - Emerging trends
   - Potential developments
   - Areas for further research
"""

@dataclass
class O3Query:
    """Structured format for O3 research queries."""
    main_query: str
    sub_questions: List[str]
    context: str
    methodology_requirements: List[str]
    source_requirements: List[str]
    output_format: Dict[str, any]
    metadata: Dict[str, any]

class O3PromptGenerator:
    """Generates optimized prompts for O3 deep research system."""
    
    def __init__(self):
        self.optimization_prompt = """
You are an expert in optimizing research queries for O3, an advanced agentic research system.
Given a research prompt and its context, optimize it for maximum effectiveness.

Consider:
1. Query clarity and specificity
2. Research methodology requirements
3. Source quality criteria
4. Output structure and format

Research Topic: {topic}
Context: {context}
Questions:
{questions}

Provide a JSON response with:
{
    "optimized_query": "string",
    "methodology": ["list", "of", "requirements"],
    "sources": ["list", "of", "requirements"],
    "output_format": {
        "structure": "string",
        "requirements": ["list", "of", "format", "requirements"]
    },
    "reasoning": "string"
}
"""

    async def generate_o3_query(self, research_prompt: ResearchPrompt) -> O3Query:
        """
        Transform a research prompt into an optimized O3 query.
        
        Args:
            research_prompt: Structured research prompt
            
        Returns:
            O3Query object ready for submission
        """
        try:
            # Get optimization from GPT-4
            response = await openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert in research query optimization."},
                    {"role": "user", "content": self.optimization_prompt.format(
                        topic=research_prompt.topic,
                        context=research_prompt.context,
                        questions="\n".join(f"- {q.question_text}" for q in research_prompt.questions)
                    )}
                ],
                temperature=0.3
            )
            
            # Parse optimization
            optimization = json.loads(response.choices[0].message.content)
            
            # Create O3 query
            query = O3Query(
                main_query=optimization["optimized_query"],
                sub_questions=[q.question_text for q in research_prompt.questions],
                context=research_prompt.context,
                methodology_requirements=optimization["methodology"],
                source_requirements=optimization["sources"],
                output_format={
                    **optimization["output_format"],
                    **self._get_output_format(research_prompt.research_type)
                },
                metadata={
                    "generated_at": datetime.now().isoformat(),
                    "research_type": research_prompt.research_type.value,
                    "original_prompt_id": id(research_prompt),
                    "optimization_reasoning": optimization["reasoning"]
                }
            )
            
            logger.info(f"Generated O3 query for topic: {research_prompt.topic}")
            logger.debug(f"Query details: {json.dumps(query.__dict__, indent=2)}")
            logger.info(f"Optimization reasoning: {optimization['reasoning']}")
            
            return query
            
        except Exception as e:
            logger.error(f"Error generating O3 query: {str(e)}")
            logger.info("Falling back to template-based generation")
            return self._fallback_generation(research_prompt)

    async def format_query(self, query: O3Query) -> str:
        """Format O3Query into a comprehensive research prompt."""
        try:
            # Get formatting from Claude
            response = await anthropic_client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=2000,
                messages=[{
                    "role": "user",
                    "content": f"""
Format this research query for O3 deep research system.
Make it clear, structured, and optimized for comprehensive research.

Query: {query.main_query}

Sub-Questions:
{chr(10).join(f"- {q}" for q in query.sub_questions)}

Context:
{query.context}

Methodology Requirements:
{chr(10).join(query.methodology_requirements)}

Source Requirements:
{chr(10).join(query.source_requirements)}

Output Format:
{json.dumps(query.output_format, indent=2)}

Format it in a way that maximizes research effectiveness while maintaining clarity.
"""
                }]
            )
            
            formatted_query = response.content[0].text.strip()
            
            # Add O3 capability explanation
            final_query = O3_CAPABILITY_TEMPLATE + "\n\n" + formatted_query
            
            return final_query
            
        except Exception as e:
            logger.error(f"Error formatting O3 query: {str(e)}")
            logger.info("Falling back to template-based formatting")
            return self._fallback_formatting(query)

    def _fallback_generation(self, research_prompt: ResearchPrompt) -> O3Query:
        """Fallback to template-based query generation."""
        return O3Query(
            main_query=f"Conduct comprehensive research on: {research_prompt.topic}",
            sub_questions=[q.question_text for q in research_prompt.questions],
            context=research_prompt.context,
            methodology_requirements=self._get_methodology(research_prompt.research_type),
            source_requirements=self._get_source_requirements(research_prompt.research_type),
            output_format=self._get_output_format(research_prompt.research_type),
            metadata={
                "generated_at": datetime.now().isoformat(),
                "research_type": research_prompt.research_type.value,
                "original_prompt_id": id(research_prompt),
                "generation_method": "template"
            }
        )

    def _fallback_formatting(self, query: O3Query) -> str:
        """Fallback to template-based query formatting."""
        return f"""
{O3_CAPABILITY_TEMPLATE}

Research Query:
--------------
{query.main_query}

Sub-Questions to Investigate:
---------------------------
{chr(10).join(f"- {q}" for q in query.sub_questions)}

Context and Background:
---------------------
{query.context}

Research Methodology Requirements:
------------------------------
{chr(10).join(query.methodology_requirements)}

Source Requirements and Quality Criteria:
-------------------------------------
{chr(10).join(query.source_requirements)}

Output Format Requirements:
------------------------
{json.dumps(query.output_format, indent=2)}

Additional Considerations:
------------------------
- Accuracy: Prioritize credible, authoritative sources
- Transparency: Document all steps, tools, and sources
- Limitations: Acknowledge any areas of uncertainty
- Visuals: Include relevant charts, graphs, or diagrams where possible
"""

    def _get_methodology(self, research_type: ResearchType) -> List[str]:
        """Get methodology requirements based on research type."""
        type_specific = {
            ResearchType.TECHNICAL: [
                "Technical Analysis Requirements:",
                "- Review technical documentation and specifications",
                "- Analyze implementation patterns and best practices",
                "- Evaluate performance metrics and benchmarks",
                "- Assess technical feasibility and constraints"
            ],
            ResearchType.ACADEMIC: [
                "Academic Research Requirements:",
                "- Review peer-reviewed literature",
                "- Analyze theoretical frameworks",
                "- Evaluate empirical evidence",
                "- Consider competing theories"
            ],
            ResearchType.TREND: [
                "Trend Analysis Requirements:",
                "- Analyze market reports and forecasts",
                "- Review expert predictions and insights",
                "- Evaluate emerging patterns and developments",
                "- Consider future scenarios and implications"
            ]
        }
        return type_specific.get(research_type, []) + [
            "1. Multi-Step Research Process:",
            "   - Start with broad topic exploration",
            "   - Identify key themes and patterns",
            "   - Deep dive into specific aspects",
            "   - Cross-reference findings",
            "2. Source Evaluation:",
            "   - Assess source credibility",
            "   - Verify information across multiple sources",
            "   - Consider source biases and limitations",
            "3. Analysis Techniques:",
            "   - Pattern recognition across sources",
            "   - Comparative analysis of viewpoints",
            "   - Temporal trend analysis",
            "   - Impact assessment",
            "4. Synthesis and Integration:",
            "   - Connect findings across sources",
            "   - Identify emerging themes",
            "   - Draw evidence-based conclusions"
        ]

    def _get_source_requirements(self, research_type: ResearchType) -> List[str]:
        """Get source requirements based on research type."""
        type_specific = {
            ResearchType.TECHNICAL: [
                "Technical Sources:",
                "- Technical documentation",
                "- API specifications",
                "- Implementation guides",
                "- Performance benchmarks",
                "- System architecture documents"
            ],
            ResearchType.ACADEMIC: [
                "Academic Sources:",
                "- Peer-reviewed journals",
                "- Conference proceedings",
                "- Research institutions",
                "- Academic databases",
                "- Theoretical frameworks"
            ],
            ResearchType.TREND: [
                "Trend Analysis Sources:",
                "- Market research reports",
                "- Industry analyses",
                "- Expert forecasts",
                "- Recent developments",
                "- Innovation patterns"
            ]
        }
        return type_specific.get(research_type, []) + [
            "Primary Sources:",
            "- Academic journals and peer-reviewed papers",
            "- Technical documentation and specifications",
            "- Official reports and white papers",
            "- Expert interviews and testimonies",
            
            "Secondary Sources:",
            "- Industry analyses and market reports",
            "- Expert commentary and analysis",
            "- Case studies and implementations",
            "- Recent developments and news",
            
            "Quality Criteria:",
            "- Credibility of authors/institutions",
            "- Recency of information",
            "- Methodological rigor",
            "- Citation frequency and impact"
        ]

    def _get_output_format(self, research_type: ResearchType) -> Dict[str, any]:
        """Get output format requirements based on research type."""
        type_specific = {
            ResearchType.TECHNICAL: {
                "code_examples": "required",
                "performance_metrics": "required",
                "implementation_details": "detailed"
            },
            ResearchType.ACADEMIC: {
                "theoretical_framework": "required",
                "methodology_detail": "extensive",
                "citation_density": "high"
            },
            ResearchType.TREND: {
                "trend_graphs": "required",
                "forecast_scenarios": "detailed",
                "market_data": "current"
            }
        }
        return {
            **{
                "structure": "hierarchical",
                "citation_style": "inline_with_links",
                "visual_elements": "embedded",
                "reasoning_transparency": "explicit",
                "uncertainty_notation": "clearly_marked"
            },
            **type_specific.get(research_type, {})
        }
