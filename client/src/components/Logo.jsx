import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.logoWrapper}>
      <div className={styles.logoDots}>
        <div className={styles.dotsRow1}>
          <span className={styles.dot1}></span>
          <span className={styles.dot2}></span>
        </div>
        <div className={styles.dotsRow2}>
          <span className={styles.dot3}></span>
        </div>
        <div className={styles.dotsRow3}>
          <span className={styles.dot4}></span>
          <span className={styles.dot5}></span>
        </div>
      </div>
      <div className={styles.logo}>
        <span className={styles.logoMain}>ג&apos;וסי</span>
      </div>
    </div>
  );
}
