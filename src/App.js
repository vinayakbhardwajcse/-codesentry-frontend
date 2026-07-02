import React, { useState } from 'react';
import CodeInput from './components/CodeInput';
import ResultsDashboard from './components/ResultsDashboard';
import './App.css';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceCode, setSourceCode] = useState('');
  const [fileName, setFileName] = useState('MyCode.java');

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
    <div className="app">
      <header className="app-header">
        <h1>🔍 CodeSentry</h1>
        <p>AI-Powered Java Code Review System</p>
      </header>

      <main className="app-main">
        <CodeInput
          onScanComplete={handleScanComplete}
          onError={handleError}
          onLoading={handleLoading}
        />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your code...</p>
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
          />
        )}
      </main>

      <footer className="app-footer">
        <p>CodeSentry — AI-Powered Java Code Review</p>
      </footer>
    </div>
  );
}

export default App;