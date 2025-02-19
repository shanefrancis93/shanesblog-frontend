from ragflow_sdk import RAGFlow
import os
import json
from typing import List, Dict

class RAGTester:
    def __init__(self):
        self.rag_client = RAGFlow(
            api_key="ragflow-FlN2VlNjcyZWU1ZDExZWY4ZTI5MDI0Mm",
            base_url="http://localhost:9380"
        )
    
    def test_list_datasets(self):
        """Test listing all datasets."""
        print("\nTesting list_datasets:")
        try:
            datasets = self.rag_client.list_datasets()
            print(f"Found {len(datasets)} datasets:")
            for dataset in datasets:
                print(f"\nDataset: {dataset.name}")
                print(f"ID: {dataset.id}")
                print(f"Metadata: {dataset.__dict__}")
            return datasets
        except Exception as e:
            print(f"Error listing datasets: {e}")
            return []

    def test_search(self, query: str, datasets: List):
        """Test search functionality with datasets."""
        print(f"\nTesting search with query: {query}")
        try:
            # Get dataset IDs from dataset objects
            dataset_ids = []
            for dataset in datasets:
                dataset_ids.append(dataset.id)
                print(f"Added dataset: {dataset.name} (ID: {dataset.id})")
            
            print(f"\nSearching in {len(dataset_ids)} datasets")
            print("Dataset IDs:", dataset_ids)
            
            # Call retrieve with dataset IDs
            print("\nCalling retrieve...")
            chunks = self.rag_client.retrieve(
                question=query,
                dataset_ids=dataset_ids,
                similarity_threshold=0.2
            )
            
            print("\nSearch results:")
            for i, chunk in enumerate(chunks, 1):
                print(f"\nResult {i}:")
                print(f"Content: {chunk.content}")
                print(f"Metadata: {chunk.__dict__}")
            
            if not chunks:
                print("No results found.")
            
            return chunks
        except Exception as e:
            print(f"Error performing search: {e}")
            print(f"Error type: {type(e)}")
            print(f"Error args: {e.args}")
            return []

def main():
    tester = RAGTester()
    
    # Test dataset listing
    datasets = tester.test_list_datasets()
    
    if datasets:
        # Search in all datasets to see what content exists
        print("\nSearching all datasets...")
        tester.test_search(
            query="What content exists in these datasets?",
            datasets=datasets
        )
    else:
        print("No datasets found to search in.")

if __name__ == "__main__":
    main()
