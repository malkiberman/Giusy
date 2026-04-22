require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // ודאי שהקובץ קיים בנתיב הזה בתוך תיקיית server
const candidateRoutes = require('./src/routes/candidate.routes');
const analysisRoutes = require('./src/routes/analysis.routes');

const app = express();

// Middleware
app.use(cors()); // חשוב: מאפשר לקליינט הנפרד שלך לתקשר עם השרת
app.use(express.json());

// API Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/analysis', analysisRoutes);

// Health Check עבור Render
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;

// חיבור למסד הנתונים והפעלת השרת
connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ API Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });