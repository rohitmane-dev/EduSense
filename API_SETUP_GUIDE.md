# 🔑 API Setup & Configuration Guide

This guide will help you obtain all the necessary API keys and set up the infrastructure required to run the EduSense backend.

## 1. Google Gemini API (AI Model)
Used for generating answers (LLM) and creating text embeddings.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click **"Create API key"**.
3.  Select an existing Google Cloud project or create a new one.
4.  Copy the API key.
5.  Add to `.env`: `GEMINI_API_KEY=your_copied_key`

## 2. Firebase Admin SDK (Authentication)
Used to verify frontend tokens and manage users.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  Go to **Project settings** (gear icon) > **Service accounts**.
4.  Click **"Generate new private key"**.
5.  A JSON file will download. Open it.
6.  Copy values to `.env`:
    *   `FIREBASE_PROJECT_ID`: Copy `project_id`
    *   `FIREBASE_CLIENT_EMAIL`: Copy `client_email`
    *   `FIREBASE_PRIVATE_KEY`: Copy `private_key` (Keep the `\n` characters and wrap in quotes!)

## 3. Cloudinary (File Storage)
Used to store uploaded images and PDFs.

1.  Sign up at [Cloudinary](https://cloudinary.com/).
2.  Go to the **Dashboard**.
3.  Copy the "Product Environment Credentials":
    *   `CLOUDINARY_CLOUD_NAME`: Cloud Name
    *   `CLOUDINARY_API_KEY`: API Key
    *   `CLOUDINARY_API_SECRET`: API Secret

## 4. Neo4j (Graph Database)
Used to track concept relationships and user knowledge graphs.

### Option A: Neo4j Desktop (Local)
1.  Download and install [Neo4j Desktop](https://neo4j.com/download/).
2.  Create a new project and database.
3.  Set a password (default user is `neo4j`).
4.  Start the database.
5.  Update `.env`: `NEO4J_PASSWORD=your_password`

### Option B: Docker (Recommended)
Run this command:
```bash
docker run -d --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password123 \
  neo4j:latest
```
Update `.env`: `NEO4J_PASSWORD=password123`

## 5. Qdrant (Vector Database)
Used to store embeddings for RAG search.

### Docker (Recommended)
Run this command:
```bash
docker run -d --name qdrant \
  -p 6333:6333 \
  qdrant/qdrant
```
URL in `.env`: `QDRANT_URL=http://localhost:6333`

## 6. Redis (Background Queues)
Used by BullMQ for processing documents in the background.

### Docker (Recommended)
Run this command:
```bash
docker run -d --name redis \
  -p 6379:6379 \
  redis:alpine
```
URL in `.env`: `REDIS_URL=redis://localhost:6379`

## 7. MongoDB (Main Database)
Used to store user profiles, doubts, and document metadata.

### Local Installation
Ensure MongoDB Community Server is installed and running.
URL in `.env`: `MONGODB_URI=mongodb://localhost:27017/edusense`

### MongoDB Atlas (Cloud)
1.  Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2.  Click **Connect** > **Drivers**.
3.  Copy the connection string.
4.  Replace `<password>` with your database user password.

---

## 🚀 Final Step
Rename `server/.env.example` to `server/.env` and fill in all the values!
