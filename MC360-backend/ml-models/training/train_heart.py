import pandas as pd
import numpy as np
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

df = pd.read_csv("../datasets/heart.csv")

# Clean column names to remove any accidental whitespace
df.columns = df.columns.str.strip()

print("Dataset Shape before preprocessing:", df.shape)
print("Available Columns:", df.columns.tolist())

# ==========================
# DATA PREPROCESSING (Handling '?' and Missing Values)
# ==========================

# 1. Replace '?' string placeholders with actual NaN values
df.replace("?", np.nan, inplace=True)

# 2. Force convert all columns to numeric types (invalid parsing turns into NaN)
df = df.apply(pd.to_numeric, errors='coerce')

# 3. Fill missing NaN values with the median of each respective column
df.fillna(df.median(), inplace=True)

# ==========================
# FEATURES & TARGET
# ==========================

# Based on your dataset printout, the target column is 'num'
# We binarize it (1 = heart disease, 0 = no disease) to match binary classification
if 'num' in df.columns:
    df['num'] = df['num'].apply(lambda x: 1 if x > 0 else 0)
    target_column = 'num'
elif 'target' in df.columns:
    target_column = 'target'
else:
    raise KeyError("Could not find 'num' or 'target' column in your dataset.")

X = df.drop(target_column, axis=1)
y = df[target_column]

# ==========================
# TRAIN TEST SPLIT
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y  # Ensures equal distribution of classes in train and test sets
)

# ==========================
# SCALER
# ==========================

scaler = StandardScaler()

# This will now succeed because all '?' have been cleaned and handled
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

# ==========================
# TRAIN MODEL
# ==========================

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
    "../models/heart_model.pkl"
)

joblib.dump(
    scaler,
    "../models/heart_scaler.pkl"
)

print("\nHeart Model Saved Successfully")