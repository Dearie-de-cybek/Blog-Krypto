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
  Hash
} from 'lucide-react';

const FormatToolbar = ({ onFormat, textareaRef }) => {
  
  const insertText = (before, after = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = before + textToInsert + after;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newValue = beforeText + newText + afterText;
    onFormat(newValue);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatBold = () => {
    insertText('**', '**', 'bold text');
  };

  const formatItalic = () => {
    insertText('*', '*', 'italic text');
  };

  const formatHeading = () => {
    insertText('## ', '', 'Heading');
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
      newText = beforeText + '- ';
    } else {
      newText = beforeText + '\n- ';
    }
    
    onFormat(newText + afterText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newText.length, newText.length);
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
      newText = beforeText + '1. ';
    } else {
      newText = beforeText + '\n1. ';
    }
    
    onFormat(newText + afterText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newText.length, newText.length);
    }, 0);
  };

  const formatLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      insertText('[', `](${url})`, 'link text');
    }
  };

  const formatImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      insertText('![', `](${url})`, 'alt text');
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
    { icon: Link, action: formatLink, title: 'Link' },
    { icon: AlignLeft, action: formatImage, title: 'Insert Image' }
  ];

  return (
    <div className="border-b border-gray-700 p-4">
      <div className="flex items-center space-x-2">
        {buttons.map((button, index) => {
          if (button.divider) {
            return <div key={index} className="w-px h-6 bg-gray-600 mx-2"></div>;
          }
          
          const Icon = button.icon;
          return (
            <button
              key={index}
              onClick={button.action}
              className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-yellow-400 transition-colors"
              title={button.title}
              type="button"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FormatToolbar;