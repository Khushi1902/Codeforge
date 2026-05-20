import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import EditorPanel from '../components/editor/EditorPanel';
import HistoryPanel from '../components/editor/HistoryPanel';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('editor');

  return (
    <div style={styles.root}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.main}>
        {activeTab === 'editor' && <EditorPanel />}
        {activeTab === 'history' && (
          <div style={styles.historyWrapper}>
            <HistoryPanel />
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  root: {
    display: 'flex',
    height: '100vh',
    background: '#0a0a12',
    fontFamily: "'DM Sans', 'Inter', sans-serif",
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  historyWrapper: {
    flex: 1,
    overflowY: 'auto',
  },
};

export default DashboardPage;
