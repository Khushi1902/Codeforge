import React, { useState } from 'react';
import toast from 'react-hot-toast';

const OutputPanel = ({ result }) => {
  const [activeTab, setActiveTab] = useState('fixed');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const tabs = [
    { id: 'fixed', label: '🔧 Fixed Code' },
    { id: 'explanation', label: '💡 Explanation' },
    { id: 'techstack', label: '⚙️ Tech Stack' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>AI Output</span>
        <div style={styles.tabRow}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? styles.tabActive : styles.tab}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.body}>
        {activeTab === 'fixed' && (
          <div style={styles.codeBlock}>
            <div style={styles.codeHeader}>
              <span style={styles.codeLabel}>Fixed / Optimized Code</span>
              <button onClick={() => copyToClipboard(result.fixedCode)} style={styles.copyBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <pre style={styles.pre}><code>{result.fixedCode}</code></pre>
          </div>
        )}

        {activeTab === 'explanation' && (
          <div style={styles.textBlock}>
            <div style={styles.codeHeader}>
              <span style={styles.codeLabel}>What was changed & why</span>
              <button onClick={() => copyToClipboard(result.explanation)} style={styles.copyBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <div style={styles.explanationText}>
              {result.explanation.split('\n').map((line, i) => {
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                return (
                  <p key={i} style={isBullet ? styles.bulletLine : styles.normalLine}>
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'techstack' && (
          <div style={styles.textBlock}>
            <div style={styles.codeHeader}>
              <span style={styles.codeLabel}>Technologies & Patterns Detected</span>
              <button onClick={() => copyToClipboard(result.techStack)} style={styles.copyBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <div style={styles.techGrid}>
              {result.techStack.split(/[,\n]/).filter(t => t.trim()).map((tech, i) => (
                <span key={i} style={styles.techBadge}>{tech.trim()}</span>
              ))}
            </div>
            <div style={styles.explanationText}>
              <p style={styles.normalLine}>{result.techStack}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(8,8,16,0.9)',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    flexWrap: 'wrap',
    gap: '10px',
  },
  headerTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  tabRow: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '3px',
  },
  tab: {
    background: 'none',
    border: '1px solid transparent',
    borderRadius: '7px',
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '500',
    padding: '5px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  tabActive: {
    background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '7px',
    color: '#e5e7eb',
    fontSize: '12px',
    fontWeight: '600',
    padding: '5px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  body: {
    padding: '20px',
    maxHeight: '380px',
    overflowY: 'auto',
  },
  codeBlock: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  textBlock: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.02)',
  },
  codeLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: '0.3px',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    color: '#9ca3af',
    fontSize: '12px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  pre: {
    margin: 0,
    padding: '20px',
    overflowX: 'auto',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '13px',
    lineHeight: '1.7',
    color: '#e2e8f0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  explanationText: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  bulletLine: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#d1d5db',
    paddingLeft: '4px',
    borderLeft: '2px solid rgba(124,58,237,0.4)',
    paddingTop: '2px',
    paddingBottom: '2px',
  },
  normalLine: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#d1d5db',
  },
  techGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '16px 20px 0',
  },
  techBadge: {
    background: 'rgba(124,58,237,0.12)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '20px',
    color: '#a78bfa',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
  },
};

export default OutputPanel;
