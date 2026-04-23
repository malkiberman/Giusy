import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import styles from './Dashboard.module.css';
import StatCard from '../components/ui/StatCard';
import ScoreBar from '../components/ui/ScoreBar';
import RTLLayout from '../components/layout/RTLLayout';
import useCandidates from '../hooks/useCandidates';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../config/constants';

export default function Dashboard() {
  const navigate = useNavigate();
  const { candidates, loading, error, scoreRange, setScoreRange, roleFilter, setRoleFilter, filtered, stats } = useCandidates();

  return (
    <RTLLayout className={styles.page}>
      <AppHeader />
      
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>לוח מועמדים</h1>
          <p className={styles.subtitle}>תוצאות סינון מוקדם ודירוג עדיפויות</p>
        </div>
      </div>

      <div className={styles.cards}>
        <StatCard label="סה״כ מועמדים" value={stats.total} accent="#1e285a" className={styles.statCard} valueClassName={styles.statValue} labelClassName={styles.statLabel} />
        <StatCard label="מעל 80%" value={stats.above80} accent="#16a34a" className={styles.statCard} valueClassName={styles.statValue} labelClassName={styles.statLabel} />
        <StatCard label="50 - 80%" value={stats.mid} accent="#ff375c" className={styles.statCard} valueClassName={styles.statValue} labelClassName={styles.statLabel} />
        <StatCard label="מתחת ל-50%" value={stats.below50} accent="#dc2626" className={styles.statCard} valueClassName={styles.statValue} labelClassName={styles.statLabel} />
      </div>

      <div style={{ padding: '1.5rem 0', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', maxWidth: '600px' }}>
          <label style={{ fontWeight: 700, color: '#374151', minWidth: '100px' }}>טווח התאמה:</label>
          <RangeSlider min={0} max={100} value={scoreRange} onChange={setScoreRange} />
          <div style={{ display: 'flex', gap: '0.3rem', minWidth: '80px', fontSize: '0.95rem', fontWeight: 700, color: '#1f2937' }}>
            <span>{scoreRange[0]}</span>
            <span>-</span>
            <span>{scoreRange[1]}</span>
            <span>%</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <FilterBtn active={roleFilter === 'all'} onClick={() => setRoleFilter('all')}>
          כל התפקידים
        </FilterBtn>
        <FilterBtn active={roleFilter === '1'} onClick={() => setRoleFilter('1')}>
          מכירות
        </FilterBtn>
        <FilterBtn active={roleFilter === '2'} onClick={() => setRoleFilter('2')}>
          שירות
        </FilterBtn>
      </div>

      <div className={styles.tableWrap} dir="rtl">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>שם מלא</th>
              <th>טלפון</th>
              <th>אימייל</th>
              <th>תפקיד מומלץ</th>
              <th>ציון</th>
              <th>עדיפות</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>טוען נתונים...</td>
              </tr>
            ) : null}
            {!loading && error ? (
              <tr>
                <td colSpan={6}>{error}</td>
              </tr>
            ) : null}
            {!loading && !error && filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>אין מועמדים להצגה.</td>
              </tr>
            ) : null}
            {!loading && !error
              ? filtered.map((candidate) => (
                  <tr key={candidate.id} className={styles.row} onClick={() => navigate(`/candidate/${candidate.id}`)}>
                    <td className={styles.name}>{candidate.fullName}</td>
                    <td>{candidate.phone || '-'}</td>
                    <td>{candidate.email || '-'}</td>
                    <td>{candidate.recommendedRoleLabel}</td>
                    <td>
                      <ScoreBar score={candidate.score} />
                    </td>
                    <td>
                      <span className={styles.badge} style={PRIORITY_COLORS[candidate.priority] || PRIORITY_COLORS.low}>
                        {PRIORITY_LABELS[candidate.priority] || candidate.priority}
                      </span>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </RTLLayout>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ''}`}>
      {children}
    </button>
  );
}

function RangeSlider({ min, max, value, onChange }) {
  const handleChange = (index, newVal) => {
    const newValue = [...value];
    newValue[index] = newVal;
    
    if (index === 0 && newVal <= newValue[1]) {
      onChange(newValue);
    } else if (index === 1 && newVal >= newValue[0]) {
      onChange(newValue);
    }
  };

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div style={{ flex: 1, minWidth: '280px' }}>
      <div style={{ position: 'relative', height: '8px', background: 'linear-gradient(90deg, #dc2626 0%, #ff375c 35%, #059669 100%)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(30,40,90,0.1)' }}>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.25)',
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
            pointerEvents: 'none',
            borderRadius: '4px',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            background: 'transparent',
            cursor: 'pointer',
            zIndex: value[0] > max - (max - min) / 2 ? 5 : 3,
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            background: 'transparent',
            cursor: 'pointer',
            zIndex: value[1] <= max - (max - min) / 2 ? 5 : 4,
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        />
      </div>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #1e285a;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(30, 40, 90, 0.4);
          border: 3px solid #fff;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #1e285a;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(30, 40, 90, 0.4);
          border: 3px solid #fff;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #ff375c;
          box-shadow: 0 3px 8px rgba(255, 55, 92, 0.4);
        }
        input[type="range"]::-moz-range-thumb:hover {
          background: #ff375c;
          box-shadow: 0 3px 8px rgba(255, 55, 92, 0.4);
        }
      `}</style>
    </div>
  );
}

