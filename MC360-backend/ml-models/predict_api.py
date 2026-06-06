from flask import Flask, request, jsonify
import pandas as pd
import joblib
import pickle  # Used to unpack the metadata payload from the obesity model

app = Flask(__name__)

# ==========================================
# DIAGNOSIS 1: DIABETES ARTIFACTS
# ==========================================
model = joblib.load("models/diabetes_model.pkl")
scaler = joblib.load("models/diabetes_scaler.pkl")

FEATURES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]

# ==========================================
# DIAGNOSIS 2: OBESITY ARTIFACTS
# ==========================================
# Unpacking the comprehensive model payload we generated
with open("models/obesity_model.pkl", "rb") as f:
    obesity_payload = pickle.load(f)

obesity_model = obesity_payload["model"]
obesity_target_encoder = obesity_payload["target_encoder"]
obesity_label_encoders = obesity_payload["label_encoders"]
OBESITY_FEATURES = obesity_payload["features"]

# Loading the custom numerical scaler
with open("models/obesity_scaler.pkl", "rb") as f:
    obesity_scaler = pickle.load(f)

# ==========================================
# DIAGNOSIS 3: HEART DISEASE ARTIFACTS
# ==========================================
heart_model = joblib.load("models/heart_model.pkl")
heart_scaler = joblib.load("models/heart_scaler.pkl")

# NOTE: Update these strings to match the exact column names of your heart dataset
HEART_FEATURES = [
    "age",
    "sex",
    "cp",          # Chest pain type
    "trestbps",    # Resting blood pressure
    "chol",        # Serum cholesterol
    "fbs",         # Fasting blood sugar
    "restecg",     # Resting electrocardiographic results
    "thalach",     # Maximum heart rate achieved
    "exang",       # Exercise induced angina
    "oldpeak",     # ST depression induced by exercise
    "slope",       # The slope of the peak exercise ST segment
    "ca",          # Number of major vessels
    "thal"         # Thalassemia type
]


# ==========================================
# ENDPOINT 1: DIABETES PREDICTION
# ==========================================
@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes():
    data = request.json
    df = pd.DataFrame([data])
    df = df[FEATURES]
    
    scaled = scaler.transform(df)
    prediction = model.predict(scaled)[0]
    probability = model.predict_proba(scaled)[0][1]

    return jsonify({
        "prediction": int(prediction),
        "risk_score": round(float(probability * 100), 2)
    })


# ==========================================
# ENDPOINT 2: OBESITY PREDICTION
# ==========================================
@app.route("/predict/obesity", methods=["POST"])
def predict_obesity():
    data = request.json
    df = pd.DataFrame([data])
    
    # Force identical feature ordering used during model training
    df = df[OBESITY_FEATURES]
    
    # 1. Transform incoming text categories into model-ready integers
    for col, encoder in obesity_label_encoders.items():
        if col in df.columns:
            df[col] = encoder.transform(df[col].astype(str))
            
    # 2. Isolate and scale only the numerical features
    numerical_cols = [col for col in OBESITY_FEATURES if col not in obesity_label_encoders]
    df[numerical_cols] = obesity_scaler.transform(df[numerical_cols])
    
    # 3. Generate multiclass prediction
    prediction_numeric = obesity_model.predict(df)[0]
    probabilities = obesity_model.predict_proba(df)[0]
    
    # Convert numerical class back to string (e.g., 'Overweight_Level_I' or 'Obesity_Type_III')
    prediction_label = obesity_target_encoder.inverse_transform([prediction_numeric])[0]
    
    # Extract the confidence score for the chosen prediction class
    confidence_score = max(probabilities)

    return jsonify({
        "prediction": str(prediction_label),
        "risk_score": round(float(confidence_score * 100), 2)
    })


# ==========================================
# ENDPOINT 3: HEART DISEASE PREDICTION
# ==========================================
@app.route("/predict/heart", methods=["POST"])
def predict_heart():
    data = request.json
    df = pd.DataFrame([data])
    
    # Force identical feature ordering used during model training
    df = df[HEART_FEATURES]
    
    # Standardize data structure using the heart scaler
    scaled = heart_scaler.transform(df)
    
    # Generate binary prediction and probability
    prediction = heart_model.predict(scaled)[0]
    probability = heart_model.predict_proba(scaled)[0][1]

    return jsonify({
        "prediction": int(prediction),
        "risk_score": round(float(probability * 100), 2)
    })


if __name__ == "__main__":
    # Ensure all models are placed inside a directory named 'models' relative to this script
    app.run(port=5001, debug=True)