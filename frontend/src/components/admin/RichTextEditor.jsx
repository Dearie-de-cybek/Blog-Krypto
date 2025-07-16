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
  ChevronDown
} from 'lucide-react';

const RichTextEditor = ({ 
  initialContent = '', 
  onChange, 
  placeholder = "Start writing your blog post...",
  className = "",
  uploadFile = null,
  uploading = false 
}) => {
  const [content, setContent] = useState(initialContent);
  const [selectedFormat, setSelectedFormat] = useState(new Set());
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const isUpdatingRef = useRef(false);

  // Save and restore cursor position
  const saveCursorPosition = useCallback(() => {
    if (!editorRef.current) return null;
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const caretOffset = preCaretRange.toString().length;
    
    return caretOffset;
  }, []);

  const restoreCursorPosition = useCallback((savedPosition) => {
    if (!editorRef.current || savedPosition === null) return;
    
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let charCount = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      if (charCount + nodeLength >= savedPosition) {
        const range = document.createRange();
        const selection = window.getSelection();
        
        const offset = savedPosition - charCount;
        range.setStart(node, Math.min(offset, nodeLength));
        range.collapse(true);
        
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      }
      charCount += nodeLength;
    }
  }, []);

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange?.(newContent);
    }
  }, [onChange]);

  // Execute formatting commands
  const executeCommand = useCallback((command, value = null) => {
    const savedPosition = saveCursorPosition();
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    // Small delay to allow DOM to update
    setTimeout(() => {
      if (savedPosition !== null) {
        restoreCursorPosition(savedPosition);
      }
      handleContentChange();
      updateFormatState();
    }, 0);
  }, [handleContentChange, saveCursorPosition, restoreCursorPosition]);

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

  // Update content when initialContent changes, but preserve cursor
  useEffect(() => {
    if (initialContent !== content && editorRef.current) {
      isUpdatingRef.current = true;
      const savedPosition = saveCursorPosition();
      
      editorRef.current.innerHTML = initialContent;
      setContent(initialContent);
      
      setTimeout(() => {
        if (savedPosition !== null) {
          restoreCursorPosition(savedPosition);
        }
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [initialContent, content, saveCursorPosition, restoreCursorPosition]);

  // Handle image upload
  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (uploadFile) {
        try {
          const response = await uploadFile(file);
          // Backend returns: response.data.fullUrl
          const imageUrl = response.data?.fullUrl || response.fullUrl;
          const img = `<img src="${imageUrl}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Uploaded image" />`;
          executeCommand('insertHTML', img);
        } catch (error) {
          console.error('Failed to upload image:', error);
          // Fallback to base64 if upload fails
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = `<img src="${e.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Uploaded image" />`;
            executeCommand('insertHTML', img);
          };
          reader.readAsDataURL(file);
        }
      } else {
        // Fallback to base64 if no upload function provided
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = `<img src="${e.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Uploaded image" />`;
          executeCommand('insertHTML', img);
        };
        reader.readAsDataURL(file);
      }
    }
    event.target.value = '';
  }, [executeCommand, uploadFile]);

  // Handle video upload
  const handleVideoUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      if (uploadFile) {
        try {
          const response = await uploadFile(file);
          const videoUrl = response.data?.fullUrl || response.fullUrl;
          const video = `<video controls style="max-width: 100%; height: auto; margin: 10px 0;">
            <source src="${videoUrl}" type="${file.type}">
            Your browser does not support the video tag.
          </video>`;
          executeCommand('insertHTML', video);
        } catch (error) {
          console.error('Failed to upload video:', error);
          // Fallback to base64 if upload fails
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
      } else {
        // Fallback to base64 if no upload function provided
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
    }
    event.target.value = '';
  }, [executeCommand, uploadFile]);

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
      className={`p-2 rounded hover:bg-gray-600 transition-colors ${
        isActive ? 'bg-gray-600 text-yellow-400' : 'text-gray-300'
      } ${btnClassName}`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className={`border border-gray-600 rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-600 p-2 flex flex-wrap gap-1">
        {/* Heading Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            className="p-2 rounded hover:bg-gray-600 transition-colors text-gray-300 flex items-center gap-1"
            title="Headings"
          >
            <Type size={18} />
            <ChevronDown size={14} />
          </button>
          
          {showHeadingDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => applyHeading('p')}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm text-gray-300"
              >
                Normal
              </button>
              <button
                onClick={() => applyHeading('h1')}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 text-lg font-bold text-gray-300"
              >
                Heading 1
              </button>
              <button
                onClick={() => applyHeading('h2')}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 text-base font-bold text-gray-300"
              >
                Heading 2
              </button>
              <button
                onClick={() => applyHeading('h3')}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm font-bold text-gray-300"
              >
                Heading 3
              </button>
            </div>
          )}
        </div>

        <div className="w-px bg-gray-600 mx-1"></div>

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

        <div className="w-px bg-gray-600 mx-1"></div>

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

        <div className="w-px bg-gray-600 mx-1"></div>

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

        <div className="w-px bg-gray-600 mx-1"></div>

        {/* Media and Links */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          icon={Image}
          title={uploading ? "Uploading..." : "Insert Image"}
          className={uploading ? "opacity-50 cursor-not-allowed" : ""}
        />
        <ToolbarButton
          onClick={() => videoInputRef.current?.click()}
          icon={Video}
          title={uploading ? "Uploading..." : "Insert Video"}
          className={uploading ? "opacity-50 cursor-not-allowed" : ""}
        />
        <ToolbarButton
          onClick={insertLink}
          icon={Link}
          title="Insert Link"
        />

        <div className="w-px bg-gray-600 mx-1"></div>

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

        <div className="w-px bg-gray-600 mx-1"></div>

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
        disabled={uploading}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
        disabled={uploading}
      />

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyUp={updateFormatState}
        onMouseUp={updateFormatState}
        className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none bg-gray-900 text-white focus:ring-2 focus:ring-yellow-500"
        style={{
          lineHeight: '1.6',
          fontSize: '16px'
        }}
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

      {/* Upload indicator */}
      {uploading && (
        <div className="bg-yellow-500/20 border-t border-yellow-500/50 p-2 text-sm text-yellow-400 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
          Uploading file...
        </div>
      )}

      {/* Custom styles for the editor */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          pointer-events: none;
          white-space: pre-line;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          color: #ffffff;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          color: #ffffff;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
          color: #ffffff;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #fbbf24;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #d1d5db;
          background-color: #374151;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        [contenteditable] pre {
          background-color: #111827;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          margin: 1rem 0;
          border: 1px solid #4b5563;
          color: #f3f4f6;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        [contenteditable] li {
          margin: 0.5rem 0;
        }
        
        [contenteditable] a {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #93c5fd;
        }
        
        [contenteditable] img {
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
        }
        
        [contenteditable] video {
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;