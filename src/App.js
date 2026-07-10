import React, { useState } from 'react';
import CodeInput from './components/CodeInput';
import ResultsDashboard from './components/ResultsDashboard';
import GitHubScanner from './components/GitHubScanner';
import './App.css';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceCode, setSourceCode] = useState('');
  const [fileName, setFileName] = useState('MyCode.java');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('code');

  const handleScanComplete = (result, code, name) => {
    setScanResult(result);
    setSourceCode(code);
    setFileName(name);
    setError(null);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setScanResult(null);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🔍 CodeSentry</h1>
            <p>AI-Powered Java Code Review System</p>
          </div>
          <button
            className="dark-mode-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('code');
              setScanResult(null);
              setError(null);
            }}
          >
            📝 Code Review
          </button>
          <button
            className={`tab ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('github');
              setScanResult(null);
              setError(null);
            }}
          >
            🐙 GitHub Scanner
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'code' && (
          <>
            <CodeInput
              onScanComplete={handleScanComplete}
              onError={handleError}
              onLoading={handleLoading}
              darkMode={darkMode}
            />

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>🔍 Analyzing your code...</p>
                <p style={{
                  fontSize: '0.85rem',
                  color: darkMode ? '#94a3b8' : '#718096',
                  marginTop: '8px'
                }}>
                  This may take 15-30 seconds on first request
                </p>
              </div>
            )}

            {error && (
              <div className="error-box">
                <p>❌ {error}</p>
              </div>
            )}

            {scanResult && !loading && (
              <ResultsDashboard
                result={scanResult}
                sourceCode={sourceCode}
                fileName={fileName}
                darkMode={darkMode}
              />
            )}
          </>
        )}

        {activeTab === 'github' && (
          <GitHubScanner darkMode={darkMode} />
        )}
      </main>

      <footer className="app-footer">
        <p>CodeSentry — AI-Powered Java Code Review</p>
      </footer>
    </div>
  );
}

export default App;