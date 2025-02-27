import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL

# Configure the Gemini API client
genai.configure(api_key=GEMINI_API_KEY)

def get_embedding(text):
    try:
        response = genai.embed_content(model=GEMINI_EMBEDDING_MODEL, content=text)
        
        # Check if 'embedding' key exists in response dictionary
        if isinstance(response, dict) and "embedding" in response:
            return response["embedding"]
        else:
            raise ValueError(f"Unexpected response format: {response}")

    except Exception as e:
        print(f"Error while fetching embedding: {e}")
        return None
