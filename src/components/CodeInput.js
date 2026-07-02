import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://codesentry-backend-ztuy.onrender.com';

function CodeInput({ onScanComplete, onError, onLoading }) {
  const [fileName, setFileName] = useState('MyCode.java');
  const [sourceCode, setSourceCode] = useState('');

  const handleScan = async () => {
    if (!sourceCode.trim()) {
      onError('Please paste some Java code first!');
      return;
    }

    onLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/scan/text`, {
        fileName: fileName,
        sourceCode: sourceCode
      });
      onScanComplete(response.data, sourceCode, fileName);
    } catch (error) {
      onError('Failed to scan code. Make sure your backend is running on port 9090!');
    } finally {
      onLoading(false);
    }
  };

  const handleClear = () => {
    setSourceCode('');
    setFileName('MyCode.java');
  };

  return (
    <div className="code-input-container">
      <div className="code-input-header">
        <h2>📝 Paste Your Java Code</h2>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="filename-input"
          placeholder="Enter file name..."
        />
      </div>

      <textarea
        className="code-textarea"
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        placeholder={`Paste your Java code here...\n\nExample:\npublic class Example {\n    void method() {\n        try {\n            int x = 1;\n        } catch (Exception e) {\n            // empty catch block\n        }\n    }\n}`}
        rows={15}
      />

      <div className="code-input-buttons">
        <button className="btn-scan" onClick={handleScan}>
          🔍 Scan Code
        </button>
        <button className="btn-clear" onClick={handleClear}>
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}

export default CodeInput;