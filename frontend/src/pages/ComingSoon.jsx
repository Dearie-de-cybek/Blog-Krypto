import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Zap, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import FooterSection from '../components/Footer';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-black" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Coming Soon
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              We're working hard to bring you the latest news and insights in this category.
            </p>
          </div>

          {/* Description */}
          <div className="max-w-xl mx-auto space-y-4">
            <p className="text-gray-400 text-lg">
              Our team is curating the best content to keep you informed about market trends, 
              cryptocurrency updates, and financial news.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Market Analysis</h3>
              <p className="text-gray-400 text-sm">
                In-depth analysis of cryptocurrency and financial markets
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-400 text-sm">
                Latest news and updates as they happen in the market
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Expert Insights</h3>
              <p className="text-gray-400 text-sm">
                Professional analysis and insights from industry experts
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-8 space-y-4">
            <p className="text-gray-300">
              Want to be notified when this section launches?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-colors">
                Notify Me
              </button>
            </div>
          </div>

          {/* Navigation Suggestion */}
          <div className="pt-8">
            <p className="text-gray-400 mb-4">In the meantime, check out our other content:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Featured News
              </button>
              <button
                onClick={() => navigate('/?section=trending')}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Trending Stories
              </button>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default ComingSoon;