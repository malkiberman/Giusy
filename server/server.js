require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // הוספה
const connectDB = require('./src/config/db');
const candidateRoutes = require('./src/routes/candidate.routes');
const analysisRoutes = require('./src/routes/analysis.routes');

const app = express();

app.use(cors());
app.use(express.json());

// הגשת קבצים סטטיים מהתיקייה של ה-Client (בהנחה שזה המבנה שלך)
// אחרי ה-build של Vite, הקבצים נוצרים בתיקיית dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));

// התיקון הקריטי עבור ה-Dashboard והניתובים של React:
// כל מה שלא תפסנו עד עכשיו - יחזיר את ה-index.html של ה-React
app.use(express.static(path.join(__dirname, '../client/dist')));

// 2. התיקון לשגיאת ה-PathError:
// במקום app.get('/:path((.*))'), השתמשי בזה:
app.get('*', (req, res) => {
  // אנחנו בודקים אם הבקשה היא לא ל-API (ליתר ביטחון)
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
});

const PORT = process.env.PORT || 3000;

// 3. חשוב מאוד: ודאי שהפורט מוגדר נכון
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => { // הוספת '0.0.0.0' עוזרת ל-Render למצוא את הפורט
    console.log(`Server running on port ${PORT}`);
  });
});

