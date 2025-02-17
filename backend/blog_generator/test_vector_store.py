"""Test the vector store with user messages"""

import json
from pathlib import Path
from vector_store import VectorStore, Document
from democracy import TextProcessor

def main():
    # Initialize vector store
    store = VectorStore(persist_directory="vector_db")
    
    # Create collection for user messages
    store.create_collection("user_messages")
    
    # Process user messages
    processor = TextProcessor()
    file_path = Path("raw_text/avatars.md")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract messages
    messages = processor.extract_user_messages(content)
    
    # Convert messages to documents
    docs = []
    for msg in messages:
        doc = Document(
            content=msg.content,
            metadata={
                "duration": msg.duration,
                "position": str(msg.position)
            }
        )
        docs.append(doc)
        
    # Add to vector store
    store.add_documents("user_messages", docs)
    
    # Test some queries
    test_queries = [
        "AI and human collaboration",
        "theory of mind and consciousness",
        "political implications of AI",
        "social media and engagement"
    ]
    
    print("\nTesting Queries:")
    for query in test_queries:
        print(f"\nQuery: {query}")
        results = store.query_similar("user_messages", query, n_results=2)
        for result in results:
            print(f"\nContent: {result['content']}")
            print(f"Position: {result['metadata']['position']}")
            print(f"Duration: {result['metadata']['duration']}")
            print(f"Similarity: {1 - result['distance']:.2%}")

if __name__ == "__main__":
    main()
