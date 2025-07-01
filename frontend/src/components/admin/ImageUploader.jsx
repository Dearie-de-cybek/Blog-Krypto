import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';

const ImageUploader = ({ onImageInsert, onFeaturedImageChange, featuredImage }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onImageInsert(imageUrl);
      setImageUrl('');
      setShowUrlInput(false);
    }
  };

  const handleFeaturedImageSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onFeaturedImageChange(imageUrl);
      setImageUrl('');
      setShowUrlInput(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create object URL for preview (in real app, you'd upload to server)
      const objectUrl = URL.createObjectURL(file);
      onImageInsert(objectUrl);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Featured Image
      </label>
      
      <div className="space-y-3">
        <input
          type="url"
          value={featuredImage}
          onChange={(e) => onFeaturedImageChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Content</span>
          </button>
          
          <label className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {showUrlInput && (
          <div className="bg-gray-900 p-4 rounded border border-gray-600">
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-sm font-medium"
                >
                  Insert into Content
                </button>
                <button
                  type="button"
                  onClick={handleFeaturedImageSubmit}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                >
                  Set as Featured
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {featuredImage && (
          <div className="relative">
            <img 
              src={featuredImage} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg border border-gray-600"
            />
            <button
              onClick={() => onFeaturedImageChange('')}
              className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;