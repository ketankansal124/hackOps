import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import r2_score
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor
import os
import pickle


# Load data
data = pd.read_csv("Shark_Tank_cleaned.csv")

# Ensure correct data types and handle missing values
data["Cash Burn"].fillna(0, inplace=True)
data["Has Patents"].fillna(0, inplace=True)
data["Bootstrapped"].fillna(0, inplace=True)
data["Cash Burn"] = data["Cash Burn"].replace({"yes": 1}).astype(int)
data["Has Patents"] = data["Has Patents"].replace({"yes": 1}).astype(int)
data["Bootstrapped"] = data["Bootstrapped"].replace({"yes": 1, "funded": 0}).astype(int)
data["Deal Valuation"].fillna(0, inplace=True)

# Rename columns to avoid issues with LightGBM and JSON encoding
data.columns = [col.replace(" ", "_").replace(".", "_") for col in data.columns]

# Define categorical and numerical columns
categorical_cols = ["Industry", "Pitchers_State", "Pitchers_Average_Age"]
numerical_cols = [col for col in data.columns if col not in categorical_cols + ["Deal_Valuation"]]

# Encoding categorical variables
encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False, dtype=np.float64)
encoded_features = encoder.fit_transform(data[categorical_cols])

# Convert to DataFrame
encoded_df = pd.DataFrame(encoded_features, columns=encoder.get_feature_names_out(categorical_cols), index=data.index)

# Rename columns to remove special characters
encoded_df.columns = [col.replace("[", "").replace("]", "").replace(" ", "_") for col in encoded_df.columns]

# Merge without overwriting NaNs
processed_data = data.drop(columns=categorical_cols).join(encoded_df)

# Save processed dataset
processed_data.to_csv("Shark_Tank_processed.csv", index=False, na_rep="")
print("Processed dataset saved as 'Shark_Tank_processed.csv'")

# Define features & target
X = processed_data.drop(columns=["Deal_Valuation"])
y = processed_data["Deal_Valuation"]

# Replace infinite values with NaN (ensures models don't break)
X.replace([np.inf, -np.inf], np.nan, inplace=True)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Ensure CatBoost has a writable directory
os.makedirs("catboost_info", exist_ok=True)

# Define models and hyperparameters
models = {
    "XGBoost": (XGBRegressor(n_jobs=-1), {"n_estimators": [100, 200], "learning_rate": [0.01, 0.1]}),
    "LightGBM": (LGBMRegressor(n_jobs=-1), {"n_estimators": [100, 200], "learning_rate": [0.01, 0.1]}),
    "CatBoost": (CatBoostRegressor(verbose=0, train_dir="catboost_info"), {"iterations": [100, 200], "learning_rate": [0.01, 0.1]}),
}

best_model = None
best_score = -np.inf

# Train & tune models
for name, (model, params) in models.items():
    try:
        grid_search = GridSearchCV(model, params, cv=5, scoring="r2", n_jobs=1, error_score="raise")
        grid_search.fit(X_train, y_train)

        # Evaluate
        y_pred = grid_search.best_estimator_.predict(X_test)
        score = r2_score(y_test, y_pred)

        print(f"{name} Best Params: {grid_search.best_params_}, R² Score: {score}")

        # Track best model
        if score > best_score:
            best_score = score
            best_model = grid_search.best_estimator_
    except Exception as e:
        print(f"Error training {name}: {e}")

print(f"Best Model: {best_model}")

if best_model is not None:
    with open("best_model.pkl", "wb") as f:
        pickle.dump(best_model, f)
    print("Best model saved as 'best_model.pkl'")
