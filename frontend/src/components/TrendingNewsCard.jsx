import React from 'react';

const TrendingNewsCard = ({ 
  image, 
  tag, 
  title,
  onClick 
}) => {
  return (
    <div 
      className="flex border border-gray-700 rounded-lg p-4 hover:border-yellow-500/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <img 
        src={image} 
        alt={title}
        className="w-20 h-16 object-cover rounded mr-4 flex-shrink-0"
      />
      
      {/* Content */}
      <div className="flex-1">
        <span className="text-yellow-500 text-xs font-semibold uppercase tracking-wide">
          {tag}
        </span>
        <h3 className="text-white text-sm font-medium mt-1 leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default TrendingNewsCard;