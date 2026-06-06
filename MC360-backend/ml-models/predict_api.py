from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(port=5001, debug=True)