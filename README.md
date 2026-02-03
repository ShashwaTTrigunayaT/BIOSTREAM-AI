# ⚡ BIOSTREAM AI
### **Neural Telemetry. Digital Twin. Real-Time Diagnostics.**

![Status](https://img.shields.io/badge/Status-Live_Simulation-cyan?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/AI-Groq_Llama_3-purple?style=for-the-badge)
![UI](https://img.shields.io/badge/Design-Brutalist_Cyber-white?style=for-the-badge)

**BIOSTREAM AI** is a professional-grade medical telemetry dashboard designed for high-stress environments. It merges real-time biometric data streaming with generative 3D visualization and LLM-powered clinical analysis to create a futuristic window into patient physiology.

---

## 🛠 Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Three.js](https://img.shields.io/badge/three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Cloud-f55036?style=for-the-badge&logo=google-cloud&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%231D63ED.svg?style=for-the-badge&logo=docker&logoColor=white)
---

## ✨ Key Features

- [x] **Real-Time ECG Engine:** High-performance SVG graphing (`Recharts`) with medical grid overlays and dynamic "status glow".
- [x] **3D Digital Twin:** A generative 3D heart mesh (React Three Fiber) that physically pulses in synchronization with live BPM data.
- [x] **Neural Voice Interface:** The Digital Twin "speaks" clinical status updates using AI-synthesized context.
- [x] **AI Clinical Diagnostics:** Integrated **Groq (Llama 3.1)** to provide sub-second analysis of vitals (e.g., detecting "Sinus Tachycardia").
- [x] **Acoustic Telemetry:** Custom Web Audio API engine that modulates pitch and frequency based on heart rate.
- [x] **Simulation "God Mode":** Developer overrides to trigger `Critical`, `Warning`, and `Flatline` states instantly.
- [x] **Automated Reporting:** Generates downloadable, formal medical text reports via **Llama-3.3-70b**.

---

## 🏗 System Architecture (Deep Dive)

<details>
<summary><b>🔌 Real-Time Data Stream</b></summary>
<br>

Standard polling kills performance in medical graphing.
* **The Solution:** Implemented a **Socket.io Stream** that pushes data packets containing `hr`, `spo2`, and `ecg_value` every few milliseconds.
* **Buffering:** The frontend uses a circular buffer to render the graph smoothly without React-render thrashing.
</details>

<details>
<summary><b>🧠 Latency-Sensitive AI</b></summary>
<br>

Medical advice needs to be instant. The system uses a dual-model approach via Groq's LPU:
1. **Live View:** Uses `llama-3.1-8b-instant` for ultra-fast, 1-sentence context updates.
2. **Reporting:** Uses `llama-3.3-70b-versatile` only when deep analysis is requested, optimizing for both speed and depth.
</details>

<details>
<summary><b>📂 Project Structure</b></summary>
<br>

```bash
├── client/                # React Vite Application
│   ├── src/components/    # Heart3D, ECGGraph, VitalsCard
│   └── src/pages/         # Dashboard (Main Hub)
└── server/                # Node.js Backend
    ├── controllers/       # aiController.js (Groq Logic)
    ├── services/          # streamService.js (CSV Processing)
    ├── models/            # VitalLog.js (MongoDB Schemas)
    └── generate_ecg.js    # Data Simulation Script

