import React, { useState, useRef } from 'react';
import { Save, Eye } from 'lucide-react';

// Import components
import PreviewModal from './PreviewModal';
import ImageUploader from './ImageUploader';
import FormatToolbar from './FormatToolbar';
import PublishSettings from './PublishSettings';
import SEOSettings from './SEOSettings';

const BlogEditor = () => {
  // Content state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  
  // Publishing state
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [publishDate, setPublishDate] = useState('');
  
  // SEO state
  const [metaDescription, setMetaDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  
  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs
  const textareaRef = useRef(null);

  // Handlers
  const handleSave = async () => {
    setIsSaving(true);
    
    const postData = {
      title,
      subtitle,
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      featuredImage,
      status,
      publishDate: status === 'scheduled' ? publishDate : null,
      metaDescription,
      seoKeywords: seoKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Saving post:', postData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    alert('Post saved successfully!');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleImageInsert = (imageUrl) => {
    const imageMarkdown = `\n\n![Image](${imageUrl})\n\n`;
    const textarea = textareaRef.current;
    
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const beforeText = content.substring(0, cursorPos);
      const afterText = content.substring(cursorPos);
      const newContent = beforeText + imageMarkdown + afterText;
      
      setContent(newContent);
      
      // Focus and set cursor position after image
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = cursorPos + imageMarkdown.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const getPreviewData = () => {
    return {
      title,
      subtitle,
      content: convertMarkdownToHtml(content),
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      featuredImage,
      status,
      metaDescription,
      seoKeywords
    };
  };

  // Simple markdown to HTML converter
  const convertMarkdownToHtml = (markdown) => {
    return markdown
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; margin: 16px 0;" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/gim, '<br />');
  };

  const getWordCount = () => {
    return content.split(' ').filter(word => word.length > 0).length;
  };

  const isFormValid = () => {
    return title.trim() && content.trim() && category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Post</h1>
          <div className="text-sm text-gray-400 mt-1">
            Words: {getWordCount()} | Characters: {content.length}
          </div>
        </div>
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
            disabled={!isFormValid() || isSaving}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
              isFormValid() && !isSaving
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Post'}</span>
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
            <div className="text-xs text-gray-400 mt-1">
              {title.length}/60 characters (optimal for SEO)
            </div>
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
          <ImageUploader
            onImageInsert={handleImageInsert}
            onFeaturedImageChange={setFeaturedImage}
            featuredImage={featuredImage}
          />

          {/* Content Editor */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <FormatToolbar onFormat={setContent} textareaRef={textareaRef} />
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Article Content *
              </label>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here... 

Use ** for bold text, * for italic, ## for headings
- For bullet lists
1. For numbered lists
[link text](url) for links
![alt text](image-url) for images"
                rows={25}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Publish Settings */}
          <PublishSettings
            status={status}
            setStatus={setStatus}
            category={category}
            setCategory={setCategory}
            tags={tags}
            setTags={setTags}
            publishDate={publishDate}
            setPublishDate={setPublishDate}
          />

          {/* SEO Settings */}
          <SEOSettings
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            seoKeywords={seoKeywords}
            setSeoKeywords={setSeoKeywords}
            title={title}
            content={content}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        postData={getPreviewData()}
      />
    </div>
  );
};

export default BlogEditor;