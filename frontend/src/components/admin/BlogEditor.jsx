import React, { useState } from 'react';
import { Save, Eye, Upload } from 'lucide-react';
import articlesService from '../../services/articlesService';
import { useUpload } from '../../hooks/useUpload';

const BlogEditor = ({ articleId = null, initialData = null }) => {
  const [articleData, setArticleData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    tags: initialData?.tags?.join(', ') || '',
    featuredImage: initialData?.featuredImage || '',
    status: initialData?.status || 'draft',
    metaDescription: initialData?.metaDescription || '',
    metaKeywords: initialData?.metaKeywords?.join(', ') || '',
    isFeatured: initialData?.isFeatured || false
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { uploadFile, uploading } = useUpload();

  const categories = [
    'Home',
    'Education', 
    'Events',
    'Interviews',
    'Market Analysis',
    'Press Release'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticleData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadFile(file);
      setArticleData(prev => ({
        ...prev,
        featuredImage: response.data.fullUrl
      }));
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate required fields
      if (!articleData.title || !articleData.content || !articleData.category || !articleData.featuredImage) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare data for API
      const dataToSave = {
        ...articleData,
        tags: articleData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        metaKeywords: articleData.metaKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
      };

      let response;
      if (articleId) {
        // Update existing article
        response = await articlesService.updateArticle(articleId, dataToSave);
        setSuccess('Article updated successfully!');
      } else {
        // Create new article
        response = await articlesService.createArticle(dataToSave);
        setSuccess('Article created successfully!');
      }

      // Optionally redirect or update UI
      console.log('Article saved:', response.data);

    } catch (err) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (articleId) {
      window.open(`/article/${articleId}`, '_blank');
    } else {
      alert('Please save the article first to preview it');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {articleId ? 'Edit Article' : 'Create New Article'}
        </h1>
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
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Article'}</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

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
              name="title"
              value={articleData.title}
              onChange={handleChange}
              placeholder="Enter compelling article title..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={articleData.subtitle}
              onChange={handleChange}
              placeholder="Brief description or subtitle..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image *
            </label>
            <div className="space-y-3">
              <input
                type="url"
                name="featuredImage"
                value={articleData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">or</span>
                <label className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {articleData.featuredImage && (
                <img 
                  src={articleData.featuredImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-600"
                />
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Article Content *
            </label>
            <textarea
              name="content"
              value={articleData.content}
              onChange={handleChange}
              placeholder="Write your article content here..."
              rows={20}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              required
            />
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
                  name="status"
                  value={articleData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={articleData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
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
                  name="tags"
                  value={articleData.tags}
                  onChange={handleChange}
                  placeholder="bitcoin, crypto, trading"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={articleData.isFeatured}
                    onChange={handleChange}
                    className="rounded border-gray-600 bg-gray-900 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-300">Featured Article</span>
                </label>
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
                  name="metaDescription"
                  value={articleData.metaDescription}
                  onChange={handleChange}
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
                  name="metaKeywords"
                  value={articleData.metaKeywords}
                  onChange={handleChange}
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