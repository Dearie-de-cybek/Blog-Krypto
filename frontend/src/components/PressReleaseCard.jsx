import React from 'react';

const PressReleaseCard = ({ 
  image, 
  tag, 
  title, 
  description,
  onClick 
}) => {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={image} 
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Tag overlay */}
        <div className="absolute top-4 left-4">
          <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold">
            {tag}
          </span>
        </div>
      </div>
      
      {/* Text Content */}
      <h3 className="text-white text-xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default PressReleaseCard;