// FileTransmit.js

import React, { useRef } from 'react';
import SERVER_URL from './config';

function FileTransmit({ onUploadComplete }) {
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      try {
        const response = await fetch(`${SERVER_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Files successfully uploaded');
          if (onUploadComplete) {
            onUploadComplete();
          }
        } else {
          const errorData = await response.json();
          alert('Upload failed: ' + errorData.error);
        }
      } catch (error) {
        alert('Upload failed: ' + error.message);
      } finally {
        event.target.value = null;
      }
    }
  };

  const handleDownloadClick = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workspace.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await response.json();
        alert('Download failed: ' + errorData.error);
      }
    } catch (error) {
      alert('Download failed: ' + error.message);
    }
  };

  // New function to handle cache cleanup
  const handleCleanCacheClick = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/clean-cache`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Cache successfully cleaned');
      } else {
        const errorData = await response.json();
        alert('Clean cache failed: ' + errorData.error);
      }
    } catch (error) {
      alert('Clean cache failed: ' + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple // Allow multiple file selection
      />
      <button onClick={handleUploadClick}>Files To Cache</button>
      <button onClick={handleDownloadClick}>Get from Cache</button>
      <button onClick={handleCleanCacheClick}>Clean Cache</button> {/* New Clean Cache Button */}
    </div>
  );
}

export default FileTransmit;
