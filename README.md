# ⚡ BIOSTREAM AI | HARDWARE INTERFACE
### **Neural Telemetry. Direct Hardware Link. Real-Time Biometrics.**

![Status](https://img.shields.io/badge/Status-HARDWARE_LINK_ACTIVE-cyan?style=for-the-badge&logo=react)
![Interface](https://img.shields.io/badge/IO-Serial_UART/ESP32-green?style=for-the-badge)
![AI](https://img.shields.io/badge/Neural_Engine-Groq_LPU-purple?style=for-the-badge)

**BIOSTREAM AI** is a high-bandwidth medical telemetry terminal designed for live physiological monitoring. This system interfaces directly with **biometric sensor arrays** via high-speed Serial/Socket pipelines, translating raw electrical signals into a synchronized 3D Digital Twin and LLM-analyzed clinical data.

---

## 📡 THE HARDWARE STACK
The interface is engineered to ingest raw data from a custom-built sensor array (ESP32/AD8232/MAX30105):

* **ECG Capture:** AD8232 Heart Rate Monitor with leads-off detection logic.
* **Pulse Oximetry:** MAX30102 sensor for SpO2 and Infrared pulse detection.
* **Signal Processing:** Hardware-level Kalman filtering to strip EMI/Powerline noise before data ingestion.
* **Transmission:** Dual-mode data relay via **WebSockets (Low-Latency)** and **Serial-to-Node.js Bridge**.

---

## 🛠 TECH STACK

* **Frontend:** React 18, Tailwind CSS (Brutalist UI), Lucide Icons.
* **Visualization:** React Three Fiber (R3F) & Three.js for the heart-beat synced mesh.
* **Real-Time:** Socket.io v4 for 500Hz data streaming.
* **Neural Engine:** Groq LPU (Llama 3.1) for sub-second clinical inference.
* **Firmware:** C++ (Arduino/ESP-IDF) for sensor polling and data serialization.
* **Infrastructure:** Node.js, MongoDB, Docker.

---

## ✨ KEY FEATURES

- [x] **Direct Lead Capture:** Live ECG capture at **500Hz** via serial buffer, rendered using high-performance SVG path interpolation.
- [x] **Physical-Digital Sync:** A 3D Digital Twin that triggers heart-wall contraction based on the **R-peak detection** of the physical hardware.
- [x] **Neural Diagnostic Overlays:** Integrated **Groq (Llama 3.1)** to provide sub-second analysis of raw voltages (detecting Tachycardia, Arrhythmias, etc.).
- [x] **Acoustic Telemetry:** Web Audio API "Pinger" that modulates pitch based on oxygen saturation (SpO2) levels received from the MAX30102.
- [x] **Leads-Off Detection:** Visual and audio alerts if hardware loses skin contact or a lead is disconnected.
- [x] **Automated Reporting:** Generates formal, downloadable medical PDF reports via **Llama-3.3-70b** based on historical session data.

---

## 🏗 SYSTEM ARCHITECTURE

### 🔌 The Physical Link (UART-to-Web)
Standard polling kills performance. The system uses a **Node.js Serial Bridge** to open a high-speed pipe to the microcontroller.
* **Packet Structure:** `{ "ecg": 412, "bpm": 72, "spo2": 98, "status": "CONNECTED" }`
* **Buffering:** Implements a circular buffer on the frontend to ensure the graph renders at a locked 60FPS without React-render thrashing.

### 🧠 Hardware-AI Correlation
The AI analyzes specific sensor voltages in real-time:
1.  **Signal Validation:** AI detects if 60Hz hum (power line interference) is corrupting the ECG and suggests shielding improvements.
2.  **Clinical Interpretation:** Llama-3.1-8b processes the last 10 seconds of the hardware buffer to provide instant diagnostic labels.

---

### 1. Clone the Repository
```bash
git clone [https://github.com/ShashwaTTrigunayaT/bio-stream.git](https://github.com/ShashwaTTrigunayaT/bio-stream.git)
cd bio-stream
