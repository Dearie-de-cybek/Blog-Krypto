import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  Image, 
  Bold, 
  Italic, 
  List, 
  Link, 
  AlignLeft, 
  AlignCenter,
  Upload,
  Type,
  Hash
} from 'lucide-react';

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState('draft');

  const categories = [
    'Market Analysis',
    'Education', 
    'Business',
    'Events',
    'Interviews',
    'Press Release'
  ];

  const handleSave = () => {
    const postData = {
      title,
      subtitle,
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()),
      featuredImage,
      status,
      createdAt: new Date().toISOString()
    };
    console.log('Saving post:', postData);
    // Handle saving logic here
  };

  const handlePreview = () => {
    console.log('Opening preview');
    // Handle preview logic here
  };

  const formatText = (format) => {
    // Handle text formatting
    console.log('Formatting text:', format);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Create New Post</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            <span>Save Post</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter compelling article title..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Subtitle */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Brief description or subtitle..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image
            </label>
            <div className="space-y-3">
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </button>
              {featuredImage && (
                <img 
                  src={featuredImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-600"
                />
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => formatText('bold')}
                  className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('italic')}
                  className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-600 mx-2"></div>
                <button
                  onClick={() => formatText('list')}
                  className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors"
                  title="List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('link')}
                  className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors"
                  title="Link"
                >
                  <Link className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-600 mx-2"></div>
                <button
                  onClick={() => formatText('align-left')}
                  className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('align-center')}
                  className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Article Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                rows={20}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Publish Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Publish Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="bitcoin, crypto, trading"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  placeholder="Brief description for search engines..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  placeholder="bitcoin, cryptocurrency, market"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;