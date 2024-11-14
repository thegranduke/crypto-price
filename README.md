# Crypto Price Tracker

Welcome to the **Crypto Price Tracker**! This tool is your go-to companion for tracking the prices and historical performance of your favorite cryptocurrencies. Built with Flask on the backend and React on the frontend, the Crypto Price Tracker provides a sleek, user-friendly interface for real-time price data, market trends, and detailed historical insights for various crypto assets.

## Table of Contents

1. Requirements
2. Features
3. Installation
4. Usage
5. Endpoints
6. Components

---

## Requirments

The Crypto Price Tracker component in this application uses the CoinGecko API to fetch real-time cryptocurrency price data. To enable this feature, you need to set up and configure a CoinGecko API key in the backend.

### Setting Up the CoinGecko API

1. **Create a CoinGecko Account**:
    - Sign up for a free account on [CoinGecko](https://www.coingecko.com/).
2. **API Key**:
    - Upon account creation, you'll receive an API key, which will be required in the backend configuration to make requests to the CoinGecko API.
3. **Request Limit**:
    - CoinGecko offers a **demo account** that allows users to make **up to 10,000 requests per month** without any payment commitments. This limit provides sufficient usage for development and small-scale applications.

### Configuring the API Key

1. Store the CoinGecko API key securely in your backend environment file (e.g., `.env`) with the following variable name:
    
    ```
    COINGECKO_API_KEY=your_api_key_here
    ```
    
2. Use the `COINGECKO_API_KEY` in the backend service responsible for fetching cryptocurrency price data.

### Usage Notes

- **Request Limits**: Keep in mind that the free tier has a limit of 10,000 requests per month. Be cautious of high-frequency polling in production, as it may exhaust the free-tier limits.
- **Rate Limiting**: Implement rate limiting or caching mechanisms if necessary to reduce API calls and stay within the free-tier limits.

This ensures that the Crypto Price Tracker operates seamlessly and within the API usage limits, while leveraging CoinGecko’s robust crypto pricing data for the application.

## Features

- **Real-Time Price Data**: Fetches live data for selected cryptocurrencies.
- **Historical Data**: View historical price data for a year to spot trends and make informed decisions.
- **Add/Remove Cryptos**: Flexibly manage your list of tracked cryptocurrencies.
- **Customizable Refresh Rate**: Auto-refresh data every 5 minutes or manually refresh anytime.
- **Data Visualization**: Interactive charts displaying price trends for each selected cryptocurrency.

## Installation

Follow these steps to get the Crypto Price Tracker running locally:

### Prerequisites

- Python 3.8 or later
- Node.js (version 14 or later recommended)
- npm (Node Package Manager)

### Backend Setup (Flask)

1. Clone this repository:
    
    ```bash
    
    git clone https://github.com/yourusername/crypto-price-tracker.git
    cd crypto-price-tracker
    ```
    

Install dependencies:

```bash
pip install Flask Flask-CORS requests
```

1. Start the Flask server:
    
    ```bash
    python app.py
    ```
    
    The backend will be available at `http://localhost:5000`.
    

### Frontend Setup (React)

1. Navigate to the `frontend` directory:
    
    ```bash
    cd frontend
    ```
    
2. Install frontend dependencies:
    
    ```bash
    npm install
    ```
    
3. Start the React development server:
    
    ```bash
    npm start
    ```
    
    Your application will be live at `http://localhost:3000`.
    

## Usage

Once both servers are running, open your browser and navigate to `http://localhost:3000`. Use the search bar to add your desired cryptocurrencies by name (e.g., "bitcoin" or "ethereum"). Click refresh to fetch the latest data or wait for the automatic refresh interval.

## Endpoints

The backend API consists of two primary endpoints:

- **`GET /api/crypto-prices`**
    - **Description**: Fetches current price, market cap, and 24-hour price change for specified cryptocurrencies.
    - **Parameters**:
        - `ids`: Comma-separated list of cryptocurrency IDs (e.g., `bitcoin,ethereum`).
    - **Example**: `http://localhost:5000/api/crypto-prices?ids=bitcoin,ethereum`
- **`GET /api/crypto-historical-data`**
    - **Description**: Fetches one-year daily historical price data for a single cryptocurrency.
    - **Parameters**:
        - `id`: Cryptocurrency ID (e.g., `bitcoin`).
    - **Example**: `http://localhost:5000/api/crypto-historical-data?id=bitcoin`

## Components

The frontend of the Crypto Price Tracker is powered by a range of React components:

- **Crypto List**: Displays selected cryptocurrencies with their current price, 24-hour change, and market cap.
- **Search & Add**: Search bar to add a new cryptocurrency to the tracking list.
- **Refresh Button**: Triggers an immediate refresh of data for all tracked cryptocurrencies.
- **Price Charts**: A line chart for each selected cryptocurrency, visualizing the one-year historical price data.

### Data Flow and State Management

Data is fetched from the backend using `fetch` and stored in React state variables (`cryptoData` for current prices and `historicalPriceData` for charts). State variables `loading` and `error` manage the data-fetching status and error-handling for smoother user experience.