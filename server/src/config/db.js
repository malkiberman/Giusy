// server.js - גרסה נקייה לשרת נפרד
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const candidateRoutes = require('./src/routes/candidate.routes');
const analysisRoutes = require('./src/routes/analysis.routes');

const app = express();
app.use(cors()); // מאפשר לכל מקור לגשת (או הגדירי ספציפית את הפרונט)
app.use(express.json());

app.use('/api/candidates', candidateRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Server running on port ${PORT}`);
  });
});