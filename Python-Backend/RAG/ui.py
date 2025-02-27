import streamlit as st
import requests
import json

# Backend API URLs
UPLOAD_URL = "http://127.0.0.1:5000/upload"
SEARCH_URL = "http://127.0.0.1:5000/search"

# Streamlit App
st.set_page_config(page_title="PDF RAG System", layout="centered")

st.title("📄 PDF Upload & Search")

# 1️⃣ **Upload Section**
st.header("Upload a PDF")
uploaded_file = st.file_uploader("Choose a PDF file", type=["pdf"])

if uploaded_file is not None:
    if st.button("Upload"):
        files = {"file": uploaded_file.getvalue()}
        response = requests.post(UPLOAD_URL, files=files)
        if response.status_code == 200:
            st.success("✅ PDF uploaded and processed successfully!")
        else:
            st.error(f"❌ Upload failed: {response.json().get('error', 'Unknown error')}")

# 2️⃣ **Search Section**
st.header("Search")
query = st.text_input("Enter search query")

if st.button("Search"):
    if query.strip():
        response = requests.post(SEARCH_URL, json={"query": query})
        if response.status_code == 200:
            results = response.json()
            st.subheader("🔍 Results:")
            if results:
                for idx, result in enumerate(results, 1):
                    st.write(f"**{idx}.** {result}")
            else:
                st.warning("No matches found.")
        else:
            st.error(f"❌ Search failed: {response.json().get('error', 'Unknown error')}")
    else:
        st.warning("⚠️ Please enter a search query.")

