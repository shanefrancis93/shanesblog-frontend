"""
Processes raw text files containing user messages and converts them into a structured format.
Handles extraction and formatting of timestamped user messages from conversation transcripts.
"""

from pathlib import Path
from dataclasses import dataclass
from typing import List
import re

@dataclass
class Message:
    """Represents a user message with timestamp and position"""
    timestamp: str
    position: int
    content: str

class MessageProcessor:
    def __init__(self):
        """Initialize message processor"""
        self.base_path = Path(__file__).parent
        
    def extract_messages(self, content: str) -> List[Message]:
        """Extract messages from raw content
        
        Args:
            content: Raw text content to extract messages from
            
        Returns:
            List of Message objects containing user messages
        """
        messages = []
        
        # Split content into chunks at "You said:"
        chunks = content.split("You said:")
        
        # Process each chunk after "You said:"
        for idx, chunk in enumerate(chunks[1:], 1):
            # Try to find timestamp
            timestamp_match = re.search(r'(\d{2}:\d{2})', chunk)
            if timestamp_match:
                timestamp = timestamp_match.group(1)
                
                # Get content before timestamp
                content_parts = chunk.split(timestamp)
                if len(content_parts) > 0:
                    content = content_parts[0].strip()
                    
                    # Clean up content
                    content = content.replace('"', '').strip()
                    content = ' '.join(content.split())  # Normalize whitespace
                    
                    if content and content != "Transcript Unavailable":
                        message = Message(
                            timestamp=timestamp,
                            position=idx,
                            content=content
                        )
                        messages.append(message)
        
        return messages
    
    def format_markdown(self, messages: List[Message]) -> str:
        """Format messages as markdown
        
        Args:
            messages: List of Message objects to format
            
        Returns:
            Formatted markdown string
        """
        markdown = "# Processed Messages\n\n"
        
        for msg in messages:
            markdown += f"## Message {msg.position} ({msg.timestamp})\n\n"
            markdown += f"{msg.content}\n\n"
            markdown += "---\n\n"
        
        return markdown
    
    def process_file(self, input_path: Path) -> Path:
        """Process raw text file and extract user messages
        
        Args:
            input_path: Path to raw text file
            
        Returns:
            Path to processed markdown file
        """
        # Read input file
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract and process messages
        messages = self.extract_messages(content)
        markdown = self.format_markdown(messages)
        
        # Write processed output
        output_path = self.base_path / 'processed_text' / f"{input_path.stem}_processed.md"
        output_path.parent.mkdir(exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown)
            
        return output_path

def process_raw_text(file_path: str) -> str:
    """Convenience function to process a raw text file
    
    Args:
        file_path: Path to raw text file as string
        
    Returns:
        Path to processed markdown file as string
    """
    processor = MessageProcessor()
    input_path = Path(file_path)
    output_path = processor.process_file(input_path)
    return str(output_path)
