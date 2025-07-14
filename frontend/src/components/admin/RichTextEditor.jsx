import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Image, 
  Video, 
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Undo,
  Redo,
  Type,
  Heading1,
  Heading2,
  Heading3,
  ChevronDown
} from 'lucide-react';

const RichTextEditor = ({ 
  initialContent = '', 
  onChange, 
  placeholder = "Start writing your blog post...",
  className = "" 
}) => {
  const [content, setContent] = useState(initialContent);
  const [selectedFormat, setSelectedFormat] = useState(new Set());
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange?.(newContent);
    }
  }, [onChange]);

  // Execute formatting commands
  const executeCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
    updateFormatState();
  }, [handleContentChange]);

  // Handle heading selection
  const applyHeading = useCallback((headingType) => {
    executeCommand('formatBlock', headingType);
    setShowHeadingDropdown(false);
  }, [executeCommand]);

  // Update format state based on current selection
  const updateFormatState = useCallback(() => {
    const formats = new Set();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertOrderedList')) formats.add('orderedList');
    if (document.queryCommandState('insertUnorderedList')) formats.add('unorderedList');
    
    setSelectedFormat(formats);
  }, []);

  // Handle selection change to update format state
  useEffect(() => {
    const handleSelectionChange = () => {
      updateFormatState();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateFormatState]);

  // Handle image upload
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Uploaded image" />`;
        executeCommand('insertHTML', img);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }, [executeCommand]);

  // Handle video upload
  const handleVideoUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const video = `<video controls style="max-width: 100%; height: auto; margin: 10px 0;">
          <source src="${e.target.result}" type="${file.type}">
          Your browser does not support the video tag.
        </video>`;
        executeCommand('insertHTML', video);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }, [executeCommand]);

  // Handle link insertion
  const insertLink = useCallback(() => {
    const url = prompt('Enter the URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  }, [executeCommand]);

  // Toolbar button component
  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    icon: Icon, 
    title, 
    className: btnClassName = "" 
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      } ${btnClassName}`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {/* Heading Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 flex items-center gap-1"
            title="Headings"
          >
            <Type size={18} />
            <ChevronDown size={14} />
          </button>
          
          {showHeadingDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => applyHeading('p')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                Normal
              </button>
              <button
                onClick={() => applyHeading('h1')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-lg font-bold"
              >
                Heading 1
              </button>
              <button
                onClick={() => applyHeading('h2')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-base font-bold"
              >
                Heading 2
              </button>
              <button
                onClick={() => applyHeading('h3')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm font-bold"
              >
                Heading 3
              </button>
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Basic Formatting */}
        <ToolbarButton
          onClick={() => executeCommand('bold')}
          isActive={selectedFormat.has('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => executeCommand('italic')}
          isActive={selectedFormat.has('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => executeCommand('underline')}
          isActive={selectedFormat.has('underline')}
          icon={Underline}
          title="Underline (Ctrl+U)"
        />

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Lists */}
        <ToolbarButton
          onClick={() => executeCommand('insertUnorderedList')}
          isActive={selectedFormat.has('unorderedList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => executeCommand('insertOrderedList')}
          isActive={selectedFormat.has('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <ToolbarButton
          onClick={() => executeCommand('justifyLeft')}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => executeCommand('justifyCenter')}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => executeCommand('justifyRight')}
          icon={AlignRight}
          title="Align Right"
        />

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Media and Links */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          icon={Image}
          title="Insert Image"
        />
        <ToolbarButton
          onClick={() => videoInputRef.current?.click()}
          icon={Video}
          title="Insert Video"
        />
        <ToolbarButton
          onClick={insertLink}
          icon={Link}
          title="Insert Link"
        />

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Additional Formatting */}
        <ToolbarButton
          onClick={() => executeCommand('formatBlock', 'blockquote')}
          icon={Quote}
          title="Quote"
        />
        <ToolbarButton
          onClick={() => executeCommand('formatBlock', 'pre')}
          icon={Code}
          title="Code Block"
        />

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => executeCommand('undo')}
          icon={Undo}
          title="Undo (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => executeCommand('redo')}
          icon={Redo}
          title="Redo (Ctrl+Y)"
        />
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyUp={updateFormatState}
        onMouseUp={updateFormatState}
        className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none"
        style={{
          lineHeight: '1.6',
          fontSize: '16px'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
        suppressContentEditableWarning={true}
        placeholder={placeholder}
        onFocus={(e) => {
          if (e.target.innerHTML === '' && placeholder) {
            e.target.classList.add('empty');
          }
        }}
        onBlur={(e) => {
          e.target.classList.remove('empty');
        }}
      />

      {/* Custom styles for the editor */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          margin: 1rem 0;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        [contenteditable] li {
          margin: 0.5rem 0;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;