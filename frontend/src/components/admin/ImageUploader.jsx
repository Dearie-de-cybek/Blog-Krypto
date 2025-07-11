/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Upload, Image, Link, X, Eye } from 'lucide-react';

const ImageUploader = ({ 
  onImageInsert, 
  onFeaturedImageChange, 
  onFeaturedImageUpload,
  featuredImage, 
  uploading,
  uploadFile 
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('url');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      const imageHTML = `<img src="${imageUrl.trim()}" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
      onImageInsert(imageHTML);
      setImageUrl('');
    }
  };

  const handleFileUpload = async (e, isForContent = false) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await uploadFile(file);
      const imageUrl = response.data.fullUrl;
      
      if (isForContent) {
        const imageHTML = `<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
        onImageInsert(imageHTML);
        
        // Add to uploaded images list for reuse
        setUploadedImages(prev => [...prev, {
          url: imageUrl,
          name: file.name,
          id: Date.now()
        }]);
      } else {
        onFeaturedImageChange(imageUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        const response = await uploadFile(file);
        const imageUrl = response.data.fullUrl;
        
        const imageHTML = `<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
        onImageInsert(imageHTML);
        
        setUploadedImages(prev => [...prev, {
          url: imageUrl,
          name: file.name,
          id: Date.now() + Math.random()
        }]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const insertExistingImage = (imageUrl) => {
    const imageHTML = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
    onImageInsert(imageHTML);
  };

  const removeUploadedImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleFeaturedImageUrl = (e) => {
    onFeaturedImageChange(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Featured Image Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Featured Image *
        </label>
        <div className="space-y-3">
          <input
            type="url"
            value={featuredImage}
            onChange={handleFeaturedImageUrl}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">or</span>
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Featured Image'}</span>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, false)}
                accept="image/*"
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {featuredImage && (
            <div className="space-y-2">
              <img 
                src={featuredImage} 
                alt="Featured image preview" 
                className="w-full h-48 object-cover rounded-lg border border-gray-600"
              />
              <p className="text-xs text-gray-400">Featured image preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Images Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Image className="w-5 h-5" />
          <span>Insert Content Images</span>
        </h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>URL</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          {uploadedImages.length > 0 && (
            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'library'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Library ({uploadedImages.length})</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!imageUrl.trim()}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:text-gray-400 text-black rounded-lg transition-colors font-medium"
            >
              Insert Image
            </button>
          </form>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-3">
            {/* Single Upload */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  {isUploading ? 'Uploading...' : 'Click to upload single image'}
                </p>
              </div>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, true)}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
            </label>

            {/* Multiple Upload */}
            <label className="flex flex-col items-center justify-center w-full h-24 border border-gray-600 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-400">
                  {isUploading ? 'Uploading multiple...' : 'Upload multiple images'}
                </p>
              </div>
              <input
                type="file"
                onChange={handleMultipleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover rounded-lg border border-gray-600 cursor-pointer hover:border-yellow-500 transition-colors"
                    onClick={() => insertExistingImage(image.url)}
                  />
                  <button
                    onClick={() => removeUploadedImage(image.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded-b-lg truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
            {uploadedImages.length === 0 && (
              <p className="text-gray-400 text-center py-8">No images uploaded yet</p>
            )}
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">
            <strong>Tips:</strong> 
            • Images will be inserted at your cursor position in the content editor
            • Use the formatting toolbar for quick image insertion
            • Drag images to reorder in library view
            • Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;