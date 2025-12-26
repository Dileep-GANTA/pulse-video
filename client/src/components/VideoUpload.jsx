import { useState } from 'react';
import api from '../services/api';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file); // Key must match backend 'upload.single("video")'
    formData.append('title', title);
    formData.append('description', description);

    // Retrieve token from storage (assuming you stored it during login)
    const token = localStorage.getItem('token'); 

    try {
      setMessage('Uploading...');
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      };

      const res = await api.post('/api/videos/upload', formData, config);
      setMessage(`Success: ${res.data.message}`);
      setUploadProgress(0); // Reset after success
    } catch (error) {
      setMessage('Upload Failed: ' + (error.response?.data?.message || error.message));
      setUploadProgress(0);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h3>Upload Video</h3>
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label><br />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input type="file" accept="video/*" onChange={handleFileChange} required />
        </div>
        
        {uploadProgress > 0 && (
          <div style={{ width: '100%', backgroundColor: '#f3f3f3', marginBottom: '10px' }}>
            <div style={{ width: `${uploadProgress}%`, height: '10px', backgroundColor: 'blue' }}></div>
            <p>{uploadProgress}%</p>
          </div>
        )}

        <button type="submit">Upload Video</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VideoUpload;