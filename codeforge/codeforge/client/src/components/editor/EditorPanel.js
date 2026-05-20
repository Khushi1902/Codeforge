import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import OutputPanel from './OutputPanel';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'sql', label: 'SQL' },
];

const ACTIONS = [
  { value: 'fix', label: '🔧 Fix Code', color: '#7c3aed' },
  { value: 'explain', label: '💡 Explain', color: '#0891b2' },
  { value: 'optimize', label: '⚡ Optimize', color: '#059669' },
];

const PLACEHOLDER_CODE = `// Paste your code here and click Fix Code, Explain, or Optimize
function calculateSum(arr) {
  let total = 0
  for (let i = 0; i <= arr.length; i++) {  // Bug: off-by-one error
    total += arr[i]
  }
  return total
}

const result = calculateSum([1, 2, 3, 4, 5])
console.log('Sum:', result)`;

const EditorPanel = () => {
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [language, setLanguage] = useState('javascript');
  const [action, setAction] = useState('fix');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const editorRef = useRef(null);

  const handleProcess = async () => {
    if (!code || code.trim() === '') {
      toast.error('Please enter some code first');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/ai/process', { code, language, action });
      setResult(res.data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Processing failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
  };

  const activeAction = ACTIONS.find(a => a.value === action);

  return (
    <div style={styles.container}>
      {/* Header bar */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.dotRow}>
            <span style={{ ...styles.dot, background: '#ef4444' }} />
            <span style={{ ...styles.dot, background: '#f59e0b' }} />
            <span style={{ ...styles.dot, background: '#10b981' }} />
          </div>
          <span style={styles.headerTitle}>Code Editor</span>
        </div>

        <div style={styles.headerControls}>
          {/* Language selector */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={styles.select}
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          {/* Action toggles */}
          <div style={styles.actionGroup}>
            {ACTIONS.map(a => (
              <button
                key={a.value}
                onClick={() => setAction(a.value)}
                style={{
                  ...styles.actionBtn,
                  ...(action === a.value
                    ? { background: `${a.color}22`, borderColor: `${a.color}55`, color: '#e5e7eb' }
                    : {}),
                }}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Clear */}
          <button onClick={handleClear} style={styles.clearBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={styles.editorWrapper}>
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={val => setCode(val || '')}
          onMount={editor => { editorRef.current = editor; }}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineHeight: 1.7,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 20, bottom: 20 },
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* Run button */}
      <div style={styles.runBar}>
        <div style={styles.statusInfo}>
          {loading && (
            <div style={styles.loadingPill}>
              <span style={styles.pulsingDot} />
              <span style={{ fontSize: '13px', color: '#a78bfa' }}>AI is analyzing your code...</span>
            </div>
          )}
          {!loading && result && (
            <span style={{ fontSize: '13px', color: '#10b981' }}>✓ Analysis ready — scroll down to view results</span>
          )}
        </div>
        <button
          onClick={handleProcess}
          disabled={loading}
          style={loading ? styles.runBtnDisabled : styles.runBtn}
        >
          {loading ? (
            <>
              <span style={styles.miniSpinner} />
              Processing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {activeAction?.label}
            </>
          )}
        </button>
      </div>

      {/* Output */}
      {result && <OutputPanel result={result} />}
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0a12',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(10,10,18,0.8)',
    flexShrink: 0,
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dotRow: {
    display: 'flex',
    gap: '6px',
  },
  dot: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
  },
  headerTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: '0.5px',
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  select: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#d1d5db',
    fontSize: '13px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    outline: 'none',
  },
  actionGroup: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '3px',
  },
  actionBtn: {
    background: 'none',
    border: '1px solid transparent',
    borderRadius: '7px',
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '500',
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.12)',
    borderRadius: '8px',
    color: '#f87171',
    fontSize: '13px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  editorWrapper: {
    flex: 1,
    minHeight: '400px',
  },
  runBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(10,10,18,0.95)',
    flexShrink: 0,
    flexWrap: 'wrap',
    gap: '12px',
  },
  statusInfo: {
    flex: 1,
  },
  loadingPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '20px',
    padding: '6px 14px',
  },
  pulsingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#7c3aed',
    animation: 'pulse 1s ease-in-out infinite',
    display: 'inline-block',
  },
  runBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    padding: '10px 24px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    fontFamily: 'inherit',
  },
  runBtnDisabled: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(124,58,237,0.4)',
    border: 'none',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: '600',
    padding: '10px 24px',
    cursor: 'not-allowed',
    fontFamily: 'inherit',
  },
  miniSpinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
};

export default EditorPanel;
