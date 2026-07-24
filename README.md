# MemoryVerse AI - Student Digital Career Identity Platform (v2)

MemoryVerse AI is a production-ready Student Digital Identity System designed to parse, verify, link, and conversationally retrieve student academic records, projects, certifications, and internship letters using optical character recognition (OCR), Named Entity Recognition (NER), and Retrieval-Augmented Generation (RAG).

## 🌟 Platform Capabilities

- **Multi-Stage Ingestion Pipeline**: Vectorizes document assets, extracts OCR text, classifies entities (CGPA, Skills, Projects, Companies), and links them dynamically.
- **Interactive Knowledge Graph**: Visualizes high-dimensional connections between skills, project nodes, and internship details with gravity physics.
- **RAG Career Assistant**: Conversational ChatGPT-like search interface helping candidates review resumes, audit ATS scores, and practice interviews.
- **Placement Forecast Engine**: Computes weighted shortlisting cutoffs (CGPA cutoff checks, skill densities, research bonuses).
- **Administrative Core**: Dashboard tracking API consumption, storage bytes, system latency logs, and OCR transactions.

---

## 🛠️ Technical Architecture

```
[Document Upload] ➔ [SHA256 Hash Auditing] ➔ [Tesseract/Gemini OCR]
                                                    │
                                                    ▼
[RAG Chatbot / Assist] ◀── [RAG Vector Index] ◀── [NER Classification]
                                                    │
                                                    ▼
                                           [Knowledge Graph nodes]
```

### Stack Components
- **Frontend Core**: React 19 (TypeScript), Tailwind CSS, Lucide icons.
- **Data Visualization**: Recharts, SVG Physics gravity engines.
- **Database & Storage**: Dual-Mode Supabase PostgreSQL client (with localStorage sandbox fallbacks).
- **AI RAG & OCR**: Google Gemini API integration models.
- **Containment**: Docker multi-stage configuration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Docker (optional)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 🐳 Docker Container Deployments

Build and run containerized platform locally using exposed port 80:
```bash
# Build production Nginx image
docker build -t memoryverse-ai:latest .

# Launch server
docker run -d -p 8080:80 memoryverse-ai:latest
```
Open `http://localhost:8080` in your browser.

---

## 📄 License & Contributions

Distributed under the MIT License. See `LICENSE` for details. Contributions matching engineering taxonomy guidelines are welcome!
