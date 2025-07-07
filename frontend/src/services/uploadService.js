import API from './api';

const uploadService = {
  // Upload file
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload file' };
    }
  },

  // Get all uploaded files
  getFiles: async () => {
    try {
      const response = await API.get('/upload/files');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch files' };
    }
  },

  // Delete file
  deleteFile: async (filename) => {
    try {
      const response = await API.delete(`/upload/${filename}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete file' };
    }
  }
};

export default uploadService;