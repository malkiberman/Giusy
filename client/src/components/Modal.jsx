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
        background: 'rgba(30, 40, 90, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          maxWidth: '620px',
          width: '90%',
          maxHeight: '85vh',
          boxShadow: '0 24px 64px rgba(30, 40, 90, 0.25)',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.75rem',
            background: `linear-gradient(135deg, ${modal.color || '#1e285a'} 0%, ${modal.color || '#1e285a'}dd 100%)`,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: '140px',
              height: '140px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%',
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
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              X
            </button>
            <div>
              <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.2rem' }}>
                {modal.icon || ''}
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
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
            padding: '2rem',
            color: '#1a1a2e',
            direction: 'rtl',
            textAlign: 'right',
            overflowY: 'auto',
            maxHeight: 'calc(85vh - 140px)',
            lineHeight: 1.7,
          }}
        >
          {/* AI Summary */}
          {modal.content && (
            <div style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#5a6178' }}>
              {modal.content}
            </div>
          )}

          {/* Strengths and Weaknesses */}
          {modal.strength && modal.weakness && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <h3
                  style={{
                    color: '#059669',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.875rem',
                  }}
                >
                  + חוזקות
                </h3>
                <ul style={{ margin: 0, paddingRight: '1.25rem', lineHeight: 1.9 }}>
                  {(modal.strength || []).map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: '#1a1a2e',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                        paddingLeft: '0.75rem',
                        borderLeft: '3px solid #059669',
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  borderTop: '1px solid #e2e6ef',
                  paddingTop: '1.75rem',
                }}
              >
                <h3
                  style={{
                    color: '#dc2626',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.875rem',
                  }}
                >
                  - חולשות
                </h3>
                <ul style={{ margin: 0, paddingRight: '1.25rem', lineHeight: 1.9 }}>
                  {(modal.weakness || []).map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: '#1a1a2e',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                        paddingLeft: '0.75rem',
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

          {/* Recommended Questions */}
          {modal.questions && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1rem 0 0 0',
            }}>
              <h2 style={{
                color: '#ff375c',
                fontWeight: 700,
                fontSize: '1.2rem',
                marginBottom: '1rem',
                letterSpacing: '0.02em',
                borderBottom: '2px solid #fff0f3',
                paddingBottom: '0.4rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
              }}>
                שאלות המשך מומלצות
              </h2>
              <ul style={{
                margin: 0,
                padding: 0,
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}>
                {(modal.questions || []).map((q, idx) => (
                  <li
                    key={idx}
                    style={{
                      color: '#1a1a2e',
                      fontSize: '1rem',
                      padding: '0.95rem 1.1rem',
                      background: '#fff0f3',
                      border: '1px solid rgba(255, 55, 92, 0.15)',
                      borderRight: '4px solid #ff375c',
                      borderRadius: '10px',
                      listStyle: 'none',
                      boxShadow: '0 2px 8px rgba(255, 55, 92, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{
                      fontSize: '1.1rem',
                      color: '#ff375c',
                      marginLeft: '0.5rem',
                    }}>?</span>
                    <span style={{ flex: 1 }}>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Single Q&A */}
          {modal.question && modal.answer && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3
                  style={{
                    color: '#1e285a',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '0.7rem',
                  }}
                >
                  השאלה:
                </h3>
                <div
                  style={{
                    background: '#f8f9fc',
                    border: '1px solid #e2e6ef',
                    borderRight: '3px solid #1e285a',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    color: '#1a1a2e',
                    fontSize: '0.9rem',
                  }}
                >
                  {modal.question}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: '#059669',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '0.7rem',
                  }}
                >
                  התשובה:
                </h3>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #d1fae5',
                    borderRight: '3px solid #059669',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    color: '#1a1a2e',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {modal.answer}
                </div>
              </div>
            </div>
          )}

          {/* Chat Mode - Q&A from interview */}
          {modal.chatMode && (
            <div>
              {(() => {
                const answers =
                  (modal.conversation && Array.isArray(modal.conversation.answers) && modal.conversation.answers.length > 0)
                    ? modal.conversation.answers
                    : (modal.conversation && Array.isArray(modal.conversation.questions))
                      ? modal.conversation.questions.map((q, idx) => ({ question: q, answer: 'אין תשובה' }))
                      : [];
                if (answers.length === 0) {
                  return (
                    <div style={{
                      padding: '1.5rem',
                      textAlign: 'center',
                      color: '#5a6178',
                      background: '#f8f9fc',
                      borderRadius: '8px',
                    }}>
                      <p>לא נמצאו שאלות ותשובות</p>
                      <small>אנא ודא שהראיון שלם ונשמר כראוי</small>
                    </div>
                  );
                }
                return (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.875rem',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    padding: '0.4rem 0',
                  }}>
                    {answers.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        {/* Question bubble */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                        }}>
                          <div style={{
                            maxWidth: '80%',
                            background: '#f1f4f9',
                            borderRadius: '14px',
                            padding: '0.8rem 1rem',
                            color: '#1a1a2e',
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            border: '1px solid #e2e6ef',
                          }}>
                            <div style={{ fontWeight: 600, color: '#1e285a', marginBottom: '0.25rem', fontSize: '0.8rem' }}>
                              שאלה {idx + 1}
                            </div>
                            {typeof item === 'object' && item.question ? item.question : item}
                          </div>
                        </div>

                        {/* Answer bubble */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}>
                          <div style={{
                            maxWidth: '80%',
                            background: 'linear-gradient(135deg, #ff375c, #ff5a7a)',
                            borderRadius: '14px',
                            padding: '0.8rem 1rem',
                            color: '#fff',
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            boxShadow: '0 2px 8px rgba(255, 55, 92, 0.2)',
                          }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.8rem', opacity: 0.9 }}>
                              תשובה
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
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
