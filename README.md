# EduSense - AI-Powered Educational Platform

EduSense is a comprehensive educational platform designed to revolutionize doubt solving using advanced AI. It combines secure authentication, a robust RAG (Retrieval-Augmented Generation) pipeline, and multimodal input capabilities to provide instant, context-aware answers to student queries.

## 🚀 Key Features

### Phase 1: Authentication Foundation
*   **Secure Auth**: Email/Password and Google OAuth integration via Firebase.
*   **Session Management**: Persistent sessions with JWT (HttpOnly cookies) and Zustand state management.
*   **User Profiles**: MongoDB storage for user data with provider tracking.
*   **Security**: CORS protection, password hashing, and secure token verification.

### Phase 2: AI Doubt Solving (RAG)
*   **Smart Answers**: Powered by **Claude Sonnet 4.5** for high-quality educational responses.
*   **Context Awareness**: Uses **Qdrant** vector database to retrieve relevant textbook content.
*   **Real-time Updates**: **Socket.IO** integration for streaming answers and instant feedback.
*   **Doubt Management**: Save, bookmark, and rate answers.

### Phase 3: Multimodal Input (In Progress)
*   **Image Support**: Upload images of questions for OCR processing.
*   **PDF Integration**: Upload PDFs, view pages, and crop specific regions.
*   **Advanced OCR**: Extract text from images and documents for the RAG pipeline.
*   **Background Processing**: Worker queues for handling heavy media processing tasks.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 19 + Vite
*   **Styling**: Tailwind CSS + Framer Motion (Animations)
*   **State Management**: Zustand
*   **Routing**: React Router DOM
*   **Real-time**: Socket.IO Client
*   **Media**: React Konva (Cropping), PDF.js

### Backend
*   **Runtime**: Node.js + Express
*   **Database**: MongoDB (User/Doubt Data), Qdrant (Vector Embeddings)
*   **AI/ML**: Anthropic Claude SDK, LangChain (Concepts), Tesseract.js (OCR)
*   **Storage**: Cloudinary (Images/PDFs)
*   **Queues**: BullMQ + Redis (Background Jobs)

## 📁 Project Structure

```
EduSense/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # UI Components (Auth, AskBar, PDF Viewer)
│   │   ├── pages/           # Application Pages
│   │   ├── services/        # API & Socket Services
│   │   └── store/           # Zustand State Stores
│   └── ...
├── server/                  # Express Backend
│   ├── src/
│   │   ├── ai/              # AI Logic (RAG, Prompts, Embeddings)
│   │   ├── config/          # Configuration (DB, Firebase, Cloudinary)
│   │   ├── controllers/     # Request Handlers
│   │   ├── models/          # Mongoose Schemas (User, Doubt, Frame)
│   │   ├── routes/          # API Routes
│   │   ├── services/        # Business Logic (Auth, Media, OCR)
│   │   └── workers/         # Background Job Processors
│   └── ...
└── ...
```

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Docker (for Qdrant & Redis)
*   Firebase Project (Auth enabled)
*   Anthropic API Key

### 1. Environment Setup

Create `.env` files in `client` and `server` directories.

**Server (`server/.env`)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edusense
JWT_SECRET=your_secret
ANTHROPIC_API_KEY=sk-ant-...
QDRANT_URL=http://localhost:6333
CLOUDINARY_URL=cloudinary://...
REDIS_URL=redis://localhost:6379
```

**Client (`client/.env`)**
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=...
# ... other Firebase config
```

### 2. Start Infrastructure

```bash
# Start Qdrant (Vector DB)
docker run -p 6333:6333 qdrant/qdrant

# Start Redis (for Queues)
docker run -p 6379:6379 redis
```

### 3. Run Application

**Backend**
```bash
cd server
npm install
npm run dev
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

**Workers (Terminal 3)**
```bash
cd server
npm run worker:image
```

## 📚 Documentation

Detailed documentation for each phase is available:

*   [**Phase 1 Guide**](PHASE2_GUIDE.md): Authentication & Setup
*   [**Phase 2 Summary**](PHASE2_SUMMARY.md): RAG Pipeline & AI Integration
*   [**Phase 3 Implementation**](PHASE3_IMPLEMENTATION.md): Image & PDF Processing
*   [**API Reference**](DELIVERABLES.md): Endpoints & Deliverables

## 📄 License

This project is part of the EduSense educational platform.
