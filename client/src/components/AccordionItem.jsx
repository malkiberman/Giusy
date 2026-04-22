import { useState } from 'react';

export default function AccordionItem({ question, answer, index, styles }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles?.accordionItem}>
      <button className={`${styles?.accordionHeader} ${open ? styles?.accordionHeaderOpen : ''}`} onClick={() => setOpen((value) => !value)}>
        <span>
          <span className={styles?.qIndex}>Q{index}</span>
          {question}
        </span>
        <span className={styles?.chevron} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          ▾
        </span>
      </button>
      {open ? <div className={styles?.accordionBody}>{answer}</div> : null}
    </div>
  );
}
