import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import styles from './LandingPage.module.css';
import RTLLayout from '../components/layout/RTLLayout';
import { CURRENT_CANDIDATE_KEY as LS_KEY } from '../config/storageKeys';

// *** הוספתי את השורה הזו - ודאי שהנתיב נכון אצלך! ***
import { createCandidate } from '../services/api'; 

export default function LandingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'שם הוא שדה חובה';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'נדרשת כתובת אימייל תקינה';
    if (!form.phone.trim()) e.phone = 'טלפון הוא שדה חובה';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("🚀 הכפתור נלחץ!"); // חייב להופיע ב-F12

    const errs = validate();
    if (Object.keys(errs).length) { 
      console.log("❌ טעויות בטופס:", errs);
      setErrors(errs); 
      return; 
    }

    setIsLoading(true);
    try {
      console.log("📡 שולח נתונים לשרת...", form);
      
      const newCandidate = await createCandidate(form);
      
      console.log("✅ מועמד נוצר בהצלחה:", newCandidate);
      
      localStorage.setItem(LS_KEY, JSON.stringify(newCandidate));
      console.log("🏃 עובר לעמוד הראיון...");
      navigate('/interview');
    } catch (error) {
      console.error("🔥 שגיאה קריטית ב-Submit:", error);
      setErrors({ general: 'משהו השתבש בתקשורת עם השרת.' });
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <RTLLayout>
      <div className={styles.container}>
        <AppHeader title="Giusy AI" subtitle="התחלת תהליך מיון חכם" />
        
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {errors.general && <div style={{color: 'red', marginBottom: '10px'}}>{errors.general}</div>}
            
            <Field
              label="שם מלא"
              value={form.fullName}
              onChange={handleChange('fullName')}
              error={errors.fullName}
              placeholder="ישראל ישראלי"
            />
            <Field
              label="אימייל"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Field
              label="טלפון"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
              placeholder="+972-50-000-0000"
            />
            <button 
              type="submit" 
              className={styles.submit}
              disabled={isLoading}
            >
              {isLoading ? 'טוען...' : 'התחל ראיון ←'}
            </button>
          </form>
        </div>
      </div>
    </RTLLayout>
  );
}

// פונקציית העזר Field חייבת להישאר בסוף הקובץ כפי שהייתה
function Field({ label, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={error ? styles.inputError : styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}