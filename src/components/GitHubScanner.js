import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://codesentry-backend-ztuy.onrender.com';

function GitHubScanner({ darkMode }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL!');
      return;
    }

    if (!repoUrl.includes('github.com')) {
      setError('Please enter a valid GitHub URL!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/github/scan`, {
        repoUrl: repoUrl
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to scan repository. Make sure it is a public GitHub repo!');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 50) return '#ca8a04';
    return '#dc2626';
  };

  const cardStyle = {
    background: darkMode ? '#1e293b' : 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
    color: darkMode ? '#e2e8f0' : '#1a202c'
  };

  return (
    <div>
      {/* GitHub URL Input */}
      <div style={cardStyle}>
        <h2 style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '1.3rem' }}>
          🐙 GitHub Repository Scanner
        </h2>
        <p style={{ color: darkMode ? '#94a3b8' : '#718096', marginBottom: '16px' }}>
          Paste a public GitHub repository URL to scan all Java files automatically!
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              background: darkMode ? '#0f172a' : 'white',
              color: darkMode ? '#e2e8f0' : '#1a202c',
              minWidth: '300px'
            }}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? '⏳ Scanning...' : '🔍 Scan Repository'}
          </button>
        </div>

        {/* Example repos */}
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '0.85rem', color: darkMode ? '#94a3b8' : '#718096' }}>
            Try these examples:
          </p>
          {[
            'https://github.com/vinayakbhardwajcse/Repository-name-codesentry-backend-Visibility-Public',
          ].map((url) => (
            <button
              key={url}
              onClick={() => setRepoUrl(url)}
              style={{
                background: 'none',
                border: '1px solid #2563eb',
                color: '#2563eb',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                marginRight: '8px',
                marginTop: '8px'
              }}
            >
              {url.replace('https://github.com/', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>🔍 Scanning repository...</p>
          <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '8px' }}>
            This may take 30-60 seconds depending on repository size
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '16px',
          color: '#dc2626',
          marginBottom: '16px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Overview Card */}
          <div style={cardStyle}>
            <h2 style={{ color: '#1e3a8a', marginBottom: '20px', fontSize: '1.3rem' }}>
              📊 Repository Analysis: {result.repoName}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {[
                { label: 'Files Scanned', value: result.totalFilesScanned, color: '#2563eb' },
                { label: 'Total Java Files', value: result.totalJavaFilesFound, color: '#7c3aed' },
                { label: 'Total Issues', value: result.totalIssues, color: '#dc2626' },
                { label: 'Overall Health', value: `${result.overallHealthScore}/100`, color: getScoreColor(result.overallHealthScore) },
              ].map((item) => (
                <div key={item.label} style={{
                  background: darkMode ? '#0f172a' : '#f8fafc',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  border: `2px solid ${item.color}20`
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: item.color
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: darkMode ? '#94a3b8' : '#718096',
                    marginTop: '4px'
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Health Bar */}
            <div style={{ marginTop: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: '600' }}>Overall Project Health</span>
                <span style={{
                  color: getScoreColor(result.overallHealthScore),
                  fontWeight: 'bold'
                }}>
                  {result.overallHealthScore}/100
                </span>
              </div>
              <div style={{
                background: '#e2e8f0',
                borderRadius: '10px',
                height: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: getScoreColor(result.overallHealthScore),
                  width: `${result.overallHealthScore}%`,
                  height: '100%',
                  borderRadius: '10px',
                  transition: 'width 1s ease-in-out'
                }} />
              </div>
            </div>
          </div>

          {/* Per File Results */}
          <div style={cardStyle}>
            <h2 style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '1.3rem' }}>
              📁 Per File Results
            </h2>
            {result.fileResults.map((file, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: darkMode ? '#0f172a' : '#f8fafc',
                borderRadius: '8px',
                marginBottom: '8px',
                borderLeft: `4px solid ${getScoreColor(file.healthScore)}`
              }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                    📄 {file.fileName}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: darkMode ? '#94a3b8' : '#718096',
                    marginTop: '4px'
                  }}>
                    {file.issues.length} issues found
                  </div>
                </div>
                <div style={{
                  background: getScoreColor(file.healthScore),
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {file.healthScore}/100
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GitHubScanner;