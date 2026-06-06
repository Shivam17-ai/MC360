import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)

from xgboost import XGBClassifier

# ==========================
# LOAD DATASET
# ==========================

# Note: Adjust the file name if your local file is named differently (e.g., obesity_level.csv)
df = pd.read_csv("../datasets/obesity.csv")

print("Dataset Shape:", df.shape)

# Drop unique identifier column if present to prevent data leakage
if 'id' in df.columns:
    df = df.drop(columns=['id'])

# ==========================
# FEATURES & TARGET
# ==========================

# Dynamically detects the obesity target column (handles 'NObeyesdad' or 'Obesity_Level')
target_col = [col for col in df.columns if 'obeye' in col.lower() or 'level' in col.lower() or '0be' in col.lower()][0]
print(f"Target Column Detected: {target_col}")

X = df.drop(target_col, axis=1)
y = df[target_col]

# ==========================
# ENCODE CATEGORICAL DATA
# ==========================

# XGBoost requires text features and target classes to be converted to integers
label_encoders = {}
categorical_cols = X.select_dtypes(include=['object', 'category']).columns

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    label_encoders[col] = le

# Encode the 7 different weight tiers (0 to 6)
target_encoder = LabelEncoder()
y_encoded = target_encoder.fit_transform(y.astype(str))

# ==========================
# TRAIN TEST SPLIT
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# ==========================
# SCALER
# ==========================

# Isolate numerical columns so we don't accidentally scale our encoded category integers
numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns

scaler = StandardScaler()

X_train_scaled = X_train.copy()
X_test_scaled = X_test.copy()

X_train_scaled[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
X_test_scaled[numerical_cols] = scaler.transform(X_test[numerical_cols])

# ==========================
# MODEL
# ==========================

model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    eval_metric="mlogloss",  # Changed to 'mlogloss' because obesity is a multi-class problem
    random_state=42
)

model.fit(X_train_scaled, y_train)

# ==========================
# EVALUATION
# ==========================

preds = model.predict(X_test_scaled)

print("\nAccuracy:")
print(accuracy_score(y_test, preds))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, preds))

print("\nClassification Report:")
print(classification_report(y_test, preds, target_names=target_encoder.classes_))

# ==========================
# SAVE MODEL & ARTIFACTS
# ==========================

# We pack the model, feature structural rules, and encoders together 
# so your production Flask API can easily unpack and parse incoming JSON requests.
model_payload = {
    "model": model,
    "target_encoder": target_encoder,
    "label_encoders": label_encoders,
    "features": list(X.columns)
}

joblib.dump(
    model_payload,
    "../models/obesity_model.pkl"
)

joblib.dump(
    scaler,
    "../models/obesity_scaler.pkl"
)

print("\nSaved Successfully")