import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.logoWrapper}>
      <img 
        src="/logo-direct.svg" 
        alt="ביטוח ישיר - Direct Insurance" 
        className={styles.logoImage}
      />
    </div>
  );
}
