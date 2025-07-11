import React from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  Link, 
  AlignLeft, 
  AlignCenter,
  ListOrdered,
  Type,
  Hash,
  Image,
  Video
} from 'lucide-react';

const FormatToolbar = ({ onFormat, textareaRef, content, onImageInsert }) => {
  
  const wrapSelectedText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      // If text is selected, wrap it
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      const newValue = beforeText + before + selectedText + after + afterText;
      
      onFormat(newValue);
      
      // Set cursor position after the formatted text
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + selectedText.length + after.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // If no text selected, insert at cursor position
      insertAtCursor(before + 'text' + after, before.length, before.length + 4);
    }
  };

  const insertAtCursor = (text, selectStart = 0, selectEnd = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(start);
    
    const newValue = beforeText + text + afterText;
    onFormat(newValue);
    
    // Set cursor position and select placeholder text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + selectStart, start + selectEnd);
    }, 0);
  };

  const formatBold = () => {
    wrapSelectedText('<strong>', '</strong>');
  };

  const formatItalic = () => {
    wrapSelectedText('<em>', '</em>');
  };

  const formatHeading = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    
    // Find the start of current line
    const lastNewline = beforeText.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const currentLine = textarea.value.substring(lineStart, start);
    
    // Check if already a heading
    if (currentLine.startsWith('<h2>')) return;
    
    // Insert heading at current line
    const beforeLine = textarea.value.substring(0, lineStart);
    const afterCursor = textarea.value.substring(start);
    const newValue = beforeLine + '<h2>' + currentLine + 'heading</h2>\n' + afterCursor;
    
    onFormat(newValue);
    
    setTimeout(() => {
      textarea.focus();
      const newPos = lineStart + 4 + currentLine.length;
      textarea.setSelectionRange(newPos, newPos + 7); // Select "heading"
    }, 0);
  };

  const formatList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(start);
    
    // Check if we're at the beginning of a line
    const lastNewline = beforeText.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const currentLine = beforeText.substring(lineStart);
    
    let newText;
    if (currentLine.trim() === '') {
      newText = beforeText + '<ul>\n  <li>List item</li>\n</ul>\n';
    } else {
      newText = beforeText + '\n<ul>\n  <li>List item</li>\n</ul>\n';
    }
    
    onFormat(newText + afterText);
    
    setTimeout(() => {
      textarea.focus();
      const selectStart = newText.indexOf('List item');
      textarea.setSelectionRange(selectStart, selectStart + 9);
    }, 0);
  };

  const formatNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(start);
    
    const lastNewline = beforeText.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const currentLine = beforeText.substring(lineStart);
    
    let newText;
    if (currentLine.trim() === '') {
      newText = beforeText + '<ol>\n  <li>List item</li>\n</ol>\n';
    } else {
      newText = beforeText + '\n<ol>\n  <li>List item</li>\n</ol>\n';
    }
    
    onFormat(newText + afterText);
    
    setTimeout(() => {
      textarea.focus();
      const selectStart = newText.indexOf('List item');
      textarea.setSelectionRange(selectStart, selectStart + 9);
    }, 0);
  };

  const formatLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const url = prompt('Enter URL:');
    if (!url) return;
    
    const linkText = selectedText || 'link text';
    const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    const newValue = beforeText + linkHTML + afterText;
    
    onFormat(newValue);
    
    if (!selectedText) {
      setTimeout(() => {
        textarea.focus();
        const linkStart = beforeText.length + linkHTML.indexOf('link text');
        textarea.setSelectionRange(linkStart, linkStart + 9);
      }, 0);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && onImageInsert) {
        onImageInsert(file, true); // true indicates it's for content insertion
      }
    };
    input.click();
  };

  const handleImageURL = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const imageHTML = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
      insertAtCursor(imageHTML);
    }
  };

  const handleVideoEmbed = () => {
    const url = prompt('Enter YouTube or Vimeo URL:');
    if (!url) return;
    
    let embedHTML = '';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      
      if (videoId) {
        embedHTML = `<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0;">
  <iframe src="https://www.youtube.com/embed/${videoId}" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
          frameborder="0" allowfullscreen></iframe>
</div>`;
      }
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        embedHTML = `<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0;">
  <iframe src="https://player.vimeo.com/video/${videoId}" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
          frameborder="0" allowfullscreen></iframe>
</div>`;
      }
    } else {
      // Generic video tag for direct video URLs
      embedHTML = `<video controls style="max-width: 100%; height: auto; margin: 16px 0;">
  <source src="${url}" type="video/mp4">
  Your browser does not support the video tag.
</video>`;
    }
    
    if (embedHTML) {
      insertAtCursor(embedHTML);
    } else {
      alert('Please enter a valid YouTube or Vimeo URL');
    }
  };

  const buttons = [
    { icon: Bold, action: formatBold, title: 'Bold' },
    { icon: Italic, action: formatItalic, title: 'Italic' },
    { icon: Hash, action: formatHeading, title: 'Heading' },
    { divider: true },
    { icon: List, action: formatList, title: 'Bullet List' },
    { icon: ListOrdered, action: formatNumberedList, title: 'Numbered List' },
    { divider: true },
    { icon: Link, action: formatLink, title: 'Insert Link' },
    { icon: Image, action: handleImageUpload, title: 'Upload Image' },
    { icon: AlignLeft, action: handleImageURL, title: 'Image from URL' },
    { icon: Video, action: handleVideoEmbed, title: 'Embed Video' }
  ];

  return (
    <div className="border-b border-gray-700 p-4">
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        {buttons.map((button, index) => {
          if (button.divider) {
            return <div key={index} className="w-px h-6 bg-gray-600 mx-2"></div>;
          }
          
          const Icon = button.icon;
          return (
            <button
              key={index}
              onClick={button.action}
              className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors flex items-center justify-center"
              title={button.title}
              type="button"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Select text and click buttons to format, or click to insert elements at cursor position
      </div>
    </div>
  );
};

export default FormatToolbar;