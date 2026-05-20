import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ACTION_COLORS = {
  fix: { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)', text: '#a78bfa', label: '🔧 Fix' },
  explain: { bg: 'rgba(8,145,178,0.12)', border: 'rgba(8,145,178,0.25)', text: '#22d3ee', label: '💡 Explain' },
  optimize: { bg: 'rgba(5,150,105,0.12)', border: 'rgba(5,150,105,0.25)', text: '#34d399', label: '⚡ Optimize' },
};

const HistoryPanel = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      setHistory(res.data);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/history/${id}`);
      setHistory(prev => prev.filter(h => h._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const copyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => toast.success('Copied!')).catch(() => toast.error('Copy failed'));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={styles.loadingState}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(107,114,128,0.5)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p style={styles.emptyTitle}>No history yet</p>
        <p style={styles.emptySubtitle}>Your previous code analyses will appear here</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Code History</h2>
        <span style={styles.count}>{history.length} sessions</span>
      </div>

      <div style={styles.list}>
        {history.map((item) => {
          const actionStyle = ACTION_COLORS[item.action] || ACTION_COLORS.fix;
          const isExpanded = expanded === item._id;

          return (
            <div
              key={item._id}
              style={styles.card}
              onClick={() => setExpanded(isExpanded ? null : item._id)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardMeta}>
                  <span style={{ ...styles.actionBadge, background: actionStyle.bg, border: `1px solid ${actionStyle.border}`, color: actionStyle.text }}>
                    {actionStyle.label}
                  </span>
                  <span style={styles.langBadge}>{item.language}</span>
                  <span style={styles.dateText}>{formatDate(item.createdAt)}</span>
                </div>
                <div style={styles.cardActions}>
                  <button
                    onClick={(e) => copyCode(item.fixedCode, e)}
                    style={styles.iconBtn}
                    title="Copy fixed code"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                  <button
                    onClick={(e) => deleteItem(item._id, e)}
                    style={{ ...styles.iconBtn, color: '#f87171' }}
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"
                    style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* Code preview */}
              <pre style={styles.codePreview}>
                {item.originalCode.slice(0, 120)}{item.originalCode.length > 120 ? '...' : ''}
              </pre>

              {/* Expanded view */}
              {isExpanded && (
                <div style={styles.expandedContent}>
                  <div style={styles.expandedSection}>
                    <div style={styles.sectionLabel}>Original Code</div>
                    <pre style={styles.expandedPre}>{item.originalCode}</pre>
                  </div>
                  <div style={styles.expandedSection}>
                    <div style={styles.sectionLabel}>Fixed Code</div>
                    <pre style={{ ...styles.expandedPre, borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.04)' }}>
                      {item.fixedCode}
                    </pre>
                  </div>
                  <div style={styles.expandedSection}>
                    <div style={styles.sectionLabel}>Explanation</div>
                    <p style={styles.explanationText}>{item.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '28px',
    fontFamily: "'DM Sans', 'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f9fafb',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  count: {
    background: 'rgba(124,58,237,0.12)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '20px',
    color: '#a78bfa',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  actionBadge: {
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
  },
  langBadge: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    color: '#9ca3af',
    fontSize: '11px',
    padding: '3px 10px',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: '12px',
    color: '#6b7280',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '6px',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
  },
  codePreview: {
    margin: 0,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '12px',
    color: '#6b7280',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '10px 14px',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.5',
  },
  expandedContent: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '16px',
  },
  expandedSection: {},
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  expandedPre: {
    margin: 0,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '13px',
    color: '#e2e8f0',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '14px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.6',
  },
  explanationText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#d1d5db',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '14px',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    gap: '16px',
  },
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: '2px solid rgba(124,58,237,0.2)',
    borderTopColor: '#7c3aed',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '350px',
    gap: '12px',
    padding: '40px',
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#9ca3af',
    margin: 0,
  },
  emptySubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    textAlign: 'center',
  },
};

export default HistoryPanel;
