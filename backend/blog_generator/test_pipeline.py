"""
Test runner for the blog generation pipeline
"""

import asyncio
import logging
from pathlib import Path
from datetime import datetime
from blog_generator import BlogGenerator
from llm_orchestrator import LLMOrchestrator, LLMType
import config

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pipeline.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class PipelineTester:
    def __init__(self):
        self.generator = BlogGenerator()
        logger.info("Initialized BlogGenerator")
        
    async def test_ragflow_connection(self):
        """Test RAGFlow connectivity and dataset access"""
        logger.info("Testing RAGFlow connection...")
        try:
            datasets = self.generator.orchestrator.rag_client.list_datasets()
            logger.info(f"Found {len(datasets)} datasets:")
            for dataset in datasets:
                logger.info(f"- {dataset.name} (ID: {dataset.id})")
            return True
        except Exception as e:
            logger.error(f"RAGFlow connection error: {e}")
            return False
    
    async def test_llm_connections(self):
        """Test connections to all LLM APIs"""
        logger.info("Testing LLM connections...")
        test_prompt = "This is a test prompt. Please respond with 'OK' if you can read this."
        
        results = {}
        for llm_type in LLMType:
            try:
                logger.info(f"Testing {llm_type.value}...")
                response = await self.generator.orchestrator.generate_blog_section(
                    prompt=test_prompt,
                    llm_type=llm_type
                )
                results[llm_type.value] = "OK" if response else "No response"
                logger.info(f"{llm_type.value}: {results[llm_type.value]}")
            except Exception as e:
                logger.error(f"Error testing {llm_type.value}: {e}")
                results[llm_type.value] = f"Error: {str(e)}"
        
        return results
    
    async def generate_test_blog(self, test_file: str = "test_posts/ai_ethics_test.md"):
        """Run complete blog generation pipeline"""
        logger.info(f"Starting blog generation for {test_file}")
        
        try:
            # Test RAGFlow first
            if not await self.test_ragflow_connection():
                logger.error("RAGFlow connection failed, aborting blog generation")
                return False
            
            # Test LLM connections
            llm_results = await self.test_llm_connections()
            if any("Error" in result for result in llm_results.values()):
                logger.warning("Some LLM connections failed, but continuing with available models")
            
            # Generate blog post
            start_time = datetime.now()
            logger.info("Starting blog generation...")
            
            blog_post = await self.generator.generate_blog_post(test_file)
            
            end_time = datetime.now()
            duration = end_time - start_time
            
            # Log results
            logger.info(f"Blog generation completed in {duration}")
            logger.info("Generated sections:")
            for section, content in blog_post.content.items():
                logger.info(f"- {section}: {len(content)} characters")
            
            return True
            
        except Exception as e:
            logger.error(f"Error in blog generation pipeline: {e}")
            return False

async def main():
    """Main test runner"""
    tester = PipelineTester()
    
    logger.info("Starting pipeline test")
    success = await tester.generate_test_blog()
    
    if success:
        logger.info("Pipeline test completed successfully")
    else:
        logger.error("Pipeline test failed")

if __name__ == "__main__":
    asyncio.run(main())
