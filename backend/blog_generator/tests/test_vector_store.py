"""
Test suite for vector store functionality.
"""
import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime

from ..vector_store import Document, VectorStore

@pytest.mark.asyncio
async def test_document_metadata_sanitization():
    """Test that Document class properly sanitizes metadata"""
    # Test with None values
    doc = Document(
        content="test content",
        metadata={
            "type": None,
            "model": "gpt-4",
            "score": 0.95,
            "timestamp": datetime.now()
        }
    )
    
    assert isinstance(doc.metadata["type"], str)
    assert doc.metadata["type"] == ""
    assert isinstance(doc.metadata["model"], str)
    assert isinstance(doc.metadata["score"], str)
    assert isinstance(doc.metadata["timestamp"], str)

@pytest.mark.asyncio
async def test_vector_store_add_document():
    """Test adding document to vector store"""
    with patch("chromadb.PersistentClient") as mock_client:
        # Setup mock collection
        mock_collection = MagicMock()
        mock_collection.add = MagicMock()
        mock_client.return_value.get_or_create_collection.return_value = mock_collection
        
        # Create vector store
        store = VectorStore(persist_directory="test_db")
        
        # Create test document
        doc = Document(
            content="test content",
            metadata={
                "type": "technical",
                "model": "gpt-4",
                "topic": "test topic"
            }
        )
        
        # Add document
        await store.add_document(doc)
        
        # Verify collection.add was called with correct arguments
        mock_collection.add.assert_called_once()
        call_args = mock_collection.add.call_args[1]
        
        assert len(call_args["ids"]) == 1
        assert len(call_args["documents"]) == 1
        assert len(call_args["metadatas"]) == 1
        assert isinstance(call_args["metadatas"][0], dict)
        assert all(isinstance(v, str) for v in call_args["metadatas"][0].values())
