require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const candidateRoutes = require('./src/routes/candidate.routes');
const analysisRoutes = require('./src/routes/analysis.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/analysis', analysisRoutes);

// Health Check - חשוב מאוד ל-Render כדי לדעת שהשרת חי
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;

// הפעלה רק אחרי חיבור לדאטה-בייס
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});