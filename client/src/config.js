// frontend/src/config.js
const config = {
  // The backend URL. Change this here, and it updates everywhere.
  API_URL: "http://localhost:5000",
  
  // Connection thresholds (You can tweak these easily now)
  THRESHOLDS: {
    HR_MAX: 120,
    SPO2_MIN: 90
  },
  
  // Refresh rates
  AI_REFRESH_RATE_MS: 15000
};

export default config;