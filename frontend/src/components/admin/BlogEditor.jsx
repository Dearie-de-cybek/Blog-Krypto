import React, { useState, useRef } from "react";
import { Save, Eye } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import articlesService from "../../services/articlesService";
import { useUpload } from "../../hooks/useUpload";

// Import components
import PreviewModal from "./PreviewModal";
import ImageUploader from "./ImageUploader";
import PublishSettings from "./PublishSettings";
import SEOSettings from "./SEOSettings";

const BlogEditor = ({
  articleId = null,
  initialData = null,
  onSave = null,
}) => {
  // Content state
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage || ""
  );

  // Publishing state
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [publishDate, setPublishDate] = useState(
    initialData?.publishDate || ""
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured || false
  );

  // SEO state
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [seoKeywords, setSeoKeywords] = useState(
    initialData?.metaKeywords?.join(", ") || ""
  );

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Refs
  const quillRef = useRef(null);

  // Backend integration
  const { uploadFile, uploading } = useUpload();

  // React Quill configuration
  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: handleImageClick,
        video: handleVideoClick
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ];

  // Custom image handler for Quill
  function handleImageClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const response = await uploadFile(file);
          const imageUrl = response.data.fullUrl;
          
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
          quill.setSelection(range.index + 1);
        } catch (error) {
          setError("Failed to upload image: " + error.message);
        }
      }
    };
    
    input.click();
  }

  // Custom video handler for Quill
  function handleVideoClick() {
    const url = prompt('Enter YouTube or Vimeo URL:');
    if (!url) return;
    
    let embedUrl = '';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
    }
    
    if (embedUrl) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'video', embedUrl);
      quill.setSelection(range.index + 1);
    } else {
      alert('Please enter a valid YouTube or Vimeo URL');
    }
  }

  // Enhanced image insertion handler for ImageUploader component
  const handleImageInsert = async (imageData) => {
    try {
      let imageUrl = '';
      
      // Check if imageData is a file or HTML string
      if (imageData instanceof File) {
        const response = await uploadFile(imageData);
        imageUrl = response.data.fullUrl;
      } else if (typeof imageData === 'string' && imageData.includes('<img')) {
        // Extract URL from HTML string
        const urlMatch = imageData.match(/src="([^"]+)"/);
        if (urlMatch) {
          imageUrl = urlMatch[1];
        }
      } else if (typeof imageData === 'string') {
        // Direct URL
        imageUrl = imageData;
      }

      if (imageUrl && quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection() || { index: 0 };
        quill.insertEmbed(range.index, 'image', imageUrl);
        quill.setSelection(range.index + 1);
      }
    } catch (error) {
      setError("Failed to insert image: " + error.message);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate required fields
      if (!title.trim() || !content.trim() || !category || !featuredImage) {
        throw new Error('Please fill in all required fields (title, content, category, and featured image)');
      }

      const postData = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: content.trim(),
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        featuredImage,
        status,
        publishDate: status === 'scheduled' ? publishDate : null,
        metaDescription: metaDescription.trim(),
        metaKeywords: seoKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0),
        isFeatured,
        createdAt: articleId ? initialData?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      let response;
      if (articleId) {
        response = await articlesService.updateArticle(articleId, postData);
        setSuccess('Article updated successfully!');
      } else {
        response = await articlesService.createArticle(postData);
        setSuccess('Article created successfully!');
      }

      console.log('Article saved:', response.data);
      
      if (onSave) {
        onSave(response.data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (articleId) {
      window.open(`/article/${articleId}`, "_blank");
    } else {
      setShowPreview(true);
    }
  };

  const handleFeaturedImageUpload = async (file) => {
    try {
      const response = await uploadFile(file);
      setFeaturedImage(response.data.fullUrl);
      setSuccess("Featured image uploaded successfully!");
      setError("");
    } catch (err) {
      setError("Failed to upload featured image: " + err.message);
    }
  };

  const getPreviewData = () => {
    return {
      title,
      subtitle,
      content: content,
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      featuredImage,
      status,
      metaDescription,
      seoKeywords: seoKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0),
      isFeatured,
    };
  };

  const getWordCount = () => {
    // Strip HTML tags for accurate word count
    const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return textOnly.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return content.length;
  };

  const isFormValid = () => {
    return title.trim() && content.trim() && category && featuredImage;
  };

  // Clear messages after successful operations
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {articleId ? "Edit Article" : "Create New Post"}
          </h1>
          <div className="text-sm text-gray-400 mt-1">
            Words: {getWordCount()} | Characters: {getCharacterCount()}
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
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Article"}</span>
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
            onFeaturedImageUpload={handleFeaturedImageUpload}
            featuredImage={featuredImage}
            uploading={uploading}
            uploadFile={uploadFile}
          />

          {/* Content Editor with React Quill */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Article Content *
              </label>
              
              {/* Custom CSS for dark theme */}
              <style jsx>{`
                .ql-toolbar {
                  border-top: 1px solid #374151 !important;
                  border-left: 1px solid #374151 !important;
                  border-right: 1px solid #374151 !important;
                  background: #1f2937 !important;
                }
                .ql-container {
                  border-bottom: 1px solid #374151 !important;
                  border-left: 1px solid #374151 !important;
                  border-right: 1px solid #374151 !important;
                  background: #111827 !important;
                  color: white !important;
                }
                .ql-editor {
                  color: white !important;
                  font-size: 16px !important;
                  line-height: 1.6 !important;
                  min-height: 400px !important;
                }
                .ql-editor.ql-blank::before {
                  color: #9ca3af !important;
                  font-style: normal !important;
                }
                .ql-toolbar .ql-stroke {
                  stroke: #d1d5db !important;
                }
                .ql-toolbar .ql-fill {
                  fill: #d1d5db !important;
                }
                .ql-toolbar button:hover .ql-stroke {
                  stroke: #fbbf24 !important;
                }
                .ql-toolbar button:hover .ql-fill {
                  fill: #fbbf24 !important;
                }
                .ql-toolbar button.ql-active .ql-stroke {
                  stroke: #fbbf24 !important;
                }
                .ql-toolbar button.ql-active .ql-fill {
                  fill: #fbbf24 !important;
                }
              `}</style>

              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Start writing your article content here...

Use the toolbar above to format your text, add images, videos, and more.
The editor supports rich text formatting, links, lists, and media embedding."
                style={{
                  background: '#111827',
                  borderRadius: '8px',
                }}
              />
              
              <div className="mt-3 text-xs text-gray-400">
                Rich text editor with full formatting support. Use the toolbar to format text, insert images, and embed videos.
              </div>
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
            isFeatured={isFeatured}
            setIsFeatured={setIsFeatured}
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