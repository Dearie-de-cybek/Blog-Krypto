import React from 'react';

const PublishSettings = ({ 
  status, 
  setStatus, 
  category, 
  setCategory, 
  tags, 
  setTags,
  publishDate,
  setPublishDate 
}) => {
  
  const categories = [
    'Market Analysis',
    'Education', 
    'Business',
    'Events',
    'Interviews',
    'Press Release',
    'Technology',
    'Opinion',
    'Tutorial'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', description: 'Not visible to public' },
    { value: 'published', label: 'Published', description: 'Live on website' },
    { value: 'scheduled', label: 'Scheduled', description: 'Publish at specific time' }
  ];

  const handleTagInput = (e) => {
    const value = e.target.value;
    setTags(value);
  };

  const getTagArray = () => {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Publish Settings</h3>
      
      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            {statusOptions.find(opt => opt.value === status)?.description}
          </p>
        </div>

        {/* Publish Date for Scheduled */}
        {status === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
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
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {!category && (
            <p className="text-xs text-red-400 mt-1">Category is required</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={handleTagInput}
            placeholder="bitcoin, crypto, trading"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
          
          {/* Tag Preview */}
          {getTagArray().length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {getTagArray().map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-yellow-500 text-black px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Word Count */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Word Count:</span>
              <span className="text-white">{tags.split(' ').filter(word => word.length > 0).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishSettings;