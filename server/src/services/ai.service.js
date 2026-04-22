require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const candidateRoutes = require('./src/routes/candidate.routes');
const analysisRoutes = require('./src/routes/analysis.routes');

const app = express();

// Middleware
app.use(cors()); // מאפשר לקליינט הנפרד שלך לגשת ל-API
app.use(express.json());

// API Routes בלבד
app.use('/api/candidates', candidateRoutes);
app.use('/api/analysis', analysisRoutes);

// Health Check ל-Render
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;

// הפעלה
connectDB().then(() => {
  // שימי לב ל-0.0.0.0, זה עוזר ל-Render למצוא את הפורט
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("❌ Database connection failed:", err);
});