import os
import sys
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from data_ingestion.extract_pdf import extract_text_from_pdf
from vector_db.store_data import store_embeddings
from vector_db.retrieve_data import retrieve_matches
from config import PINECONE_API_KEY, INDEX_NAME

# Ensure correct module imports

app = Flask(__name__)


# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY, environment="us-east-1")

# Ensure the index exists
if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=784,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(INDEX_NAME)

# 1️⃣ **UPLOAD & PROCESS PDF**
@app.route("/upload", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    text_data = extract_text_from_pdf(file)  # Extract text from PDF

    if not text_data:
        return jsonify({"error": "No text extracted from PDF"}), 400

    # Generate unique text IDs based on PDF name
    text_ids = [f"{file.filename}_part_{i}" for i in range(len(text_data))]
    
    # Store only extracted text in metadata
    metadata_list = [{"text": text} for text in text_data]

    store_embeddings(text_data, text_ids, metadata_list)

    return jsonify({"message": "PDF uploaded and processed successfully"})


# 2️⃣ **SEARCH QUERY MATCHING**
@app.route("/search", methods=["POST"])
def search():
    try:
        data = request.json
        query = data.get("query")

        if not query:
            return jsonify({"error": "Query parameter is required"}), 400

        matching_texts = retrieve_matches(query) 
        print("Pinting here :::::",matching_texts)
        # return jsonify({"matches": matching_texts})  
        return matching_texts

    except Exception as e:
        print("Error in /search:", e)
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)
