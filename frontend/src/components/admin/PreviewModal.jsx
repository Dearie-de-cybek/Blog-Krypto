import React from 'react';
import { X } from 'lucide-react';

const PreviewModal = ({ isOpen, onClose, postData }) => {
  if (!isOpen) return null;

  // Clean and format content for display
  const formatContent = (htmlContent) => {
    if (!htmlContent) return 'No content yet...';
    
    // Basic cleanup for better display
    return htmlContent
      .replace(/\n\s*\n/g, '<br/><br/>') 
      .replace(/\n/g, '<br/>') 
      .replace(/<br\/><br\/>/g, '</p><p>');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">Article Preview</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Featured Image */}
          {postData.featuredImage && (
            <div className="mb-6">
              <img 
                src={postData.featuredImage} 
                alt="Featured" 
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {postData.category || 'Uncategorized'}
            </span>
            {postData.isFeatured && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
            {postData.title || 'Untitled Article'}
          </h1>
          
          {/* Subtitle */}
          {postData.subtitle && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {postData.subtitle}
            </p>
          )}
          
          {/* Publication Info */}
          <div className="flex items-center text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
            <span>Published on {new Date().toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{postData.status || 'Draft'}</span>
          </div>
          
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              style={{
                lineHeight: '1.7',
                fontSize: '16px'
              }}
              dangerouslySetInnerHTML={{ 
                __html: formatContent(postData.content)
              }}
            />
          </div>
          
          {/* Tags */}
          {postData.tags && postData.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEO Preview */}
          {postData.metaDescription && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">SEO Description:</h4>
              <p className="text-sm text-gray-600">{postData.metaDescription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;