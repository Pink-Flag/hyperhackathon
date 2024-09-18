from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Helper function to get OAuth2 token
def get_oauth_token():
    token_url = os.getenv("TOKEN_URL")
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")

    response = requests.post(token_url, auth=(client_id, client_secret), headers={
        'Content-Type': 'application/x-www-form-urlencoded',
    })

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        return None

# Route for SIM Swap API
@app.route('/sim-swap/<msisdn>', methods=['GET'])
def sim_swap(msisdn):
    token = get_oauth_token()
    if not token:
        return jsonify({"error": "Failed to obtain OAuth token"}), 500

    headers = {
        'Authorization': f'Bearer {token}',
        'User-ID-Type': 'MSISDN',
        'User-ID': msisdn
    }

    response = requests.get('https://api-sandbox.vf-dmp.engineering.vodafone.com/mobileconnect/premiuminfo/v1', headers=headers)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify(response.json()), response.status_code

# Route for Call Divert API
@app.route('/call-divert/<msisdn>', methods=['GET'])
def call_divert(msisdn):
    token = get_oauth_token()
    if not token:
        return jsonify({"error": "Failed to obtain OAuth token"}), 500

    headers = {
        'Authorization': f'Bearer {token}',
        'User-ID-Type': 'MSISDN',
        'User-ID': msisdn
    }

    response = requests.get('https://api-sandbox.vf-dmp.engineering.vodafone.com/mobileconnect/premiuminfo/v1', headers=headers)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify(response.json()), response.status_code

# Ping route to check API status
@app.route('/ping', methods=['GET'])
def ping():
    response = requests.get('https://api-sandbox.vf-dmp.engineering.vodafone.com/mobileconnect/premiuminfo/v1/ping')
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to ping the API"}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
