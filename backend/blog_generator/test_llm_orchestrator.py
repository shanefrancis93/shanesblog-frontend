"""
Test suite for LLM Orchestrator functionality
"""

import unittest
import asyncio
from unittest.mock import Mock, patch
from llm_orchestrator import LLMOrchestrator, LLMType
import config

class TestLLMOrchestrator(unittest.TestCase):
    """Test cases for LLMOrchestrator"""
    
    def setUp(self):
        """Set up test environment"""
        self.orchestrator = LLMOrchestrator(
            ragflow_config=config.RAGFLOW_CONFIG,
            llm_configs=config.LLM_CONFIGS
        )
    
    @patch('ragflow_sdk.RAGFlow')
    def test_dataset_loading(self, mock_ragflow):
        """Test dataset loading functionality"""
        # Mock dataset response
        mock_dataset = Mock()
        mock_dataset.name = "AI Ethics and Culture Research"
        mock_dataset.id = "test_id"
        mock_ragflow.return_value.list_datasets.return_value = [mock_dataset]
        
        # Create orchestrator with mock
        orchestrator = LLMOrchestrator(
            ragflow_config=config.RAGFLOW_CONFIG,
            llm_configs=config.LLM_CONFIGS
        )
        
        # Verify dataset was loaded
        self.assertIn("AI Ethics and Culture Research", orchestrator.datasets)
        self.assertEqual(orchestrator.datasets["AI Ethics and Culture Research"], "test_id")
    
    @patch('ragflow_sdk.RAGFlow')
    async def test_context_retrieval(self, mock_ragflow):
        """Test context retrieval from RAGFlow"""
        # Mock chunk response
        mock_chunk = Mock()
        mock_chunk.content = "Test context content"
        mock_ragflow.return_value.retrieve.return_value = [mock_chunk]
        
        # Get context
        context = await self.orchestrator.get_context(
            query="test query",
            dataset_names=["AI Ethics and Culture Research"]
        )
        
        # Verify context was retrieved
        self.assertEqual(len(context), 1)
        self.assertEqual(context[0], "Test context content")
    
    @patch('openai.OpenAI')
    async def test_chatgpt_generation(self, mock_openai):
        """Test content generation with ChatGPT"""
        # Mock ChatGPT response
        mock_response = Mock()
        mock_response.choices = [Mock(message=Mock(content="ChatGPT generated content"))]
        mock_openai.return_value.chat.completions.create.return_value = mock_response
        
        # Generate content
        content = await self.orchestrator.generate_with_chatgpt(
            prompt="test prompt",
            context=["test context"]
        )
        
        # Verify content was generated
        self.assertEqual(content, "ChatGPT generated content")
    
    @patch('anthropic.Anthropic')
    async def test_claude_generation(self, mock_anthropic):
        """Test content generation with Claude"""
        # Mock Claude response
        mock_response = Mock()
        mock_response.content = [Mock(text="Claude generated content")]
        mock_anthropic.return_value.messages.create.return_value = mock_response
        
        # Generate content
        content = await self.orchestrator.generate_with_claude(
            prompt="test prompt",
            context=["test context"]
        )
        
        # Verify content was generated
        self.assertEqual(content, "Claude generated content")
    
    @patch('google.generativeai.GenerativeModel')
    async def test_gemini_generation(self, mock_gemini):
        """Test content generation with Gemini"""
        # Mock Gemini response
        mock_response = Mock()
        mock_response.text = "Gemini generated content"
        mock_gemini.return_value.generate_content.return_value = mock_response
        
        # Generate content
        content = await self.orchestrator.generate_with_gemini(
            prompt="test prompt",
            context=["test context"]
        )
        
        # Verify content was generated
        self.assertEqual(content, "Gemini generated content")
    
    @patch('llm_orchestrator.LLMOrchestrator.get_context')
    @patch('llm_orchestrator.LLMOrchestrator.generate_with_chatgpt')
    async def test_blog_section_generation(self, mock_generate, mock_get_context):
        """Test complete blog section generation"""
        # Mock context and generation
        mock_get_context.return_value = ["Test context"]
        mock_generate.return_value = "Generated blog section"
        
        # Generate blog section
        content = await self.orchestrator.generate_blog_section(
            prompt="test prompt",
            llm_type=LLMType.CHATGPT
        )
        
        # Verify section was generated
        self.assertEqual(content, "Generated blog section")
        mock_get_context.assert_called_once()
        mock_generate.assert_called_once()
    
    @patch('llm_orchestrator.LLMOrchestrator.generate_blog_section')
    async def test_full_blog_generation(self, mock_generate_section):
        """Test complete blog post generation"""
        # Mock section generation
        mock_generate_section.return_value = "Generated section content"
        
        # Generate blog post
        blog_post = await self.orchestrator.generate_blog_post(
            title="Test Blog",
            sections=[
                {
                    "name": "intro",
                    "prompt": "Write an introduction",
                    "llm_type": LLMType.CHATGPT
                },
                {
                    "name": "body",
                    "prompt": "Write the main content",
                    "llm_type": LLMType.CLAUDE
                }
            ]
        )
        
        # Verify blog post structure
        self.assertEqual(blog_post["title"], "Test Blog")
        self.assertEqual(len(blog_post["sections"]), 2)
        self.assertEqual(blog_post["sections"]["intro"], "Generated section content")
        self.assertEqual(blog_post["sections"]["body"], "Generated section content")

def run_tests():
    """Run all tests"""
    unittest.main()

if __name__ == "__main__":
    run_tests()
