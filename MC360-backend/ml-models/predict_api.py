from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    return jsonify({'prediction': 'none'})

if __name__ == '__main__':
    app.run(port=5001)
