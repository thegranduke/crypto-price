# Cryptocurrency Price Fetcher

## Overview

The **Cryptocurrency Price Fetcher** is a lightweight Flask web application that retrieves real-time cryptocurrency market data from the [CoinGecko API](https://www.coingecko.com/en/api). This API allows users to query cryptocurrency prices, market capitalization, and price changes over the past 24 hours for specified cryptocurrencies.

## Features

- **RESTful API**: Provides a simple endpoint to fetch cryptocurrency prices.
- **Rate Limiting**: Implements a rate limiting mechanism to comply with API usage policies.
- **CORS Enabled**: Supports cross-origin requests for frontend applications.
- **Error Handling**: Includes robust error handling to ensure graceful stops in case of API failures.

## Technologies Used

- **Flask**: A lightweight framework for Python.
- **Requests**: A Python HTTP library for making requests to external APIs.
- **Flask-CORS**: A Flask extension for handling Cross-Origin Resource Sharing (CORS).
- **Python**

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thegranduke/crypto-price.git
   cd crypto-price-fetcher