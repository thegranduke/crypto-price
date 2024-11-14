import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './index.css';

const App = () => {
  // State declarations
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin', 'ethereum']);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [historicalPriceData, setHistoricalPriceData] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchCryptoData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/api/crypto-prices?ids=${selectedCryptos.join(',')}`, {
        signal: AbortSignal.timeout(90000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setCryptoData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCryptos]);

  const fetchHistoricalData = useCallback(async () => {
    try {
      setLoadingHistory(true);
      setError(null);
      
      const historicalData = {};
      for (const crypto of selectedCryptos) {
        const response = await fetch(
          `http://localhost:5000/api/crypto-historical-data?id=${crypto}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch historical data for ${crypto}`);
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        historicalData[crypto] = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: parseFloat(price.toFixed(2))
        }));
      }
      
      setHistoricalPriceData(historicalData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingHistory(false);
    }
  }, [selectedCryptos]);

  useEffect(() => {
    fetchCryptoData();
    fetchHistoricalData();
    const interval = setInterval(fetchCryptoData, 300000);
    return () => clearInterval(interval);
  }, [fetchCryptoData, fetchHistoricalData]);

  const handleAddCrypto = (e) => {
    e.preventDefault();
    if (searchInput && !selectedCryptos.includes(searchInput.toLowerCase())) {
      setSelectedCryptos([...selectedCryptos, searchInput.toLowerCase()]);
      setSearchInput('');
      fetchCryptoData();
    }
  };

  const handleRefreshClick = () => {
    fetchCryptoData();
    fetchHistoricalData();
  };

  const handleRemoveCrypto = (crypto) => {
    if (selectedCryptos.length > 1) {
      setSelectedCryptos(selectedCryptos.filter(c => c !== crypto));
      setCryptoData(cryptoData.filter(data => data.id !== crypto));
      setHistoricalPriceData(prevData => {
        const newData = { ...prevData };
        delete newData[crypto];
        return newData;
      });
    }
  };

  const PriceChangeIndicator = ({ change }) => {
    const isPositive = change > 0;
    return (
      <span className={`inline-flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  Crypto Price Tracker
                </h1>
                <button
                  onClick={handleRefreshClick}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'text-blue-500' : 'text-gray-500'}`} />
                </button>
              </div>
              
              <form onSubmit={handleAddCrypto} className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Add cryptocurrency..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Crypto tags */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {selectedCryptos.map(crypto => (
                <span
                  key={crypto}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {crypto}
                  {selectedCryptos.length > 1 && (
                    <button
                      onClick={() => handleRemoveCrypto(crypto)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Error and loading states */}
            {error ? (
              <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            ) : loading && cryptoData.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Price table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ATH</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cryptoData.map(crypto => (
                        <tr key={crypto.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-full" src={crypto.image} alt={crypto.name} />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                                <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${crypto.current_price.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PriceChangeIndicator change={crypto.price_change_percentage_24h} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${crypto.market_cap.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${crypto.ath.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price Charts */}
                <div className="mt-8 space-y-6">
                  {selectedCryptos.map(crypto => (
                    <div key={crypto} className="w-full p-6 bg-white rounded-lg shadow-lg">
                      <div className="mb-4">
                        <h3 className="text-2xl font-semibold">
                          {crypto.charAt(0).toUpperCase() + crypto.slice(1)} Price Chart (Last 365 Days)
                        </h3>
                      </div>
                      {loadingHistory ? (
                        <div className="flex justify-center items-center h-96">
                          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                        </div>
                      ) : (
                        <div className="h-96">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalPriceData[crypto] || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                              />
                              <YAxis 
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                              />
                              <Tooltip 
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                                labelFormatter={(label) => `Date: ${label}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#2563eb" 
                                dot={false}
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;