/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, TrendingUp, Clock, Wifi, WifiOff } from 'lucide-react';
import { useNigerianTime, useExchangeRates } from '../hooks/useExchangeRates';
import navigationService from '../services/navigationService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Nigerian time and exchange rates
  const { time, shortTime } = useNigerianTime();
  const { rates, error: ratesError } = useExchangeRates();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { name: 'Home', path: '/', type: 'direct' },
    { name: 'Education', path: '/education', type: 'category', category: 'Education' },
    { name: 'Events', path: '/events', type: 'category', category: 'Events' },
    { name: 'Interviews', path: '/interviews', type: 'category', category: 'Interviews' },
    { name: 'Market Analysis', path: '/market-analysis', type: 'category', category: 'Market Analysis' },
    { name: 'Press Release', path: '/press-release', type: 'category', category: 'Press Release' }
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (item) => {
    if (item.type === 'direct') {
      navigate(item.path);
    } else if (item.type === 'category') {
      navigationService.navigateToCategory(item.category, navigate);
    }
    setIsMenuOpen(false);
  };

  // Get top 3 rates for header display
  const topRates = rates.slice(0, 3);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-lg border-b border-yellow-500/30 shadow-2xl' 
            : 'bg-black/80 backdrop-blur-sm border-b border-yellow-500/20'
        }`}
      >
        {/* Top Bar with Exchange Rates (Desktop only) */}
        <div className="hidden lg:block bg-gradient-to-r from-gray-900/50 to-black/50 border-b border-yellow-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-1.5">
              {/* Nigerian Time */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-2 text-xs text-gray-300"
              >
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="font-mono">Lagos: {shortTime}</span>
              </motion.div>

              {/* Exchange Rates Ticker */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-4"
              >
                {ratesError ? (
                  <div className="flex items-center space-x-1 text-xs text-orange-400">
                    <WifiOff className="w-3 h-3" />
                    <span>Rates offline</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Wifi className="w-3 h-3 text-green-400" />
                      <span>Live Rates:</span>
                    </div>
                    {topRates.map((rate, index) => (
                      <React.Fragment key={rate.currency}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-center space-x-1 text-xs"
                        >
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
                        </motion.div>
                        {index < topRates.length - 1 && <span className="text-gray-600 text-xs">•</span>}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </motion.div>

              {/* Powered by */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-gray-500"
              >
                Powered by Monierate
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <TrendingUp className="w-6 h-6 text-black" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  KryptoExtract
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`relative text-sm font-medium transition-all duration-300 hover:text-yellow-400 ${
                      isActivePath(item.path) 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  >
                    {item.name}
                    {isActivePath(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Live Clock (Mobile & Desktop) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center space-x-2 text-xs text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-full border border-yellow-500/20"
              >
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="font-mono hidden md:inline">{shortTime}</span>
                <span className="font-mono md:hidden text-xs">{shortTime}</span>
              </motion.div>

              {/* Mobile Exchange Rate Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="lg:hidden"
              >
                {ratesError ? (
                  <WifiOff className="w-4 h-4 text-orange-400" />
                ) : (
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-3 h-3 text-green-400" />
                    {topRates[0] && (
                      <span className="text-xs text-white font-medium">
                        ${topRates[0].rate ? Math.round(topRates[0].rate) : 'N/A'}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Search Button */}
              {/* <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 hover:bg-yellow-500/10 rounded-xl transition-colors border border-transparent hover:border-yellow-500/20"
              >
                <Search className="w-5 h-5 text-gray-300 hover:text-yellow-400 transition-colors" />
              </motion.button> */}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-yellow-500/10 rounded-xl transition-colors border border-transparent hover:border-yellow-500/20"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5 text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Side Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Side Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50 lg:hidden border-l border-yellow-500/20 shadow-2xl"
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                      Menu
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-yellow-400" />
                  </motion.button>
                </div>
              </div>

              {/* Mobile Exchange Rates */}
              <div className="p-6 border-b border-yellow-500/20">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-300 mb-3">
                    {ratesError ? (
                      <>
                        <WifiOff className="w-4 h-4 text-orange-400" />
                        <span>Exchange rates offline</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="w-4 h-4 text-green-400" />
                        <span>Live Exchange Rates</span>
                      </>
                    )}
                  </div>
                  
                  {!ratesError && topRates.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {topRates.map((rate) => (
                        <div key={rate.currency} className="text-center bg-gray-800/50 rounded-lg p-2">
                          <div className="text-xs text-gray-400">{rate.currency}/NGN</div>
                          <div className="text-sm font-medium text-white">
                            ₦{rate.rate?.toLocaleString() || 'N/A'}
                          </div>
                          {rate.changePercent !== undefined && (
                            <div className={`text-xs ${
                              rate.changePercent > 0 ? 'text-green-400' : 
                              rate.changePercent < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {rate.changePercent > 0 ? '+' : ''}{rate.changePercent?.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-6 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleNavigation(item)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActivePath(item.path)
                          ? 'text-yellow-400 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30'
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/20'
                      }`}
                    >
                      <motion.div
                        whileHover={{ x: 8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        {isActivePath(item.path) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-yellow-400 rounded-full"
                          />
                        )}
                      </motion.div>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-yellow-500/20">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3 text-yellow-400" />
                  <span className="font-mono">Lagos: {shortTime}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;