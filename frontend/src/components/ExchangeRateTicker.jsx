import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { formatRate, formatChangePercent } from '../services/exchangeRateService';

const ExchangeRateTicker = ({ compact = false, showRefresh = false }) => {
  const { rates, loading, error, lastUpdated, refetch } = useExchangeRates();

  if (loading && rates.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading rates...</span>
      </div>
    );
  }

  if (error && rates.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-red-400">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm">Rates offline</span>
      </div>
    );
  }

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const minutes = Math.floor((new Date() - date) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (compact) {
    // Compact version for mobile/small spaces
    const usdRate = rates.find(r => r.currency === 'USD');
    
    return (
      <div className="flex items-center space-x-2">
        {error && <WifiOff className="w-3 h-3 text-orange-400" />}
        {!error && <Wifi className="w-3 h-3 text-green-400" />}
        
        {usdRate && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-400">USD:</span>
            <span className="text-xs font-medium text-white">
              ₦{usdRate.rate?.toLocaleString() || 'N/A'}
            </span>
            {usdRate.changePercent && (
              <span className={`text-xs ${usdRate.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatChangePercent(usdRate.changePercent)}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {error ? (
            <WifiOff className="w-4 h-4 text-orange-400" />
          ) : (
            <Wifi className="w-4 h-4 text-green-400" />
          )}
          <span className="text-sm font-medium text-white">Live Rates</span>
          {error && <span className="text-xs text-orange-400">(Offline)</span>}
        </div>
        
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {formatTimeAgo(lastUpdated)}
            </span>
          )}
          {showRefresh && (
            <button
              onClick={refetch}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Rates Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {rates.slice(0, 4).map((rate) => (
          <div key={rate.currency} className="text-center">
            <div className="text-xs text-gray-400 mb-1">{rate.pair}</div>
            <div className="text-sm font-semibold text-white mb-1">
              ₦{rate.rate?.toLocaleString() || 'N/A'}
            </div>
            {rate.changePercent !== undefined && (
              <div className={`flex items-center justify-center space-x-1 text-xs ${
                rate.changePercent > 0 ? 'text-green-400' : 
                rate.changePercent < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {rate.changePercent > 0 && <TrendingUp className="w-3 h-3" />}
                {rate.changePercent < 0 && <TrendingDown className="w-3 h-3" />}
                <span>{formatChangePercent(rate.changePercent)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-800 text-center">
        <span className="text-xs text-gray-400">
          Powered by Monierate • Nigerian Naira Exchange Rates
        </span>
      </div>
    </div>
  );
};

// Simple horizontal ticker for headers
export const ExchangeRateHeaderTicker = () => {
  const { rates, error } = useExchangeRates();

  if (error || rates.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 text-xs">
      {rates.slice(0, 3).map((rate, index) => (
        <React.Fragment key={rate.currency}>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">{rate.currency}:</span>
            <span className="text-white font-medium">
              ₦{rate.rate?.toLocaleString() || 'N/A'}
            </span>
            {rate.changePercent !== undefined && (
              <span className={`${
                rate.changePercent > 0 ? 'text-green-400' : 
                rate.changePercent < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {rate.changePercent > 0 ? '+' : ''}{rate.changePercent?.toFixed(1)}%
              </span>
            )}
          </div>
          {index < 2 && <span className="text-gray-600">•</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ExchangeRateTicker;