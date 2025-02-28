"""
Vector store module for managing embeddings and similarity search.
Uses Chroma as a lightweight vector database and sentence-transformers for embeddings.
"""

import os
from pathlib import Path
from typing import List, Dict, Optional, Union, Any
from dataclasses import dataclass
import json
from datetime import datetime
import logging
import uuid
import traceback

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import openai

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('vector_store.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class Document:
    """Represents a document to be stored in the vector database"""
    content: str
    metadata: Dict[str, str]
    id: Optional[str] = None

    def __post_init__(self):
        """Validate metadata after initialization"""
        if not isinstance(self.metadata, dict):
            raise ValueError(f"metadata must be a dict, got {type(self.metadata)}")
            
        # Ensure all metadata values are strings
        sanitized = {}
        for key, value in self.metadata.items():
            if value is None:
                sanitized[key] = ""  # Convert None to empty string
            else:
                sanitized[key] = str(value)  # Convert all values to strings
        self.metadata = sanitized

@dataclass
class ResearchSection:
    """Enhanced document type for research sections"""
    content: str
    metadata: Dict[str, str]
    section_type: str  # e.g., "core_analysis", "technical", "emerging_trends"
    embedding_config: Dict[str, Any]
    id: Optional[str] = None

@dataclass
class Section:
    """Represents a section to be stored in the vector database"""
    content: str
    metadata: Dict[str, str]
    title: str
    summary: str
    body: str

class VectorStore:
    def __init__(self, 
                 persist_directory: Optional[str] = None,
                 model_name: str = 'text-embedding-ada-002',
                 embedding_config: Optional[Dict[str, Any]] = None):
        """Initialize vector store with configurable embedding model
        
        Args:
            persist_directory: Directory to persist the database
            model_name: Name of embedding model to use
            embedding_config: Configuration for embedding generation
        """
        self.base_path = Path(__file__).parent
        
        # Initialize Chroma client with optimized settings
        if persist_directory:
            persist_path = self.base_path / persist_directory
            persist_path.mkdir(parents=True, exist_ok=True)
            self.client = chromadb.PersistentClient(
                path=str(persist_path),
                settings=Settings(
                    anonymized_telemetry=False,
                    allow_reset=True
                )
            )
        else:
            self.client = chromadb.Client(Settings(
                is_persistent=False,
                anonymized_telemetry=False
            ))

        # Configure embedding model
        self.model_name = model_name
        self.embedding_config = embedding_config or {}
        
        if model_name == 'text-embedding-ada-002':
            self.embed = lambda text: openai.Embedding.create(
                input=text, 
                model=model_name
            )["data"][0]["embedding"]
        else:
            self.model = SentenceTransformer(model_name)
            self.embed = self.model.encode
            
        # Initialize section performance tracking
        self.section_metrics = {
            "core_analysis": {"success_rate": 0.0, "total_attempts": 0},
            "long_context": {"success_rate": 0.0, "total_attempts": 0},
            "subtextual": {"success_rate": 0.0, "total_attempts": 0},
            "technical": {"success_rate": 0.0, "total_attempts": 0},
            "emerging_trends": {"success_rate": 0.0, "total_attempts": 0},
            "recommendations": {"success_rate": 0.0, "total_attempts": 0}
        }
        
        # Create or get research collection
        self.research_collection = self.client.get_or_create_collection(
            name="research_sections",
            metadata={
                "description": "Research sections with performance tracking",
                "embedding_model": model_name,
                "embedding_config": embedding_config
            }
        )
        
    async def store_research_section(
        self,
        section: Section,
        model_name: str,
        section_type: str,
        similarity_threshold: float = 0.7
    ) -> Dict[str, float]:
        """Store research section with performance tracking
        
        Args:
            section: Section to store
            model_name: Name of model that generated the section
            section_type: Type of section (e.g., "technical", "subtextual")
            similarity_threshold: Threshold for similarity comparison
            
        Returns:
            Dictionary of quality metrics
        """
        # Calculate section embedding
        section_text = f"{section.title}\n{section.summary}\n{section.body}"
        embedding = self.embed(section_text)
        
        # Check similarity with existing sections
        similar_sections = await self.similarity_search(
            section_text,
            k=3,
            threshold=similarity_threshold
        )
        
        # Calculate quality metrics
        metrics = self._calculate_section_metrics(
            section,
            similar_sections,
            section_type
        )
        
        # Update section performance tracking
        self._update_metrics(section_type, metrics["quality_score"])
        
        # Store section with enhanced metadata
        self.research_collection.add(
            embeddings=[embedding],
            documents=[section_text],
            metadatas=[{
                **section.metadata,
                "model": model_name,
                "section_type": section_type,
                "quality_score": metrics["quality_score"],
                "novelty_score": metrics["novelty_score"],
                "coherence_score": metrics["coherence_score"],
                "timestamp": datetime.now().isoformat()
            }]
        )
        
        return metrics
        
    def _calculate_section_metrics(
        self,
        section: Section,
        similar_sections: List[Document],
        section_type: str
    ) -> Dict[str, float]:
        """Calculate quality metrics for section
        
        Args:
            section: Section to evaluate
            similar_sections: List of similar sections found
            section_type: Type of section being evaluated
            
        Returns:
            Dictionary containing quality metrics
        """
        metrics = {
            "quality_score": 0.0,
            "novelty_score": 0.0,
            "coherence_score": 0.0
        }
        
        # Calculate novelty (difference from existing sections)
        if similar_sections:
            avg_similarity = sum(doc.metadata.get("similarity", 0) for doc in similar_sections) / len(similar_sections)
            metrics["novelty_score"] = 1.0 - avg_similarity
        else:
            metrics["novelty_score"] = 1.0  # Completely novel
            
        # Assess coherence (structure and completeness)
        coherence_factors = {
            "title_length": len(section.title.split()) >= 3,
            "summary_length": len(section.summary.split()) >= 20,
            "body_length": len(section.body.split()) >= 100,
            "structure": all(hasattr(section, field) for field in ["title", "summary", "body"]),
            "metadata_complete": all(key in section.metadata for key in ["timestamp", "section_type"])
        }
        metrics["coherence_score"] = sum(coherence_factors.values()) / len(coherence_factors)
        
        # Calculate overall quality score with weights
        metrics["quality_score"] = (
            metrics["novelty_score"] * 0.4 +
            metrics["coherence_score"] * 0.6
        )
        
        return metrics
        
    def _update_metrics(self, section_type: str, quality_score: float):
        """Update section performance tracking
        
        Args:
            section_type: Type of section to update metrics for
            quality_score: Quality score achieved
        """
        metrics = self.section_metrics[section_type]
        metrics["total_attempts"] += 1
        metrics["success_rate"] = (
            (metrics["success_rate"] * (metrics["total_attempts"] - 1) + quality_score) /
            metrics["total_attempts"]
        )
        
    def get_section_performance(self, section_type: Optional[str] = None) -> Dict[str, Dict[str, float]]:
        """Get performance metrics for sections
        
        Args:
            section_type: Optional specific section type to get metrics for
            
        Returns:
            Dictionary of section metrics
        """
        if section_type:
            return {section_type: self.section_metrics[section_type]}
        return self.section_metrics.copy()
        
    async def similarity_search(
        self,
        query: str,
        k: int = 5,
        threshold: float = 0.7,
        section_type: Optional[str] = None
    ) -> List[Document]:
        """Enhanced similarity search with filtering
        
        Args:
            query: Search query
            k: Number of results to return
            threshold: Minimum similarity score
            section_type: Optional section type to filter by
            
        Returns:
            List of similar documents
        """
        # Generate query embedding
        query_embedding = self.embed(query)
        
        # Build search parameters
        where = {"section_type": section_type} if section_type else None
        
        # Perform search
        results = self.research_collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
            where=where
        )
        
        # Filter and convert results
        documents = []
        for i, (doc_id, score) in enumerate(zip(results['ids'][0], results['distances'][0])):
            if score >= threshold:
                metadata = results['metadatas'][0][i]
                content = results['documents'][0][i]
                documents.append(Document(
                    content=content,
                    metadata={**metadata, "similarity": score},
                    id=doc_id
                ))
                
        return documents

    async def add_document(self, document: Document) -> None:
        """Add a document to the vector store
        
        Args:
            document: Document to add
        """
        try:
            logger.debug(f"Adding document with id: {document.id}")
            logger.debug(f"Document content: {document.content[:100]}...")
            logger.debug(f"Document metadata: {document.metadata}")
            
            # Additional metadata validation
            if not document.metadata:
                document.metadata = {}  # Ensure we have at least an empty dict
                
            # Double-check all metadata values are primitives and convert any that aren't
            sanitized_metadata = {}
            for key, value in document.metadata.items():
                if value is None:
                    sanitized_metadata[key] = ""
                elif isinstance(value, (str, int, float, bool)):
                    sanitized_metadata[key] = str(value)
                else:
                    sanitized_metadata[key] = str(value)
            document.metadata = sanitized_metadata
            
            logger.debug(f"Sanitized metadata: {document.metadata}")
            
            # Calculate embedding
            logger.debug("Calculating embedding...")
            embedding = self.embed(document.content)
            
            # Add to collection
            logger.debug("Adding to collection...")
            self.research_collection.add(
                ids=[document.id or str(uuid.uuid4())],
                embeddings=[embedding],
                documents=[document.content],
                metadatas=[document.metadata]
            )
            logger.info("Document added successfully")
            
        except Exception as e:
            logger.error(f"Error adding document: {str(e)}")
            logger.error(f"Document details - ID: {document.id}")
            logger.error(f"Metadata: {document.metadata}")
            logger.error(f"Traceback:\n{traceback.format_exc()}")
            raise

    def create_collection(self, name: str) -> None:
        """Create a new collection in the database"""
        try:
            self.client.create_collection(name=name)
            print(f"Created collection: {name}")
        except ValueError as e:
            if "Collection already exists" in str(e):
                print(f"Collection {name} already exists")
            else:
                raise
                
    def create_research_collection(self, name: str, schema: Optional[Dict] = None) -> None:
        """Create a collection optimized for research content"""
        try:
            self.client.create_collection(
                name=name,
                metadata={"schema": schema or {
                    "section_types": [
                        "core_analysis",
                        "long_context",
                        "subtextual",
                        "technical",
                        "emerging_trends",
                        "recommendations"
                    ],
                    "embedding_model": self.model_name,
                    "config": self.embedding_config
                }}
            )
            print(f"Created research collection: {name}")
        except ValueError as e:
            if "Collection already exists" in str(e):
                print(f"Collection {name} already exists")
            else:
                raise

    def add_documents(self, collection_name: str, documents: List[Document]) -> None:
        """Add documents to a collection
        
        Args:
            collection_name: Name of the collection to add to
            documents: List of Document objects to add
        """
        collection = self.client.get_collection(collection_name)
        
        # Prepare documents for insertion
        embeddings = self.embed([doc.content for doc in documents]).tolist()
        ids = [doc.id or str(i) for i, doc in enumerate(documents)]
        metadatas = [doc.metadata for doc in documents]
        documents = [doc.content for doc in documents]
        
        # Add to collection
        collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print(f"Added {len(documents)} documents to collection {collection_name}")

    def query_similar(
        self, 
        collection_name: str, 
        query: str, 
        n_results: int = 5,
        where: Optional[Dict] = None
    ) -> List[Dict]:
        """Query the collection for similar documents
        
        Args:
            collection_name: Name of the collection to query
            query: Query text
            n_results: Number of results to return
            where: Optional filter criteria
            
        Returns:
            List of dictionaries containing matched documents and their metadata
        """
        collection = self.client.get_collection(collection_name)
        query_embedding = self.embed([query]).tolist()
        
        # Perform query
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=n_results,
            where=where
        )
        
        # Format results
        formatted_results = []
        for i in range(len(results['ids'][0])):
            formatted_results.append({
                'id': results['ids'][0][i],
                'content': results['documents'][0][i],
                'metadata': results['metadatas'][0][i],
                'distance': results['distances'][0][i]
            })
            
        return formatted_results
    
    def get_collection_stats(self, collection_name: str) -> Dict:
        """Get statistics about a collection
        
        Args:
            collection_name: Name of the collection
            
        Returns:
            Dictionary with collection statistics
        """
        collection = self.client.get_collection(collection_name)
        return {
            'name': collection_name,
            'count': collection.count()
        }
        
    def list_collections(self) -> List[str]:
        """List all collections in the database"""
        return [col.name for col in self.client.list_collections()]
        
    def delete_collection(self, collection_name: str) -> None:
        """Delete a collection from the database"""
        self.client.delete_collection(collection_name)
        print(f"Deleted collection: {collection_name}")

    def _sanitize_metadata(self, metadata: Dict) -> Dict:
        """
        Sanitize metadata to ensure it's compatible with ChromaDB.
        ChromaDB only accepts str, int, or float values.
        """
        sanitized = {}
        for key, value in metadata.items():
            if isinstance(value, (str, int, float)):
                sanitized[key] = value
            elif isinstance(value, datetime):
                sanitized[key] = value.isoformat()
            else:
                sanitized[key] = str(value)
        return sanitized

# Example usage
if __name__ == "__main__":
    # Initialize vector store with persistence
    store = VectorStore(persist_directory="vector_db")
    
    # Create a test collection
    store.create_collection("test")
    
    # Add some test documents
    docs = [
        Document(
            content="This is a test document about AI",
            metadata={"type": "test", "category": "ai"}
        ),
        Document(
            content="Another document about machine learning",
            metadata={"type": "test", "category": "ml"}
        )
    ]
    store.add_documents("test", docs)
    
    # Query similar documents
    results = store.query_similar("test", "AI and machine learning")
    print("\nQuery Results:")
    for result in results:
        print(f"Content: {result['content']}")
        print(f"Metadata: {result['metadata']}")
        print(f"Distance: {result['distance']}\n")

    # Create a research collection
    store.create_research_collection("research")

    # Add some research documents
    research_docs = [
        Document(
            content="This is a research document about AI",
            metadata={"section_type": "core_analysis", "category": "ai"}
        ),
        Document(
            content="Another research document about machine learning",
            metadata={"section_type": "technical", "category": "ml"}
        )
    ]
    store.add_documents("research", research_docs)

    # Query similar research documents by section
    import asyncio
    results = asyncio.run(store.similarity_search("research", "AI and machine learning", section_type="core_analysis"))
    print("\nQuery Results:")
    for result in results:
        print(f"Content: {result.content}")
        print(f"Metadata: {result.metadata}")
        print(f"Section Type: {result.metadata['section_type']}\n")

    # Store a research section
    section = Section(
        content="This is a research section about AI",
        metadata={"category": "ai"},
        title="AI Research",
        summary="Summary of AI research",
        body="Body of AI research"
    )
    metrics = asyncio.run(store.store_research_section(section, "text-embedding-ada-002", "core_analysis"))
    print("\nSection Metrics:")
    print(f"Quality Score: {metrics['quality_score']}")
    print(f"Novelty Score: {metrics['novelty_score']}")
    print(f"Coherence Score: {metrics['coherence_score']}\n")

    # Add a document
    document = Document(
        content="This is a document about AI",
        metadata={"category": "ai"}
    )
    asyncio.run(store.add_document(document))
