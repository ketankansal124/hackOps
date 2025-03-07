import re

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = re.sub(r'[^a-zA-Z0-9,.!? ]', '', text)  # Remove special characters
    return text.strip()

