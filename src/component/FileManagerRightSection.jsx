import React, { useState, useEffect, useRef } from 'react';
import { fileAPI } from '../services/api';
import file_icon from '../assets/files_img.png';
import law from '../assets/black_law.png';
import bookmark from '../assets/bookmark_open.png';
import trash from '../assets/trash_icon.png';
import { useNavigate } from 'react-router-dom';

export default function FileManagerRightSection({ selectedContainerId, refreshTrigger, onOpenFile }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });
  const fileInputRef = useRef(null);

  const handleAskNyayamitra = (file) => {
    closeMenu();
    navigate('/dashboard', { state: { file } }); // pass file in state
  };


  useEffect(() => {
    if (!selectedContainerId) return;

    async function loadFiles() {
      try {
        const data = await fileAPI.getFilesByContainer(selectedContainerId);
        setFiles(data);
      } catch (err) {
        console.error('Failed to load files', err);
      }
    }

    loadFiles();
  }, [selectedContainerId, refreshTrigger]);

  const handleRightClick = (e, file) => {
    e.preventDefault(); // prevent browser context menu
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, file });
  };

  const closeMenu = () => setContextMenu({ ...contextMenu, visible: false });

  return (
    <div className="h-full w-full overflow-auto mt-3">
      {!selectedContainerId && <p>Select a folder</p>}
      {files.length === 0 && selectedContainerId && <p>No files</p>}

      {files.map((file, index) => (
        <div
          key={file.id}
          className="mb-1 rounded-md transition hover:bg-gray-200"
          style={{
            backgroundColor: index % 2 === 0 ? '#448AFF0D' : '#FFFFFF'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#448AFF4D'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#448AFF0D' : '#FFFFFF'}
        >
          <button
            onClick={() => onOpenFile({ ...file, type: 'file' })}
            onContextMenu={(e) => handleRightClick(e, file)}
            className="w-full flex gap-4 text-left text-sm text-gray-800"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontWeight: '400' }}
          >
            <img src={file_icon} alt="file" className="w-4 h-4 object-contain" />
            <span>{file.name}</span>
          </button>
        </div>
      ))}

      {/* Render context menu outside the map */}
      {contextMenu.visible && (
        <>
          {/* Click outside */}
          <div className="fixed inset-0 z-40" onClick={closeMenu} />

          {/* Context Menu */}
          <div
            className="fixed z-50"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            <div
              className="pr-11 pl-1 py-2"
              style={{
                background: '#D9D9D9',
                color: '#000000',
                fontSize: '11px',
                minWidth: '120px',
                borderRadius: '7px',
                border: '1px solid #000000',
                fontWeight: "400"
              }}
            >
              <button
                className="context-btn flex items-center gap-5 w-full text-left"
                onClick={() => handleAskNyayamitra(contextMenu.file)}
              >
                <img src={law} alt="file" className="w-4 h-4 object-contain" />
                <span>Ask Nyayamitra</span>
              </button>



              {/* <button
                className="context-btn flex items-center gap-5 w-full text-left"
                onClick={() => { console.log('Ask Nyayamitra', contextMenu.file); closeMenu(); }}
              >
                <img src={bookmark} alt="file" className="w-4 h-4 object-contain" />
                <span>Bookmark</span>
              </button>



              <button
                className="context-btn flex items-center gap-5 w-full text-left"
                onClick={() => { console.log('Ask Nyayamitra', contextMenu.file); closeMenu(); }}
              >
                <img src={trash} alt="file" className="w-4 h-4 object-contain" />
                <span>Move to Trash</span>
              </button> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
