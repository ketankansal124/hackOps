import requests
import json
from vector_db.retrieve_data import retrieve_matches
from config import DEEPSEEK_CHAT_API

def generate_rag_response(query):
    matches = retrieve_matches(query)
    match_texts = "\n".join([match['metadata'] for match in matches])

    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are an AI expert in startup investments."},
            {"role": "user", "content": f"Based on the following data, suggest the best investors for this startup:\n{match_texts}"}
        ]
    }

    response = requests.post(DEEPSEEK_CHAT_API, headers=headers, data=json.dumps(payload))
    return response.json()["choices"][0]["message"]["content"]

