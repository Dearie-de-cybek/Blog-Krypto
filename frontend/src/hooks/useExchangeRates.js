import { useState, useEffect, useCallback } from 'react';
import exchangeRateService, { getNigerianTime, getNigerianTimeShort } from '../services/exchangeRateService';

export const useExchangeRates = (refreshInterval = 300000) => { 
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try main API first, then fallback to alternative
      let response = await exchangeRateService.getPopularRates();
      
      if (!response.success) {
        console.warn('Main API failed, trying alternative...');
        response = await exchangeRateService.getLiveRatesAlternative();
      }
      
      if (response.success) {
        setRates(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.error || 'Failed to fetch exchange rates');
      }
      
    } catch (err) {
      console.error('Exchange rates fetch error:', err);
      setError(err.message);
      
      // Set fallback rates even on error
      const fallbackResponse = await exchangeRateService.getPopularRates();
      setRates(fallbackResponse.data);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Set up auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchRates, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRates, refreshInterval]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    refetch: fetchRates
  };
};

export const useNigerianTime = (updateInterval = 1000) => { // 1 second default
  const [time, setTime] = useState(getNigerianTime());
  const [shortTime, setShortTime] = useState(getNigerianTimeShort());

  useEffect(() => {
    const updateTime = () => {
      setTime(getNigerianTime());
      setShortTime(getNigerianTimeShort());
    };

    // Update immediately
    updateTime();

    // Set up interval
    const interval = setInterval(updateTime, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval]);

  return {
    time,
    shortTime
  };
};

// Hook for specific currency rate
export const useSpecificRate = (from = 'USD', to = 'NGN', refreshInterval = 300000) => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await exchangeRateService.getSpecificRate(from, to);
      
      if (response.success) {
        setRate(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.error || `Failed to fetch ${from}/${to} rate`);
      }
      
    } catch (err) {
      console.error(`${from}/${to} rate fetch error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchRate, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRate, refreshInterval]);

  return {
    rate,
    loading,
    error,
    lastUpdated,
    refetch: fetchRate,
    pair: `${from}/${to}`
  };
};