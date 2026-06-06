import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)

from xgboost import XGBClassifier

# ==========================
# LOAD DATASET
# ==========================

df = pd.read_csv("../datasets/diabetes.csv")

print("Dataset Shape:", df.shape)

# ==========================
# FEATURES & TARGET
# ==========================

X = df.drop("Outcome", axis=1)
y = df["Outcome"]

# ==========================
# TRAIN TEST SPLIT
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ==========================
# SCALER
# ==========================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ==========================
# MODEL
# ==========================

model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    eval_metric="logloss",
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
print(classification_report(y_test, preds))

# ==========================
# SAVE MODEL
# ==========================

joblib.dump(
    model,
    "../models/diabetes_model.pkl"
)

joblib.dump(
    scaler,
    "../models/diabetes_scaler.pkl"
)

print("\nSaved Successfully")