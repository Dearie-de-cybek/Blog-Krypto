import React, { useState, useRef } from "react";
import { Save, Eye } from "lucide-react";
import articlesService from "../../services/articlesService";
import { useUpload } from "../../hooks/useUpload";

// Import components
import PreviewModal from "./PreviewModal";
import ImageUploader from "./ImageUploader";
import FormatToolbar from "./FormatToolbar";
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
  const textareaRef = useRef(null);

  // Backend integration
  const { uploadFile, uploading } = useUpload();

  // Enhanced image insertion handler
  const handleImageInsert = (imageData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    let insertHTML = '';

    // Check if imageData is a file (from toolbar) or HTML string (from ImageUploader)
    if (imageData instanceof File) {
      // Handle file upload from toolbar
      uploadFile(imageData)
        .then(response => {
          const imageUrl = response.data.fullUrl;
          insertHTML = `<img src="${imageUrl}" alt="${imageData.name}" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
          insertAtCursor(insertHTML);
        })
        .catch(err => {
          setError("Failed to upload image: " + err.message);
        });
      return;
    } else {
      // Handle HTML string from ImageUploader
      insertHTML = imageData;
    }

    insertAtCursor(insertHTML);
  };

  const insertAtCursor = (htmlContent) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const beforeText = content.substring(0, cursorPos);
    const afterText = content.substring(cursorPos);
    const newContent = beforeText + '\n' + htmlContent + '\n' + afterText;

    setContent(newContent);

    // Focus and set cursor position after inserted content
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = cursorPos + htmlContent.length + 2;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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
        // Update existing article
        response = await articlesService.updateArticle(articleId, postData);
        setSuccess('Article updated successfully!');
      } else {
        // Create new article
        response = await articlesService.createArticle(postData);
        setSuccess('Article created successfully!');
      }

      console.log('Article saved:', response.data);
      
      // Call onSave callback if provided (for parent component to handle post-save actions)
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
      // If editing existing article, open published version
      window.open(`/article/${articleId}`, "_blank");
    } else {
      // If creating new article, show preview modal
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
      content: content, // Keep as HTML since we're now using HTML formatting
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

          {/* Content Editor */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <FormatToolbar
              onFormat={setContent}
              textareaRef={textareaRef}
              content={content}
              onImageInsert={handleImageInsert}
            />

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Article Content *
              </label>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your article content here...

Use the formatting toolbar above to add:
• Bold and italic text
• Headings and lists
• Links and images
• Videos and other media

You can also type HTML directly for advanced formatting."
                rows={25}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm leading-relaxed"
              />
              <div className="mt-2 text-xs text-gray-400">
                Rich HTML content editor - Use toolbar buttons or type HTML directly
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