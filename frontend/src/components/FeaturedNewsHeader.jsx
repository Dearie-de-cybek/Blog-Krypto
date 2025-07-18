import React from 'react';
import FeaturedNewsCard from './FeaturedNewsCard';

const FeaturedNewsHeader = () => {
  return (
    <div className="flex items-center mb-8">
      <h2 className="text-black text-xl font-bold mr-4 whitespace-nowrap">
        FEATURED NEWS
      </h2>
      <div className="flex-1 h-px bg-gray-600"></div>
    </div>
  );
};

export default FeaturedNewsHeader;