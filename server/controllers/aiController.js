const Groq = require("groq-sdk");
require('dotenv').config();

// Initialize Groq instead of Google
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY }) 
  : null;

// 1. FAST ANALYSIS (For the Live Dashboard)
const analyzeVitals = async (req, res) => {
  const { hr, spo2 } = req.body;
  if (!groq) return res.json({ context: "AI Analysis Disabled (Missing Key)." });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a robotic medical AI. Provide a 1-sentence assessment."
        },
        {
          role: "user",
          content: `Vitals: HR ${hr}, SpO2 ${spo2}. Assessment?`
        }
      ],
      model: "llama-3.1-8b-instant", // Very fast model for live dashboard
    });

    res.json({ context: chatCompletion.choices[0]?.message?.content || "Data stable." });
    
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ context: "AI System Cooling Down..." });
  }
};

// 2. FULL REPORT GENERATION (For the Download Button)
const generateReport = async (req, res) => {
  const { hr, spo2 } = req.body;
  
  if (!groq) {
    return res.json({ report: "AI Configuration Missing. Unable to generate report." });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a Senior Cardiologist. Generate formal reports without markdown."
        },
        {
          role: "user",
          content: `
            Generate a formal medical status report for:
            - Heart Rate: ${hr} BPM
            - SpO2: ${spo2} %
            
            Include:
            1. CLINICAL SUMMARY
            2. RISK ASSESSMENT (Low/Moderate/Critical)
            3. RECOMMENDED INTERVENTION
            4. OBSERVATION NOTES
          `
        }
      ],
      model: "llama-3.3-70b-versatile", // Smarter model for detailed reports
    });

    res.json({ report: chatCompletion.choices[0]?.message?.content });

  } catch (error) {
    console.error("Report Error:", error.message);
    res.status(500).json({ report: "Error generating report." });
  }
};

module.exports = { analyzeVitals, generateReport };