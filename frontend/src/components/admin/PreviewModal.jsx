import React from 'react';
import { X } from 'lucide-react';

const PreviewModal = ({ isOpen, onClose, postData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-400">Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-amber-400" />
          </button>
        </div>
        
        <div className="p-6">
          {postData.featuredImage && (
            <img 
              src={postData.featuredImage} 
              alt="Featured" 
              className="w-full h-64 object-cover rounded-lg mb-6 text-amber-400"
            />
          )}
          
          <div className="mb-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {postData.category || 'Uncategorized'}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-amber-400">{postData.title || 'Untitled'}</h1>
          
          {postData.subtitle && (
            <p className="text-xl text-gray-600 mb-6">{postData.subtitle}</p>
          )}
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: postData.content || 'No content yet...' }}
          />
          
          {postData.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;