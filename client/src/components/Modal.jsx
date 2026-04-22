export default function Modal({ modal, onClose }) {
  if (!modal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          maxWidth: '650px',
          width: '90%',
          maxHeight: '85vh',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gradient with decorative element */}
        <div
          style={{
            padding: '2rem',
            background: `linear-gradient(135deg, ${modal.color || '#7c3aed'} 0%, ${modal.color || '#7c3aed'}dd 100%)`,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: '180px',
              height: '180px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              zIndex: 1,
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'rotate(90deg) scale(1.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
              }}
            >
              ✕
            </button>
            <div>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.3rem', animation: 'bounce 2s infinite' }}>
                {modal.icon || '📋'}
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                flex: 1,
                textAlign: 'right',
              }}
            >
              {modal.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '2.2rem',
            color: '#333',
            direction: 'rtl',
            textAlign: 'right',
            overflowY: 'auto',
            maxHeight: 'calc(85vh - 150px)',
            lineHeight: 1.8,
          }}
        >
          {/* סיכום AI */}
          {modal.content && (
            <div style={{ fontSize: '0.98rem', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {modal.content}
            </div>
          )}

          {/* חוזקות וחולשות */}
          {modal.strength && modal.weakness && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    color: '#16a34a',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                  }}
                >
                  ✓ חוזקות
                </h3>
                <ul style={{ margin: 0, paddingRight: '1.5rem', lineHeight: 2 }}>
                  {(modal.strength || []).map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: '#1f2937',
                        fontSize: '0.96rem',
                        marginBottom: '0.6rem',
                        paddingLeft: '0.8rem',
                        borderLeft: '3px solid #16a34a',
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '2rem',
                }}
              >
                <h3
                  style={{
                    color: '#dc2626',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                  }}
                >
                  ✕ חולשות
                </h3>
                <ul style={{ margin: 0, paddingRight: '1.5rem', lineHeight: 2 }}>
                  {(modal.weakness || []).map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: '#1f2937',
                        fontSize: '0.96rem',
                        marginBottom: '0.6rem',
                        paddingLeft: '0.8rem',
                        borderLeft: '3px solid #dc2626',
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* שאלות מומלצות */}
          {modal.questions && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.5rem 0 0 0',
            }}>
              <div style={{
                fontSize: '2.5rem',
                color: '#f59e0b',
                marginBottom: '0.5rem',
                animation: 'bounce 1.2s infinite',
                filter: 'drop-shadow(0 2px 8px #fbbf2433)'
              }}>💡</div>
              <h2 style={{
                color: '#d97706',
                fontWeight: 900,
                fontSize: '1.35rem',
                marginBottom: '1.2rem',
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px #fffbe7',
                borderBottom: '2px solid #fde68a',
                paddingBottom: '0.4rem',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center',
              }}>
                שאלות המשך מומלצות
              </h2>
              <ul style={{
                margin: 0,
                padding: 0,
                width: '100%',
                maxWidth: '420px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
              }}>
                {(modal.questions || []).map((q, idx) => (
                  <li
                    key={idx}
                    style={{
                      color: '#1f2937',
                      fontSize: '1.13rem',
                      padding: '1.05rem 1.2rem',
                      background: 'linear-gradient(90deg, #fffbe7 70%, #fef3c7 100%)',
                      border: '1.5px solid #fde68a',
                      borderRight: '7px solid #f59e0b',
                      borderRadius: '14px',
                      listStyle: 'none',
                      boxShadow: '0 2px 16px 0 #fbbf2422',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem',
                      fontWeight: 600,
                      letterSpacing: '0.2px',
                      transition: 'box-shadow 0.2s',
                      position: 'relative',
                    }}
                  >
                    <span style={{
                      fontSize: '1.45rem',
                      color: '#f59e0b',
                      marginLeft: '0.7rem',
                      filter: 'drop-shadow(0 1px 4px #fbbf2444)'
                    }}>★</span>
                    <span style={{ flex: 1 }}>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* שאלה ותשובה */}
          {modal.question && modal.answer && (
            <div>
              <div style={{ marginBottom: '1.8rem' }}>
                <h3
                  style={{
                    color: '#7c3aed',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.8rem',
                  }}
                >
                  ❓ השאלה:
                </h3>
                <div
                  style={{
                    background: '#f3f0ff',
                    border: '1px solid #e9d5ff',
                    borderRight: '4px solid #7c3aed',
                    padding: '1rem 1.2rem',
                    borderRadius: '8px',
                    color: '#1f2937',
                    fontSize: '0.98rem',
                  }}
                >
                  {modal.question}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: '#16a34a',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.8rem',
                  }}
                >
                  💬 התשובה:
                </h3>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #dcfce7',
                    borderRight: '4px solid #16a34a',
                    padding: '1rem 1.2rem',
                    borderRadius: '8px',
                    color: '#1f2937',
                    fontSize: '0.96rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {modal.answer}
                </div>
              </div>
            </div>
          )}

          {/* שאלות ותשובות מהראיון - צ'אט */}
          {modal.chatMode && (
            <div>
              {(() => {
                // Always try to show Q&A, even if answers are missing
                const answers =
                  (modal.conversation && Array.isArray(modal.conversation.answers) && modal.conversation.answers.length > 0)
                    ? modal.conversation.answers
                    : (modal.conversation && Array.isArray(modal.conversation.questions))
                      ? modal.conversation.questions.map((q, idx) => ({ question: q, answer: 'אין תשובה' }))
                      : [];
                if (answers.length === 0) {
                  return (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#666',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                    }}>
                      <p>🔍 לא נמצאו שאלות ותשובות</p>
                      <small>אנא ודא שהראיון שלם ונשמר כראוי</small>
                    </div>
                  );
                }
                return (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '0.5rem 0',
                  }}>
                    {answers.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {/* שאלה - משמאל */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                        }}>
                          <div style={{
                            maxWidth: '75%',
                            background: '#e0e7ff',
                            borderRadius: '16px',
                            padding: '0.9rem 1.2rem',
                            borderBottomLeft: '2px solid transparent',
                            color: '#1f2937',
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          }}>
                            <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                              ❓ שאלה {idx + 1}
                            </div>
                            {typeof item === 'object' && item.question ? item.question : item}
                          </div>
                        </div>

                        {/* תשובה - מימין */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}>
                          <div style={{
                            maxWidth: '75%',
                            background: '#d1fae5',
                            borderRadius: '16px',
                            padding: '0.9rem 1.2rem',
                            borderBottomRight: '2px solid transparent',
                            color: '#1f2937',
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          }}>
                            <div style={{ fontWeight: 600, color: '#059669', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                              💬 תשובה
                            </div>
                            {typeof item === 'object' && item.answer ? item.answer : 'אין תשובה'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>



        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(25px); }
          }
        `}</style>
      </div>
    </div>
  );
}
