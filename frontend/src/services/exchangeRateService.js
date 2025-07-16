import axios from 'axios';

// Create axios instance for Monierate API
const MonierateAPI = axios.create({
  baseURL: 'https://monierate.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const exchangeRateService = {
  // Get live exchange rates from Monierate
  getLiveRates: async () => {
    try {
      // Monierate API endpoint for live rates
      const response = await MonierateAPI.get('/v1/market');
      
      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Monierate API Error:', error);
      
      // Return fallback data if API fails
      return {
        success: false,
        error: error.message,
        data: getFallbackRates(),
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get specific currency pair rate
  getSpecificRate: async (from = 'USD', to = 'NGN') => {
    try {
      const response = await MonierateAPI.get(`/v1/market/${from}-${to}`);
      
      return {
        success: true,
        data: response.data,
        pair: `${from}/${to}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Monierate specific rate error:', error);
      
      return {
        success: false,
        error: error.message,
        data: null,
        pair: `${from}/${to}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get popular currency pairs
  getPopularRates: async () => {
    try {
      const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
      const promises = currencies.map(currency => 
        exchangeRateService.getSpecificRate(currency, 'NGN')
      );
      
      const results = await Promise.allSettled(promises);
      
      const rates = results.map((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          return {
            currency: currencies[index],
            ...result.value.data,
            pair: `${currencies[index]}/NGN`
          };
        } else {
          // Return fallback for failed requests
          return {
            currency: currencies[index],
            rate: getFallbackRate(currencies[index]),
            pair: `${currencies[index]}/NGN`,
            change: 0,
            changePercent: 0
          };
        }
      });

      return {
        success: true,
        data: rates,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Popular rates error:', error);
      
      return {
        success: false,
        error: error.message,
        data: getFallbackPopularRates(),
        timestamp: new Date().toISOString()
      };
    }
  },

  // Alternative endpoint if main API doesn't work
  getLiveRatesAlternative: async () => {
    try {
      // Try alternative Monierate endpoint
      const response = await axios.get('https://api.monierate.com/v1/rates', {
        timeout: 8000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return {
        success: true,
        data: response.data,
        source: 'alternative',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Alternative API Error:', error);
      
      return {
        success: false,
        error: error.message,
        data: getFallbackRates(),
        source: 'fallback',
        timestamp: new Date().toISOString()
      };
    }
  }
};

// Fallback rates in case API is down
const getFallbackRates = () => {
  return [
    {
      currency: 'USD',
      rate: 1580,
      pair: 'USD/NGN',
      change: 5,
      changePercent: 0.32,
      source: 'fallback'
    },
    {
      currency: 'EUR',
      rate: 1720,
      pair: 'EUR/NGN',
      change: -8,
      changePercent: -0.46,
      source: 'fallback'
    },
    {
      currency: 'GBP',
      rate: 1950,
      pair: 'GBP/NGN',
      change: 12,
      changePercent: 0.62,
      source: 'fallback'
    },
    {
      currency: 'CAD',
      rate: 1160,
      pair: 'CAD/NGN',
      change: 3,
      changePercent: 0.26,
      source: 'fallback'
    }
  ];
};

const getFallbackRate = (currency) => {
  const rates = {
    'USD': 1580,
    'EUR': 1720,
    'GBP': 1950,
    'CAD': 1160,
    'AUD': 1040
  };
  
  return rates[currency] || 1580;
};

const getFallbackPopularRates = () => {
  return getFallbackRates();
};

// Format rate for display
export const formatRate = (rate, currency = 'NGN') => {
  if (!rate) return 'N/A';
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(rate);
};

// Format change percentage
export const formatChangePercent = (changePercent) => {
  if (!changePercent) return '0%';
  
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

// Get Nigerian time
export const getNigerianTime = () => {
  return new Date().toLocaleString('en-NG', {
    timeZone: 'Africa/Lagos',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Get Nigerian time (short format)
export const getNigerianTimeShort = () => {
  return new Date().toLocaleString('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export default exchangeRateService;