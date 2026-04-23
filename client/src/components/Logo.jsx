import styles from './Logo.module.css';

export default function Logo({ size = 'default' }) {
  return (
    <div className={`${styles.logoWrapper} ${styles[size]}`}>
      <div className={styles.logoText}>
        <span className={styles.logoMain}>ביטוח</span>
        <span className={styles.logoAccent}>ישיר</span>
      </div>
      <div className={styles.logoDots}>
        <div className={styles.dotsGrid}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dotCenter}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </div>
    </div>
  );
}
