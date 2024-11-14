from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from requests.exceptions import RequestException
import time

app = Flask(__name__)
CORS(app)

last_api_call = 0
RATE_LIMIT_SECONDS = 3

def get_crypto_data(crypto_ids):
    global last_api_call
    current_time = time.time()
    
    if current_time - last_api_call < RATE_LIMIT_SECONDS:
        time_to_wait = RATE_LIMIT_SECONDS - (current_time - last_api_call)
        time.sleep(time_to_wait)
    
    try:
        url = "https://api.coingecko.com/api/v3/coins/markets"
        params = {
            "vs_currency": "usd",
            "ids": crypto_ids,
            "order": "market_cap_desc",
            "sparkline": "false",
            "price_change_percentage": "24h"
        }
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        last_api_call = time.time()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from CoinGecko: {str(e)}")
        return None
    
def get_historical_data(crypto_id):
    global last_api_call
    current_time = time.time()
    
    if current_time - last_api_call < RATE_LIMIT_SECONDS:
        time_to_wait = RATE_LIMIT_SECONDS - (current_time - last_api_call)
        time.sleep(time_to_wait)
    
    try:
        url = f"https://api.coingecko.com/api/v3/coins/{crypto_id}/market_chart"
        params = {
            "vs_currency": "usd",
            "days": "365",
            "interval": "daily",
            "precision": "6"
        }
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        last_api_call = time.time()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching historical data from CoinGecko: {str(e)}")
        return None

@app.route('/api/crypto-prices')
def crypto_prices():
    try:
        crypto_ids = request.args.get('ids', 'bitcoin,ethereum')
        if not crypto_ids:
            return jsonify({"error": "No cryptocurrency IDs provided"}), 400
        
        data = get_crypto_data(crypto_ids)
        if data is None:
            return jsonify({"error": "Unable to fetch cryptocurrency data"}), 503
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/crypto-historical-data')
def crypto_historical_data():
    try:
        crypto_id = request.args.get('id')
        if not crypto_id:
            return jsonify({"error": "No cryptocurrency ID provided"}), 400
        
        data = get_historical_data(crypto_id)
        if data is None:
            return jsonify({"error": "Unable to fetch historical data"}), 503
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)