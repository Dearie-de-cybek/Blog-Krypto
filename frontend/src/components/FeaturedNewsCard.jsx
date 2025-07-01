import React from 'react';

const FeaturedNewsCard = ({ 
  image, 
  tag, 
  title,
  onClick 
}) => {
  return (
    <div 
      className="relative group cursor-pointer overflow-hidden rounded-lg"
      onClick={onClick}
    >
      {/* Image */}
      <img 
        src={image} 
        alt={title}
        className="w-full h-[318px] object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Tag */}
        <span className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold border border-yellow-400 mb-2">
          {tag}
        </span>
        
        {/* Title */}
        <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default FeaturedNewsCard;