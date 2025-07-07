import { useState } from 'react';
import uploadService from '../services/uploadService';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setUploadError(null);
      const response = await uploadService.uploadFile(file);
      return response;
    } catch (error) {
      setUploadError(error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    uploadError
  };
};