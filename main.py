import requests
from dotenv import load_dotenv
import os
load_dotenv()


# Define the API URL with coins and currency parameters
coin1 = 'bitcoin'
coin2 = 'ethereum'
url = f'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={coin1},{coin2}'

# Define headers if needed
headers = {
    'accept': 'application/json',
    'x-cg-demo-api-key': os.getenv('COINGECKO_API_KEY')  # Replace with your actual API key
}

# Make the GET request
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()

    # Iterate over each cryptocurrency in the response
    for crypto in data:
        # Extract information for each cryptocurrency
        name = crypto['name']
        symbol = crypto['symbol']
        current_price = crypto['current_price']
        market_cap = crypto['market_cap']
        all_time_high = crypto['ath']
        image_url = crypto['image']

        # Print data
        print(f"Name: {name}")
        print(f"Symbol: {symbol}")
        print(f"Current Price: ${current_price}")
        print(f"Market Cap: ${market_cap}")
        print(f"All Time High: ${all_time_high}")
        print(f"Image URL: {image_url}")
        print('-----------------------------------')
else:
    print(f"Failed to retrieve data: {response.status_code}")
