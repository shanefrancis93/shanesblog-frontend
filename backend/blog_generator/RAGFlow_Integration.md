# RAGFlow SDK Integration Guide

This guide explains how to integrate RAGFlow with Python applications for powerful retrieval-augmented generation capabilities.

## Prerequisites

- Python 3.x
- RAGFlow SDK (`pip install ragflow-sdk`)
- Running RAGFlow server (default: http://localhost:9380)
- API Key for authentication

## Quick Start

```python
from ragflow_sdk import RAGFlow

# Initialize RAGFlow client
rag_client = RAGFlow(
    api_key="your-api-key",
    base_url="http://localhost:9380"  # or your server URL
)
```

## Working with Datasets

### List Available Datasets
```python
# Get all datasets
datasets = rag_client.list_datasets()

# Get specific dataset by name
specific_datasets = rag_client.list_datasets(name="your_dataset_name")

# Access dataset properties
for dataset in datasets:
    print(f"Name: {dataset.name}")
    print(f"ID: {dataset.id}")
```

### Create New Dataset
```python
new_dataset = rag_client.create_dataset(
    name="my_dataset",
    description="Dataset description",
    language="English",
    permission="me",
    chunk_method="naive"
)
```

## Searching and Retrieving Content

### Basic Search
```python
# Search across one or more datasets
chunks = rag_client.retrieve(
    question="Your search query here",
    dataset_ids=[dataset.id],  # List of dataset IDs to search
    similarity_threshold=0.2    # Minimum similarity score (0-1)
)

# Process search results
for chunk in chunks:
    print(f"Content: {chunk.content}")
```

### Advanced Search Options
```python
chunks = rag_client.retrieve(
    question="Your search query",
    dataset_ids=[dataset.id],
    similarity_threshold=0.2,
    vector_similarity_weight=0.3,  # Weight for vector similarity (0-1)
    top_k=1024,                   # Maximum number of results
    keyword=True,                 # Enable keyword search
    rerank_id=None               # Optional reranking model ID
)
```

## Creating Chat Assistants

### Basic Chat Setup
```python
# Create a chat assistant with access to specific datasets
assistant = rag_client.create_chat(
    name="Assistant Name",
    dataset_ids=[dataset.id]
)

# Update assistant settings
assistant.update({
    "name": "New Name",
    "llm": {
        "temperature": 0.8
    },
    "prompt": {
        "top_n": 8
    }
})
```

## Common Issues and Solutions

### 1. Dataset IDs Required Error
If you get "`dataset_ids` is required" error, ensure:
- You're passing a list of dataset IDs, not a single ID
- The dataset IDs are valid and accessible
```python
# Correct way
dataset_ids = [dataset.id]  # Must be a list
chunks = rag_client.retrieve(dataset_ids=dataset_ids, question="query")
```

### 2. SDK Version Issues
For RAGFlow SDK version 0.13 and earlier, there's a known bug where "datasets" is used instead of "dataset_ids". Fix:
1. Locate ragflow.py in your Python packages
2. Change "datasets" to "dataset_ids" in the retrieve method
```python
# In ragflow.py, change:
"datasets": dataset_ids  # Old
"dataset_ids": dataset_ids  # New
```

## Best Practices

1. **Error Handling**
```python
try:
    chunks = rag_client.retrieve(
        question="query",
        dataset_ids=[dataset.id]
    )
except Exception as e:
    print(f"Error: {e}")
    # Handle error appropriately
```

2. **Resource Management**
- Keep dataset IDs for frequently used datasets
- Reuse RAGFlow client instance
- Use appropriate similarity thresholds (0.2 is a good default)

3. **Performance Optimization**
- Limit top_k for faster responses
- Use keyword search for precise matches
- Adjust similarity threshold based on needs

## Example Implementation

```python
class RAGFlowManager:
    def __init__(self, api_key, base_url):
        self.client = RAGFlow(api_key=api_key, base_url=base_url)
        self.datasets = {}
        self._load_datasets()
    
    def _load_datasets(self):
        """Cache available datasets"""
        datasets = self.client.list_datasets()
        for dataset in datasets:
            self.datasets[dataset.name] = dataset.id
    
    def search(self, query, dataset_names=None):
        """Search across specified datasets"""
        dataset_ids = []
        if dataset_names:
            dataset_ids = [self.datasets[name] for name in dataset_names 
                         if name in self.datasets]
        else:
            dataset_ids = list(self.datasets.values())
        
        return self.client.retrieve(
            question=query,
            dataset_ids=dataset_ids,
            similarity_threshold=0.2
        )

# Usage
manager = RAGFlowManager(
    api_key="your-api-key",
    base_url="http://localhost:9380"
)

results = manager.search("What is AI ethics?", ["AI Ethics Dataset"])
```

## Additional Resources

- [RAGFlow Documentation](https://docs.ragflow.ai)
- [API Reference](https://api.ragflow.ai)
- [GitHub Repository](https://github.com/ragflow/ragflow)
