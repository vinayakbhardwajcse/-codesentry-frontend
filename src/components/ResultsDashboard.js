import React from 'react';
import IssueCard from './IssueCard';
import axios from 'axios';

const BACKEND_URL = 'https://codesentry-backend-ztuy.onrender.com';

function HealthGauge({ score }) {
  const size = 180;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? '#16a34a' : score >= 50 ? '#ca8a04' : '#dc2626';
  const label = score >= 80 ? 'Good ✅' : score >= 50 ? 'Fair ⚠️' : 'Poor ❌';
  const bgColor = score >= 80 ? '#dcfce7' : score >= 50 ? '#fef9c3' : '#fee2e2';

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h2 style={{
        fontSize: '1.3rem',
        color: '#1e3a8a',
        marginBottom: '20px'
      }}>
        Code Health Score
      </h2>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
          />
        </svg>

        {/* Score text in center */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: color,
            lineHeight: 1
          }}>
            {score}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#718096'
          }}>
            /100
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{
        marginTop: '12px',
        display: 'inline-block',
        background: bgColor,
        color: color,
        padding: '6px 20px',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '1rem'
      }}>
        {label}
      </div>
    </div>
  );
}

function ResultsDashboard({ result, sourceCode, fileName }) {

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/scan/report`,
        { fileName: fileName, sourceCode: sourceCode },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download PDF report!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Animated Health Score Gauge */}
      <HealthGauge score={result.healthScore} />

      {/* Issue Summary */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.3rem', color: '#1e3a8a', marginBottom: '16px' }}>
          📊 Issue Summary
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {[
            { label: 'Critical', count: result.issueCountBySeverity.CRITICAL, bg: '#fee2e2', color: '#dc2626' },
            { label: 'High', count: result.issueCountBySeverity.HIGH, bg: '#ffedd5', color: '#ea580c' },
            { label: 'Medium', count: result.issueCountBySeverity.MEDIUM, bg: '#fef9c3', color: '#ca8a04' },
            { label: 'Low', count: result.issueCountBySeverity.LOW, bg: '#dcfce7', color: '#16a34a' },
          ].map((item) => (
            <div key={item.label} style={{
              background: item.bg,
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: item.color
              }}>
                {item.count}
              </div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#4a5568',
                marginTop: '4px'
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.3rem', color: '#1e3a8a', marginBottom: '16px' }}>
          🐛 Detected Issues ({result.issues.length})
        </h2>
        {result.issues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#16a34a', fontSize: '1.1rem' }}>
            ✅ No issues found! Your code looks clean!
          </div>
        ) : (
          result.issues.map((issue, index) => (
            <IssueCard key={index} issue={issue} index={index + 1} />
          ))
        )}
      </div>

      {/* Download PDF */}
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <button
          onClick={handleDownloadPdf}
          style={{
            background: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📄 Download PDF Report
        </button>
      </div>

    </div>
  );
}

export default ResultsDashboard;