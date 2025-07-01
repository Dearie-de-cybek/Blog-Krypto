import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log('Subscribe email:', email);
    // Handle newsletter subscription
  };

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Subscribe to our Newsletter
        </h2>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Never miss an update, subscribe to our newsletter and have everything delivered to you.
        </p>
        
        {/* Email Input */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          {/* Subscribe Button */}
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Subscribe now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;