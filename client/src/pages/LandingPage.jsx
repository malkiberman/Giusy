import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import styles from './LandingPage.module.css';
import RTLLayout from '../components/layout/RTLLayout';
import { CURRENT_CANDIDATE_KEY as LS_KEY } from '../config/storageKeys';
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
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setIsLoading(true);
    try {
      const newCandidate = await createCandidate(form);
      localStorage.setItem(LS_KEY, JSON.stringify(newCandidate));
      navigate('/interview');
    } catch (error) {
      setErrors({ general: 'שגיאה ברישום המועמד.' });
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
      <div className={styles.page}>

        <div className={styles.topRight}>
          <img src="/logo.png" className={styles.logo} alt="logo" />
        </div>

        <div className={styles.container}>
          <div className={styles.card}>

            <AppHeader
              title="Giusy AI"
              subtitle="התחלת תהליך מיון חכם"
            />

            <form onSubmit={handleSubmit} className={styles.form}>
              {errors.general && (
                <div style={{ color: 'red' }}>{errors.general}</div>
              )}

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

              <button className={styles.submit} disabled={isLoading}>
                {isLoading ? 'טוען...' : 'התחל ראיון ←'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </RTLLayout>
  );
}

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