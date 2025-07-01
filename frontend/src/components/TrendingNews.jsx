import React from 'react';

const TrendingNews = ({ 
  smallCards = [], 
  featuredArticle = {} 
}) => {
  return (
    <div className="bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with line */}
        <div className="flex items-center mb-8">
          <h2 className="text-white text-xl font-bold mr-4 whitespace-nowrap">
            TRENDING NEWS
          </h2>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Side - Small Cards */}
          <div className="space-y-4">
            {smallCards.map((card, index) => (
              <div 
                key={index}
                className="flex border border-gray-700 rounded-lg p-4 hover:border-yellow-500/50 transition-colors cursor-pointer"
              >
                {/* Image */}
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-20 h-16 object-cover rounded mr-4 flex-shrink-0"
                />
                
                {/* Content */}
                <div className="flex-1">
                  <span className="text-yellow-500 text-xs font-semibold uppercase tracking-wide">
                    {card.tag}
                  </span>
                  <h3 className="text-white text-sm font-medium mt-1 leading-tight">
                    {card.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Featured Article */}
          <div className="cursor-pointer group">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Tag overlay */}
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold">
                  {featuredArticle.tag}
                </span>
              </div>
            </div>
            
            {/* Text Content */}
            <h3 className="text-white text-xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
              {featuredArticle.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {featuredArticle.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNews;