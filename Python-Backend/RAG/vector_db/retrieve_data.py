import json
from pinecone import Pinecone
from processing.embeddings import get_embedding
from config import PINECONE_API_KEY, INDEX_NAME  # Ensure index name is imported

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY, environment="us-east-1")  

# Check if index exists
if INDEX_NAME not in pc.list_indexes().names():
    raise ValueError(f"Index '{INDEX_NAME}' does not exist. Ensure it is created before querying.")

# Connect to index
index = pc.Index(INDEX_NAME)

def retrieve_matches(query, top_k=5):
    try:
        query_embedding = get_embedding(query)
        
        # Query Pinecone index
        results = index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True  # Fetch metadata
        )

        # print("Raw Results:", json.dumps(results, indent=2))  # Debugging log
        # print(results)

        # Extract metadata safely
        matching_texts = [
            match.get("metadata", {}).get("text", None)  # Get text safely
            for match in results.get("matches", [])  # Ensure "matches" exists
        ]

        # Remove None values from the list
        matching_texts = [text for text in matching_texts if text is not None]

        return matching_texts or ["No relevant results found"]  # Handle empty matches

    except Exception as e:
        print("Error in retrieve_matches:", str(e))
        return ["Error retrieving matches"]

