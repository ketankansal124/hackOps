from pinecone import Pinecone, ServerlessSpec
from processing.embeddings import get_embedding
from config import PINECONE_API_KEY, INDEX_NAME
import hashlib

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY, environment="us-east-1")

# Ensure the index exists
if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=768,  # Update with your embedding model's output size
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

# Connect to the index
index = pc.Index(INDEX_NAME)

def store_embeddings(texts, text_ids, metadata_list=None, namespace=None):
    """
    Stores multiple texts as embeddings in Pinecone.

    Args:
        texts (list): List of text strings.
        text_ids (list): List of unique text IDs.
        metadata_list (list, optional): List of metadata dictionaries for each text.
        namespace (str, optional): Namespace for organizing embeddings.
    """
    if len(texts) != len(text_ids):
        raise ValueError("texts and text_ids must have the same length")

    vectors = []
    for i, text in enumerate(texts):
        text_id = hashlib.md5(text_ids[i].encode()).hexdigest()  # Shorten ID
        embedding = get_embedding(text)  # Generate embedding

        # Use individual metadata if provided, else default to {}
        metadata = metadata_list[i] if metadata_list else {}

        vectors.append({
            "id": text_id,
            "values": embedding,
            "metadata": metadata  # ✅ Stores metadata correctly
        })

    # Batch upsert
    index.upsert(vectors=vectors, namespace=namespace)
    
    print(f"{len(vectors)} Embeddings Inserted Successfully!")

