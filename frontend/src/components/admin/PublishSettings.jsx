import React from 'react';
import { Calendar, Tag, Star } from 'lucide-react';

const PublishSettings = ({
  status,
  setStatus,
  category,
  setCategory,
  tags,
  setTags,
  publishDate,
  setPublishDate,
  isFeatured,
  setIsFeatured
}) => {
  const categories = [
    'Home',
    'Education', 
    'Events',
    'Interviews',
    'Market Analysis',
    'Press Release'
  ];

  const handleScheduledChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus !== 'scheduled') {
      setPublishDate('');
    } else if (!publishDate) {
      // Set default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPublishDate(tomorrow.toISOString().slice(0, 16));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <span>Publish Settings</span>
      </h3>
      
      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Publication Status
          </label>
          <select
            value={status}
            onChange={(e) => handleScheduledChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {/* Scheduled Date */}
        {status === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Article will be published automatically at this time
            </p>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-1">
            <Tag className="w-4 h-4" />
            <span>Tags</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="bitcoin, crypto, trading, analysis"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Separate tags with commas. Use relevant keywords for better discoverability.
          </p>
        </div>

        {/* Featured Article */}
        <div className="pt-2 border-t border-gray-700">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
            />
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-300 font-medium">Featured Article</span>
            </div>
          </label>
          <p className="text-xs text-gray-400 mt-1 ml-7">
            Featured articles appear prominently on the homepage and category pages
          </p>
        </div>

        {/* Status Info */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Current Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === 'published' 
                ? 'bg-green-500/20 text-green-400' 
                : status === 'scheduled'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {isFeatured && ' • Featured'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishSettings;