import React, { useState, useEffect } from 'react';
import { fileAPI } from '../services/api';

export default function FileManagerRightSection({ selectedContainerId, refreshTrigger }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!selectedContainerId) return;

    async function loadFiles() {
      try {
        const data = await fileAPI.getFilesByContainer(selectedContainerId);
        console.log('FILES FROM API:', data);
        setFiles(data);
      } catch (err) {
        console.error('Failed to load files', err);
      }
    }

    loadFiles();
  }, [selectedContainerId, refreshTrigger]);

  return (
    <div className="h-full w-full pt-10 px-4 py-3 overflow-auto">
      {!selectedContainerId && <p>Select a folder</p>}
      {files.length === 0 && selectedContainerId && <p>No files</p>}

      {files.map(file => (
        <div key={file.id}>
          <a
            href={`https://localhost:5000/uploads/${file.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {file.name}
          </a>
        </div>
      ))}
    </div>
  );
}
