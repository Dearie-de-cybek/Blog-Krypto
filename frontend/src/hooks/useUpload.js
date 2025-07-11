import { useState } from 'react';
import uploadService from '../services/uploadService';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);
    
    try {
      const response = await uploadService.uploadFile(file);
      return response;
    } catch (err) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setError(null);
    
    try {
      const uploadPromises = Array.from(files).map(file => uploadService.uploadFile(file));
      const responses = await Promise.all(uploadPromises);
      return responses;
    } catch (err) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploadFiles,
    uploading,
    error,
    setError
  };
};