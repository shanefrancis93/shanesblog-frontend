"""
Research question generation based on selected model's expertise.
"""
from typing import List, Dict
from datetime import datetime
import logging
import json
import asyncio
import openai
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import google.generativeai as genai

from .data_models import ResearchQuestion, ResearchType, ModelType

logger = logging.getLogger(__name__)

# Load API keys from environment
openai_client = AsyncOpenAI()
anthropic_client = AsyncAnthropic()
genai.configure()

class ResearchQuestionGenerator:
    def __init__(self):
        """Initialize with model-specific prompts."""
        self.model_prompts = {
            "gpt4": """
You are an expert research question generator focusing on technical and implementation aspects.
Given a topic and context, generate 5 insightful research questions that explore:
1. Technical components and architecture
2. Implementation patterns and best practices
3. Performance considerations and optimization
4. Technical challenges and solutions
5. Future technical developments

Topic: {topic}

Context:
{context}

Generate questions that are specific, actionable, and lead to concrete technical insights.
Format each question on a new line, starting with "- ".
""",
            "claude": """
You are an expert research question generator focusing on theoretical and conceptual aspects.
Given a topic and context, generate 5 insightful research questions that explore:
1. Historical development and evolution
2. Theoretical frameworks and models
3. Conceptual relationships and patterns
4. Interdisciplinary connections
5. Future theoretical implications

Topic: {topic}

Context:
{context}

Generate questions that are thought-provoking and reveal deeper conceptual understanding.
Format each question on a new line, starting with "- ".
""",
            "gemini": """
You are an expert research question generator focusing on societal and ethical implications.
Given a topic and context, generate 5 insightful research questions that explore:
1. Ethical considerations
2. Societal impact
3. Cultural factors
4. Value systems
5. Future societal implications

Topic: {topic}

Context:
{context}

Generate questions that examine broader implications and societal effects.
Format each question on a new line, starting with "- ".
"""
        }

    async def generate_questions(self, topic: str, selected_model: str) -> List[ResearchQuestion]:
        """
        Generate research questions using the selected model's expertise.
        
        Args:
            topic: The research topic
            selected_model: The model selected for analysis
            
        Returns:
            List of ResearchQuestion objects
        """
        if selected_model not in [m.value for m in ModelType]:
            raise ValueError(f"Invalid model type: {selected_model}")

        try:
            # Get model-specific prompt
            prompt = self.model_prompts[selected_model].format(
                topic=topic,
                context="Analyze this topic considering current developments and future implications."
            )

            # Generate questions using appropriate model
            if selected_model == "gpt4":
                questions = await self._generate_with_gpt4(prompt)
            elif selected_model == "claude":
                questions = await self._generate_with_claude(prompt)
            else:  # gemini
                questions = await self._generate_with_gemini(prompt)

            # Parse and format questions
            research_questions = []
            for q in questions:
                question = ResearchQuestion(
                    question_text=q.strip("- ").strip(),
                    model=ModelType(selected_model),
                    research_type=self._determine_research_type(q),
                    category=self._determine_category(q),
                    metadata={"priority": "high", "generated_from": "llm"},
                    generated_at=datetime.now()
                )
                research_questions.append(question)

            logger.info(f"Generated {len(research_questions)} questions using {selected_model}")
            logger.debug(f"Questions: {json.dumps([q.to_dict() for q in research_questions], indent=2)}")

            return research_questions

        except Exception as e:
            logger.error(f"Error generating questions: {str(e)}")
            # Fallback to template-based questions
            logger.info("Falling back to template-based questions")
            return self._generate_template_questions(topic, selected_model)

    async def _generate_with_gpt4(self, prompt: str) -> List[str]:
        """Generate questions using GPT-4."""
        try:
            response = await openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert research question generator."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            questions = response.choices[0].message.content.strip().split("\n")
            return [q for q in questions if q.strip()]
        except Exception as e:
            logger.error(f"GPT-4 generation error: {str(e)}")
            raise

    async def _generate_with_claude(self, prompt: str) -> List[str]:
        """Generate questions using Claude."""
        try:
            response = await anthropic_client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            questions = response.content[0].text.strip().split("\n")
            return [q for q in questions if q.strip()]
        except Exception as e:
            logger.error(f"Claude generation error: {str(e)}")
            raise

    async def _generate_with_gemini(self, prompt: str) -> List[str]:
        """Generate questions using Gemini."""
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)  # Using sync version for now
            questions = response.text.strip().split("\n")
            return [q for q in questions if q.strip()]
        except Exception as e:
            logger.error(f"Gemini generation error: {str(e)}")
            raise

    def _generate_template_questions(self, topic: str, selected_model: str) -> List[ResearchQuestion]:
        """Fallback to template-based question generation."""
        templates = {
            "gpt4": [
                "What are the core technical components of {topic}?",
                "How does the implementation of {topic} compare to similar systems?",
                "What are the key performance considerations for {topic}?",
                "What technical challenges need to be addressed in {topic}?",
                "How can {topic} be optimized for better performance?"
            ],
            "claude": [
                "What is the historical development of {topic}?",
                "How does {topic} relate to existing theoretical frameworks?",
                "What patterns emerge when analyzing {topic} in different contexts?",
                "How has the understanding of {topic} evolved over time?",
                "What interdisciplinary connections exist within {topic}?"
            ],
            "gemini": [
                "What are the ethical implications of {topic}?",
                "How might {topic} impact society in the future?",
                "What cultural factors influence the development of {topic}?",
                "What value systems are embedded in {topic}?",
                "How does {topic} reflect or challenge current societal norms?"
            ]
        }

        questions = []
        for template in templates[selected_model]:
            question_text = template.format(topic=topic)
            question = ResearchQuestion(
                question_text=question_text,
                model=ModelType(selected_model),
                research_type=self._determine_research_type(question_text),
                category=self._determine_category(question_text),
                metadata={"priority": "high", "generated_from": "template"},
                generated_at=datetime.now()
            )
            questions.append(question)

        return questions

    def _determine_category(self, question: str) -> str:
        """Determine the category of a research question."""
        categories = {
            "technical": ["technical", "implementation", "performance", "system"],
            "theoretical": ["theoretical", "framework", "concept", "principle"],
            "practical": ["practical", "application", "usage", "implementation"],
            "impact": ["impact", "effect", "influence", "implications"]
        }
        
        question = question.lower()
        for category, keywords in categories.items():
            if any(keyword in question for keyword in keywords):
                return category
        return "general"
        
    def _determine_research_type(self, question: str) -> ResearchType:
        """Determine the type of research needed."""
        question = question.lower()
        
        if any(word in question for word in ["how", "implementation", "system", "technical"]):
            return ResearchType.TECHNICAL
        elif any(word in question for word in ["why", "theory", "framework", "concept"]):
            return ResearchType.ACADEMIC
        elif any(word in question for word in ["future", "trend", "potential", "impact"]):
            return ResearchType.TREND
        else:
            return ResearchType.GENERAL
