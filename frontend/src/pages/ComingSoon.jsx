import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Zap, BookOpen, Calendar, Mic, BarChart3, FileText
} from 'lucide-react';
import Header from '../components/Header';
import FooterSection from '../components/Footer';

const categoryIcons = {
  Education: BookOpen,
  Events: Calendar,
  Interviews: Mic,
  'Market Analysis': BarChart3,
  'Press Release': FileText,
  Default: Zap,
};

const IconBadge = ({ Icon }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative w-24 h-24 mx-auto"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 360 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full h-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl"
    >
      <Icon className="w-12 h-12 text-black" />
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-xl opacity-30 animate-pulse" />
  </motion.div>
);

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedCategory = location.state?.requestedCategory;
  const reason = location.state?.reason;
  const Icon = categoryIcons[requestedCategory] || categoryIcons.Default;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition mb-8 group"
        >
          <motion.div
            whileHover={{ x: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.div>
          <span>Go Back</span>
        </motion.button>

        {/* Main Icon */}
        <IconBadge Icon={Icon} />

        {/* Title and Category */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Coming Soon
          </h1>

          {requestedCategory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-full"
            >
              <span className="text-yellow-400 font-medium">{requestedCategory} Section</span>
            </motion.div>
          )}

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We're working hard to bring you the latest {requestedCategory ? requestedCategory.toLowerCase() : 'content'} and insights.
          </motion.p>
        </motion.div>

        {/* Description */}
        <motion.div
          className="max-w-xl mx-auto text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400 text-lg">
            Our team is curating the best content to keep you informed about cryptocurrency trends, 
            market analysis, and breaking news in the digital finance world.
          </p>
          {reason && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-gray-400 bg-gray-900/50 rounded-lg p-4 border border-gray-800"
            >
              {reason}
            </motion.div>
          )}
        </motion.div>
      </main>

      <FooterSection />
    </div>
  );
};

export default ComingSoon;
