# 🛡️Abhedya

[![FastAPI](https://img.shields.io/badge/FastAPI-05998b?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

A comprehensive, AI-powered cybersecurity assistant designed to simplify threat analysis, provide real-time updates, and streamline incident reporting for non-technical users.

---

## 📑 Table of Contents
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)

---

## 🚀 Features

*   **Safety Feed:** Aggregates real-time cybersecurity news with AI-powered, layman-friendly summaries.
*   **Check-it Analyzer:** A robust engine that scans links/text for threats and provides step-by-step remediation guidance.
*   **Cyber Quest (Gamified):** Learn complex security concepts through simplified, step-by-step interactive lessons.
*   **FirstAid-PDF Generator:** Converts complex security incidents into formal, professional, and downloadable PDF reports for IT submission.
*   **Community Shield:** A real-time, peer-to-peer reporting platform to alert the community about active scams.

---

## 🏗 Architecture

The application follows a decoupled full-stack architecture:

- **Frontend:** Provides the UI for incident reporting, threat analysis, and community feed.
- **Backend (FastAPI):** Acts as the brain, handling AI inference (OpenAI), data validation, and PDF generation.
- **Service Layer:** Connects to external APIs (VirusTotal, RSS Feeds) and manages persistent storage.

---

## 🛠 Tech Stack

*   **Framework:** FastAPI (Python)
*   **AI/LLM:** OpenAI GPT-4o / LangChain
*   **Database:** PostgreSQL / MongoDB
*   **PDF Generation:** WeasyPrint / ReportLab

---

## 🚀 Getting Started

### Prerequisites
* Python 3.10+
* Redis (for background task queuing)

### 📝 API Documentation
* FastAPI provides interactive API documentation automatically. Once the server is running, visit:
* Swagger UI: http://localhost:8000/docs
* ReDoc: http://localhost:8000/redoc

### 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Feel free to fork this repository and submit a Pull Request!
If you found this project useful, please consider giving it a ⭐!
Built with ❤️ for a safer digital world.