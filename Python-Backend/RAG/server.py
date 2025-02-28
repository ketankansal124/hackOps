import os
import sys
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from data_ingestion.extract_pdf import extract_text_from_pdf
from vector_db.store_data import store_embeddings
from vector_db.retrieve_data import retrieve_matches
from config import PINECONE_API_KEY, INDEX_NAME
import joblib
import pandas as pd
import numpy as np
# Ensure correct module imports
model_predict = joblib.load("C:/Users/Lenovo/OneDrive/Documents/GitHub/hackOps/Python-Backend/Matching Score/best_model.pkl")
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

industry_categories = [
    "Industry_Agriculture", "Industry_Animal/Pets", "Industry_Beauty/Fashion",
    "Industry_Business_Services", "Industry_Children/Education", "Industry_Electronics",
    "Industry_Entertainment", "Industry_Fitness/Sports/Outdoors", "Industry_Food_and_Beverage",
    "Industry_Hardware", "Industry_Lifestyle/Home", "Industry_Liquor/Alcohol",
    "Industry_Manufacturing", "Industry_Medical/Health", "Industry_Others",
    "Industry_Technology/Software", "Industry_Vehicles/Electrical_Vehicles"
]

pitchers_state_categories = [
    'Pitchers_State__', 
    'Pitchers_State_Arunachal_Pradesh', 'Pitchers_State_Arunachal_Pradesh,Uttarakhand', 
    'Pitchers_State_Assam', 'Pitchers_State_Bihar', 'Pitchers_State_Chhattisgarh', 
    'Pitchers_State_Delhi', 'Pitchers_State_Delhi,Bihar,Kerala', 
    'Pitchers_State_Delhi,Jammu_&_Kashmir', 'Pitchers_State_Delhi,Karnataka', 
    'Pitchers_State_Delhi,Maharashtra', 'Pitchers_State_Delhi,Punjab', 'Pitchers_State_Goa', 
    'Pitchers_State_Gujarat', 'Pitchers_State_Gujarat,Maharashtra', 
    'Pitchers_State_Gujarat,Uttar_Pradesh', 'Pitchers_State_Haryana', 
    'Pitchers_State_Haryana,Gujarat', 'Pitchers_State_Haryana,Madhya_Pradesh', 
    'Pitchers_State_Haryana,Maharashtra', 'Pitchers_State_Haryana,West_Bengal', 
    'Pitchers_State_Himachal_Pradesh', 'Pitchers_State_Jammu_&_Kashmir', 
    'Pitchers_State_Jharkhand', 'Pitchers_State_Jharkhand,Chhattisgarh', 'Pitchers_State_Karnataka', 
    'Pitchers_State_Karnataka,Andhra_Pradesh', 'Pitchers_State_Karnataka,Telangana', 
    'Pitchers_State_Karnataka,West_Bengal', 'Pitchers_State_Kerala', 
    'Pitchers_State_Kerala,Maharashtra', 'Pitchers_State_Madhya_Pradesh', 'Pitchers_State_Maharashtra', 
    'Pitchers_State_Maharashtra,Delhi', 'Pitchers_State_Maharashtra,Uttar_Pradesh,Haryana', 
    'Pitchers_State_Odisha', 'Pitchers_State_Punjab', 'Pitchers_State_Punjab,Gujarat', 
    'Pitchers_State_Punjab,Kerala', 'Pitchers_State_Punjab,Uttar_Pradesh', 
    'Pitchers_State_Punjab,West_Bengal', 'Pitchers_State_Rajasthan', 'Pitchers_State_Tamil_Nadu', 
    'Pitchers_State_Tamil_Nadu,Uttar_Pradesh', 'Pitchers_State_Telangana', 
    'Pitchers_State_Telangana,Karnataka', 'Pitchers_State_Telangana,Maharashtra', 
    'Pitchers_State_Uttar_Pradesh', 'Pitchers_State_Uttarakhand', 
    'Pitchers_State_Uttarakhand,Uttar_Pradesh', 'Pitchers_State_West_Bengal', 
    'Pitchers_State_West_Bengal,Uttar_Pradesh'
]

pitchers_age_categories = [
    "Pitchers_Average_Age_Middle", "Pitchers_Average_Age_Old", "Pitchers_Average_Age_Young"
]

# Define all feature columns expected by the model
feature_columns = [
    "Number_of_Presenters", "Male_Presenters", "Female_Presenters", "Transgender_Presenters",
    "Couple_Presenters", "Yearly_Revenue", "Monthly_Sales", "Gross_Margin", "Net_Margin", "EBITDA",
    "Cash_Burn", "SKUs", "Has_Patents", "Bootstrapped", "Original_Ask_Amount",
    "Original_Offered_Equity", "Valuation_Requested", "Received_Offer",
    "Anupam_invested", "Aman_invested", "Peyush_invested", "Ritesh_invested",
    "Amit_invested", "Namita_invested"
] + industry_categories + pitchers_state_categories + pitchers_age_categories


# FEATURE_COLUMNS = [
    # 'Number_of_Presenters', 'Male_Presenters', 'Female_Presenters', 'Transgender_Presenters', 
    # 'Couple_Presenters', 'Yearly_Revenue', 'Monthly_Sales', 'Gross_Margin', 'Net_Margin', 
    # 'EBITDA', 'Cash_Burn', 'SKUs', 'Has_Patents', 'Bootstrapped', 'Original_Ask_Amount', 
    # 'Original_Offered_Equity', 'Valuation_Requested', 'Received_Offer', 'Anupam_invested', 
    # 'Aman_invested', 'Peyush_invested', 'Ritesh_invested', 'Amit_invested', 'Namita_invested', 
#     'Industry_Agriculture', 'Industry_Animal/Pets', 'Industry_Beauty/Fashion', 
#     'Industry_Business_Services', 'Industry_Children/Education', 'Industry_Electronics', 
#     'Industry_Entertainment', 'Industry_Fitness/Sports/Outdoors', 'Industry_Food_and_Beverage', 
#     'Industry_Hardware', 'Industry_Lifestyle/Home', 'Industry_Liquor/Alcohol', 
#     'Industry_Manufacturing', 'Industry_Medical/Health', 'Industry_Others', 
#     'Industry_Technology/Software', 'Industry_Vehicles/Electrical_Vehicles', 'Pitchers_State__', 
#     'Pitchers_State_Arunachal_Pradesh', 'Pitchers_State_Arunachal_Pradesh,Uttarakhand', 
#     'Pitchers_State_Assam', 'Pitchers_State_Bihar', 'Pitchers_State_Chhattisgarh', 
#     'Pitchers_State_Delhi', 'Pitchers_State_Delhi,Bihar,Kerala', 
#     'Pitchers_State_Delhi,Jammu_&_Kashmir', 'Pitchers_State_Delhi,Karnataka', 
#     'Pitchers_State_Delhi,Maharashtra', 'Pitchers_State_Delhi,Punjab', 'Pitchers_State_Goa', 
#     'Pitchers_State_Gujarat', 'Pitchers_State_Gujarat,Maharashtra', 
#     'Pitchers_State_Gujarat,Uttar_Pradesh', 'Pitchers_State_Haryana', 
#     'Pitchers_State_Haryana,Gujarat', 'Pitchers_State_Haryana,Madhya_Pradesh', 
#     'Pitchers_State_Haryana,Maharashtra', 'Pitchers_State_Haryana,West_Bengal', 
#     'Pitchers_State_Himachal_Pradesh', 'Pitchers_State_Jammu_&_Kashmir', 
#     'Pitchers_State_Jharkhand', 'Pitchers_State_Jharkhand,Chhattisgarh', 'Pitchers_State_Karnataka', 
#     'Pitchers_State_Karnataka,Andhra_Pradesh', 'Pitchers_State_Karnataka,Telangana', 
#     'Pitchers_State_Karnataka,West_Bengal', 'Pitchers_State_Kerala', 
#     'Pitchers_State_Kerala,Maharashtra', 'Pitchers_State_Madhya_Pradesh', 'Pitchers_State_Maharashtra', 
#     'Pitchers_State_Maharashtra,Delhi', 'Pitchers_State_Maharashtra,Uttar_Pradesh,Haryana', 
#     'Pitchers_State_Odisha', 'Pitchers_State_Punjab', 'Pitchers_State_Punjab,Gujarat', 
#     'Pitchers_State_Punjab,Kerala', 'Pitchers_State_Punjab,Uttar_Pradesh', 
#     'Pitchers_State_Punjab,West_Bengal', 'Pitchers_State_Rajasthan', 'Pitchers_State_Tamil_Nadu', 
#     'Pitchers_State_Tamil_Nadu,Uttar_Pradesh', 'Pitchers_State_Telangana', 
#     'Pitchers_State_Telangana,Karnataka', 'Pitchers_State_Telangana,Maharashtra', 
#     'Pitchers_State_Uttar_Pradesh', 'Pitchers_State_Uttarakhand', 
#     'Pitchers_State_Uttarakhand,Uttar_Pradesh', 'Pitchers_State_West_Bengal', 
#     'Pitchers_State_West_Bengal,Uttar_Pradesh', 'Pitchers_Average_Age_Middle', 
#     'Pitchers_Average_Age_Old', 'Pitchers_Average_Age_Young'
# ]



@app.route('/predict_value', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not isinstance(data, list):
            return jsonify({"error": "Input should be a list of JSON objects"}), 400

        predictions = []

        for item in data:
            # Ensure all feature columns are present, default missing ones to 0
            input_data = {col: item.get(col, 0) for col in feature_columns}

            # Function to enforce one-hot encoding for categorical variables
            def enforce_one_hot_encoding(category_list):
                selected = [cat for cat in category_list if input_data.get(cat, 0) == 1]
                if not selected:
                    input_data[category_list[0]] = 1  # Default to the first category if none selected
                for cat in category_list:
                    input_data[cat] = 1 if cat in selected else 0

            enforce_one_hot_encoding(industry_categories)
            enforce_one_hot_encoding(pitchers_state_categories)
            enforce_one_hot_encoding(pitchers_age_categories)

            predictions.append(input_data)

        # Convert to DataFrame
        df = pd.DataFrame(predictions)

        # Make batch predictions
        predicted_values = model_predict.predict(df).tolist()

        return jsonify({"predictions": predicted_values})

    except Exception as e:
        return jsonify({"error": str(e)}), 400



if __name__ == "__main__":
    app.run(debug=True)
