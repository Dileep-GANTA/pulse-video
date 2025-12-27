import { useEffect, useState } from 'react';
import api from '../services/api';
import io from 'socket.io-client';
import '../App.css'; // Make sure to import the CSS
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  
  // -- FILTERS --
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // -- UPLOAD STATE --
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  
  // -- PROGRESS STATE --
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchVideos();
    const socket = io(API_URL);

    socket.on('videoStatusUpdate', (data) => {
      setVideos((prevVideos) => 
        prevVideos.map((video) => 
          video._id === data.videoId 
            ? { ...video, status: data.status, progress: data.progress } 
            : video
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const fetchVideos = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get('/api/videos/my-videos', {

        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }
      });
      const normalized = res.data.map(v => ({
        ...v, 
        progress: v.status === 'processing' ? 50 : 100
      }));
      setVideos(normalized);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append('video', uploadFile);
    formData.append('title', uploadTitle);
    formData.append('description', uploadDesc);

    setIsUploading(true);
    setUploadProgress(0);
    setShowUploadForm(false);

    try {
      const token = localStorage.getItem('token');
      await api.post('/api/videos/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      setIsUploading(false);
      setUploadTitle('');
      setUploadDesc('');
      setUploadFile(null);
      fetchVideos();

    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert('Upload Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(videos.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to delete video');
    }
  };






  // Function to handle the update
const handleEdit = async (videoId, currentTitle, currentDesc) => {
  // 1. Ask user for new details (Simple way)
  const newTitle = prompt("Enter new title:", currentTitle);
  if (!newTitle) return; // If user clicked Cancel

  const newDesc = prompt("Enter new description:", currentDesc);
  
  try {
    const token = localStorage.getItem('token');
    
    // 2. Send request to Backend
    await axios.put(
      `${API_URL}/api/videos/${videoId}`,
      { title: newTitle, desc: newDesc }, // Data to update
      { headers: { Authorization: `Bearer ${token}` } } // Auth Token
    );

    alert("Video updated successfully!");
    window.location.reload(); // Refresh to see changes
    // OR: call fetchVideos() if you are in Dashboard

  } catch (err) {
    console.error(err);
    alert("Failed to update video");
  }
};

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">
      
      {/* --- Header --- */}
      <div className="dashboard-header">
        <div className="title-section">
          <h2>Video Management</h2>
          <p style={{color: 'var(--text-muted)', marginTop: '5px'}}>Manage your content and moderation.</p>
        </div>
        
        <div className="controls-bar">
          <button 
            onClick={() => setShowUploadForm(!showUploadForm)} 
            className={`btn ${showUploadForm ? 'btn-outline' : 'btn-primary'}`}
          >
            {showUploadForm ? 'Cancel' : '+ Upload Video'}
          </button>

          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select-field"
          >
            <option value="all">All Status</option>
            <option value="safe">Safe</option>
            <option value="flagged">Flagged</option>
            <option value="processing">Processing</option>
          </select>
        </div>
      </div>

      {/* --- Upload Form --- */}
      {showUploadForm && (
        <div className="upload-section">
          <form onSubmit={handleUpload} className="upload-form">
            <input 
              type="text" placeholder="Title" required 
              value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
              className="input-field" style={{flex: 1}}
            />
            <input 
              type="text" placeholder="Description (Optional)" 
              value={uploadDesc} onChange={e => setUploadDesc(e.target.value)}
              className="input-field" style={{flex: 2}}
            />
            <input 
              type="file" accept="video/*" required 
              onChange={e => setUploadFile(e.target.files[0])}
              className="input-field"
            />

            
            <button type="submit" className="btn btn-primary">Start Upload</button>
          </form>
        </div>

        
      )}

      {/* --- Video Grid --- */}
      <div className="video-grid">
        
        {/* Virtual Upload Card */}
        {isUploading && (
          <div className="video-card">
            <div className="card-header">
              <h3 className="card-title">{uploadTitle || "Uploading..."}</h3>
              <span className="badge uploading">UPLOADING {uploadProgress}%</span>
            </div>
            <p className="card-desc">Sending data to AWS Cloud...</p>
            <div className="progress-track">
              <div 
                className="progress-fill fill-upload" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Real Cards */}
        {filteredVideos.map((video) => (
          <div key={video._id} className="video-card">
            <div className="card-header">
              <h3 className="card-title">{video.title}</h3>

                    <button 
                onClick={() => handleEdit(video._id, video.title, video.desc)}
                style={{ marginRight: '10px', background: '#4CAF50', color: 'white' }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(video._id)}
                className="btn-icon"
                title="Delete Video"
              >
                🗑️
              </button>
            </div>
            
            <p className="card-desc">
              <label style={{color: '#101215ff', fontWeight: 'bold', backgroundColor: '#e3e9f3ff', padding: '0.25rem 0.5rem', borderRadius: '4px'}}>Description :</label>
              "{video.description || 'No description provided.'}"
            </p>
            

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              
               <span className={`badge ${video.status}`}>
                
                {video.status}
              </span>
              {video.videoDuration > 0 && (
                <small style={{fontWeight: 'bold', color: '#101215ff'}}>{Math.floor(video.videoDuration)}s</small>
              )}
            </div>

            {/* Processing Bar */}
            {video.status === 'processing' && (
              <div className="progress-track">
                <div 
                  className="progress-fill fill-process" 
                  style={{ width: `${video.progress || 50}%` }}
                ></div>
              </div>
            )}

            {/* Watch Buttons */}
            {video.status === 'safe' && (
              <button 
                onClick={() => setPlayingVideoId(video._id)}
                className="btn btn-watch safe"
              >
                ▶ Watch Video
              </button>
            )}

            {video.status === 'flagged' && (
              <button 
                onClick={() => setPlayingVideoId(video._id)}
                className="btn btn-watch flagged"
              >
                ⚠️ Review Content
              </button>
            )}
          </div>
        ))}
      </div>
{/* --- ENHANCED PLAYER MODAL --- */}
{playingVideoId && (
  <div className="modal-overlay" onClick={() => setPlayingVideoId(null)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      
      <button className="close-modal-btn" onClick={() => setPlayingVideoId(null)}>✕</button>

      {/* LEFT: Main Player Area */}
      <div className="modal-main-section">
        <video 
          controls 
          autoPlay 
          className="modal-video-player" 
          src={`${API_URL}/api/videos/stream/${playingVideoId}`} 
        />
        
        {/* Find the current video details to display title/desc */}
        {(() => {
          const currentVid = videos.find(v => v._id === playingVideoId);
          return currentVid ? (
            <div className="modal-info-area">
              <h2 style={{margin: '0 0 10px 0'}}>{currentVid.title}</h2>
              <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                <span className="badge safe">HD</span>
                <span style={{color: '#aaa', fontSize: '0.9rem'}}>1,234 views</span>
              </div>
              <p style={{color: '#ccc', lineHeight: '1.6'}}>
                {currentVid.description || 'No description available for this video.'}
              </p>
            </div>
          ) : null;
        })()}
      </div>

      {/* RIGHT: Related Videos Sidebar */}
      <div className="modal-sidebar">
        <div className="sidebar-title">Up Next</div>
        
        {filteredVideos
          .filter(v => v._id !== playingVideoId && (v.status === 'safe' || v.status === 'flagged'))
          .map(video => (
            <div 
              key={video._id} 
              className="related-card" 
              onClick={() => setPlayingVideoId(video._id)} // Click to switch video
            >
              {/* Mini Thumbnail */}
              <div className="related-thumb">
                 {/* Simple Icon placeholder */}
                 <span style={{fontSize: '1.5rem', opacity: 0.7}}>▶</span>
              </div>
              
              {/* Mini Info */}
              <div className="related-info">
                <h5>{video.title}</h5>
                {video.videoDuration > 0 && <span>{Math.floor(video.videoDuration)}s • </span>}
                <span>Pulse Video</span>
              </div>
            </div>
        ))}
      </div>

    </div>
  </div>
)}    </div>
  );
};

export default Dashboard;