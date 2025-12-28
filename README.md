# 🎥 Pulse Video - MERN Stack Video management Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v18+-green.svg)
![React](https://img.shields.io/badge/React-v18-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

**Pulse Video** is a full-stack video streaming application similar to YouTube. It allows users to upload, stream, edit, and manage videos seamlessly. The app utilizes **AWS S3** for scalable video storage and **Socket.io** for real-time interactions.

---
Note 📝:**content with titles like('crime', 'virus', 'attack', 'hack', 'violence', 'danger', 'restricted', 'illegal') ⚠️⚠️⚠️ will get flagged everything else is safe.

## 🚀 Live Demo
**[Click here to view the Live App](https://pulse-video-1.onrender.com)** *(Replace this link with your actual deployed URL)*

---


## ✨ Key Features

- **🔐 User Authentication:** Secure Login/Register with JWT (JSON Web Tokens).
- **📹 Video Upload:** Direct upload to **AWS S3** buckets for high performance.
- **▶️ Video Streaming:** Efficient video chunking and streaming support.
- **🔃 content analysis:** content with titles like('crime', 'virus', 'attack', 'hack', 'violence', 'danger', 'restricted', 'illegal') will get flagged everything else is safe.
- **🛠️ Dashboard:** Users can view, edit titles/descriptions, and delete their own videos.
- **⚡ Real-time Updates:** **Socket.io** integration for instant UI updates.
- **🎨 Responsive Design:** Built with React & Vite for a fast, mobile-friendly UI.
- **🛡️ Security:** Protected routes, secure headers (Helmet), and CORS configuration.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** (Vite)
- **Axios** (API Requests)
- **React Router DOM** (Navigation)
- **CSS3** (Styling)

### **Backend**
- **Node.js & Express.js** (API Server)
- **MongoDB & Mongoose** (Database)
- **AWS SDK** (S3 Storage Integration)
- **Socket.io** (Real-time communication)
- **JWT** (Authentication)

---

## ⚙️ Environment Variables

To run this project locally, you need to create `.env` files.

### **1. Backend (.env)**
Create a file named `.env` inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region (e.g., us-east-1)



📦 Installation & SetupFollow these steps to run the project locally.1. Clone the RepositoryBashgit clone [https://github.com/your-username/pulse-video.git](https://github.com/your-username/pulse-video.git)
cd pulse-video
2. Setup BackendBashcd server
npm install
npm run server
The server will start on http://localhost:50003. Setup FrontendOpen a new terminal:Bashcd client
npm install
npm run dev
The client will start on http://localhost:5173🔗 API EndpointsMethodEndpointDescriptionAccessPOST/api/auth/registerRegister a new userPublicPOST/api/auth/loginLogin user & get TokenPublicGET/api/videos/randomGet all videosPublicGET/api/videos/my-videosGet logged-in user's videosPrivatePOST/api/videos/uploadUpload video to S3Editor/AdminPUT/api/videos/:idUpdate video title/descOwnerDELETE/api/videos/:idDelete videoOwnerGET/api/videos/stream/:idStream video contentPublic📷 Screenshots(Optional: Add a screenshot here later)🤝 ContributingContributions are welcome!Fork the projectCreate your feature branch (git checkout -b feature/AmazingFeature)Commit your changes (git commit -m 'Add some AmazingFeature')Push to the branch (git push origin feature/AmazingFeature)Open a Pull Request📝 LicenseThis project is licensed under the MIT License.
### **Next Step**
Once you save this file, run these commands to push it to GitHub:

```bash
git add README.md
git commit -m "Add documentation"
git push origin main

Method,Endpoint,Description,Access
POST,/api/auth/register,Register a new user,Public
POST,/api/auth/login,Login user & get Token,Public
GET,/api/videos/random,Get all videos,Public
GET,/api/videos/my-videos,Get logged-in user's videos,Private
POST,/api/videos/upload,Upload video to S3,Editor/Admin
PUT,/api/videos/:id,Update video title/desc,Owner
DELETE,/api/videos/:id,Delete video,Owner
GET,/api/videos/stream/:id,Stream video content,Public


<img width="1902" height="1023" alt="Screenshot 2025-12-27 190752" src="https://github.com/user-attachments/assets/f05945df-21e2-4ea8-9113-4b000fcb57ed" />

<img width="1884" height="1004" alt="Screenshot 2025-12-27 190815" src="https://github.com/user-attachments/assets/34dd66ae-ab46-4a7b-bfba-9b64edd2bcd5" />





🤝 Contributing
Contributions are welcome!

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License.


### **Next Step**
Once you save this file, run these commands to push it to GitHub:

```bash
git add README.md
git commit -m "Add documentation"
git push origin main
