import React, { useState, useEffect, useRef } from 'react';
import { containerAPI, fileAPI } from '../services/api';
import file_icon from '../assets/files_img.png';
import law from '../assets/black_law.png';
import bookmark from '../assets/bookmark_open.png';
import trash from '../assets/trash_icon.png';
import { useNavigate } from 'react-router-dom';
import restore_img from '../assets/reset.png';
import edit_icon from '../assets/editNameIcon.png';
import bookmark_icon from '../assets/bookmark_icon.png';
import API_URL from '../config/api';
import summary_icon from '../assets/Brief.png';
import recent from '../assets/Replay.png';
import ReactMarkdown from 'react-markdown';
import arrow_left from '../assets/leftArrow.png';   // your left arrow image
import arrow_right from '../assets/rightArrow.png';

function SummarizeOverlay({ file, onClose }) {
  const [summary, setSummary] = useState('');
  const [summaryHistory, setSummaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fileId = file.original_file_id || file.id;

  const generateSummary = async () => {
    const formData = new FormData();
    formData.append('question', 'summarize');

    const fileRes = await fetch(`${API_URL}/uploads/${file.file_path}`, {
      credentials: 'include'
    });
    const blob = await fileRes.blob();
    const reconstructed = new File([blob], file.name, { type: blob.type });
    formData.append('files', reconstructed);

    const response = await fetch(`${API_URL}/api/ask`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = await response.json();
    return data.mode === 'summary'
      ? data.summary
      : data.answer || 'No summary available.';
  };

  const saveSummary = async (text) => {
    const res = await fetch(`${API_URL}/api/files/${fileId}/summaries`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: text })
    });
    return res.json();
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Fetch existing summaries
        const res = await fetch(`${API_URL}/api/files/${fileId}/summaries`, {
          credentials: 'include'
        });
        const data = await res.json();

        if (data.summaries?.length > 0) {
          setSummary(data.summaries[0].summary); // latest
          setSummaryHistory(data.summaries);
          setCurrentIndex(0);
          return;
        }

        // No summary yet — generate one
        const generated = await generateSummary();
        setSummary(generated);

        const saved = await saveSummary(generated);
        setSummaryHistory([saved.summary]);

      } catch (err) {
        setError('Failed to generate summary. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [file]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const generated = await generateSummary();
      setSummary(generated);

      const saved = await saveSummary(generated);
      // Prepend new summary to history
      setSummaryHistory(prev => [saved.summary, ...prev]);
      setCurrentIndex(0);
    } catch (err) {
      setError('Failed to regenerate summary. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', padding: '24px', borderRadius: '12px',
        width: '560px', maxWidth: '90vw', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontWeight: '600', fontSize: '13px' }}>Summary: {file.name}</p>

          {summaryHistory.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Back — older */}
              <button
                onClick={() => {
                  const next = currentIndex + 1;
                  if (next < summaryHistory.length) {
                    setCurrentIndex(next);
                    setSummary(summaryHistory[next].summary);
                  }
                }}
                disabled={currentIndex >= summaryHistory.length - 1}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer', padding: '2px',
                  outline: 'None',
                  opacity: currentIndex >= summaryHistory.length - 1 ? 0.3 : 1
                }}
              >
                <img src={arrow_left} alt="previous" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              </button>

              {/* Forward — newer */}
              <button
                onClick={() => {
                  const prev = currentIndex - 1;
                  if (prev >= 0) {
                    setCurrentIndex(prev);
                    setSummary(summaryHistory[prev].summary);
                  }
                }}
                disabled={currentIndex === 0}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer', padding: '2px',
                  outline: 'None',
                  opacity: currentIndex === 0 ? 0.3 : 1
                }}
              >
                <img src={arrow_right} alt="next" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              </button>

              {/* Counter */}
              <span style={{ fontSize: '11px', color: '#888', minWidth: '30px', textAlign: 'center' }}>
                {summaryHistory.length - currentIndex} / {summaryHistory.length}
              </span>


            </div>
          )}
        </div>

        {/* Summary Content */}
        {loading && <p style={{ fontSize: '13px', color: '#888' }}>Analysing document...</p>}
        {error && <p style={{ fontSize: '13px', color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <div style={{
            fontSize: '13px', lineHeight: '1.7', overflowY: 'auto', maxHeight: '50vh',
            paddingRight: '6px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#ccc transparent',
          }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>{children}</h3>,
                p: ({ children }) => <p style={{ marginBottom: '10px' }}>{children}</p>,
                ul: ({ children }) => <ul style={{ paddingLeft: '18px', marginBottom: '10px', listStyleType: 'disc' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: '18px', marginBottom: '10px', listStyleType: 'decimal' }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                strong: ({ children }) => <strong style={{ fontWeight: '600' }}>{children}</strong>,
                em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                hr: () => <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        )}

        {/* Footer Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Regenerate + nav arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleRegenerate}
              disabled={loading || regenerating}
              style={{
                padding: '6px 16px', borderRadius: '8px', cursor: 'pointer',
                border: '1px solid #448AFF', color: '#448AFF', background: 'none',
                fontSize: '12px', opacity: regenerating ? 0.6 : 1
              }}
            >
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>


          </div>

          <button
            onClick={onClose}
            style={{ padding: '6px 16px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '12px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FileManagerRightSection({ selectedContainerId, refreshTrigger, onOpenFile, onFileDeleted }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });
  const fileInputRef = useRef(null);
  const [bookmarkRootId, setBookmarkRootId] = useState(null);

  const handleFileHistory = (file) => {
    closeMenu();
    navigate('/dashboard', { state: { fileHistoryMode: true, file } });
  };

  const handleRenameFile = () => {
    if (!contextMenu.file) return;

    // Set the clicked file to editing mode
    setFiles(prev =>
      prev.map(f =>
        f.id === contextMenu.file.id ? { ...f, editing: true } : f
      )
    );

    closeMenu();
  };
  const [recentRootId, setRecentRootId] = useState(null);

  useEffect(() => {
    async function fetchRecentRoot() {
      try {
        const recentContainers = await containerAPI.getContainers('recent');
        const recentRoot = recentContainers.find(c => !c.parent_id);
        if (recentRoot) setRecentRootId(recentRoot.id);
      } catch (err) {
        console.error("Failed to fetch recent root", err);
      }
    }
    fetchRecentRoot();
  }, []);

  useEffect(() => {
    console.log('selectedContainerId:', selectedContainerId);
    console.log('recentRootId:', recentRootId);
  }, [selectedContainerId, recentRootId]);

  const handleToggleBookmark = async () => {
    if (!contextMenu.file) return;

    const file = contextMenu.file;

    try {
      const updatedFile = await fileAPI.toggleBookmark(file.id, !file.bookmarked);

      // If bookmarking → copy file to bookmark container
      if (!file.bookmarked && bookmarkRootId) {
        await fileAPI.toggleBookmark(file.id, true);
        await fileAPI.copyFileToContainer(file.id, bookmarkRootId);
      }

      // If removing bookmark → delete the copy
      if (file.bookmarked) {
        // update original file bookmark status
        await fileAPI.toggleBookmark(file.original_file_id || file.id, false);

        // find bookmark copy
        const bookmarkFiles = await fileAPI.getFilesByContainer(bookmarkRootId);

        const copied = bookmarkFiles.find(
          f => f.original_file_id === (file.original_file_id || file.id)
        );

        if (copied) {
          await fileAPI.deleteFile(copied.id);
        }

        // remove from UI if we are inside bookmark container
        if (selectedContainerId === bookmarkRootId) {
          setFiles(prev => prev.filter(f => f.id !== file.id));
        }
      }

      setFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...f, bookmarked: updatedFile.file.is_bookmarked }
            : f
        )
      );

      closeMenu();
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };




  const handleAskNyayamitra = (file) => {
    closeMenu();
    navigate('/dashboard', { state: { file, fileHistoryMode: false } }); // pass file in state
  };

  const [trashRootId, setTrashRootId] = useState(null);

  useEffect(() => {
    async function fetchTrashRoot() {
      try {
        const trashContainers = await containerAPI.getContainers('trash');
        const trashRoot = trashContainers.find(c => !c.parent_id);
        if (trashRoot) {
          setTrashRootId(trashRoot.id);
        }
      } catch (err) {
        console.error("Failed to fetch trash root", err);
      }
    }

    fetchTrashRoot();
  }, []);

  const [trashChildIds, setTrashChildIds] = useState(new Set());

  // Fetch all trash descendant IDs
  useEffect(() => {
    async function fetchTrashDescendants() {
      try {
        const trashContainers = await containerAPI.getContainers('trash');
        const ids = new Set(trashContainers.map(c => c.id));
        setTrashChildIds(ids);
      } catch (err) {
        console.error("Failed to fetch trash containers", err);
      }
    }
    fetchTrashDescendants();
  }, []);

  useEffect(() => {
    if (!selectedContainerId) return;

    console.log('trashRootId:', trashRootId);
    console.log('trashChildIds has selectedContainerId?', trashChildIds.has(selectedContainerId));
    console.log('trashChildIds:', [...trashChildIds]);

    //  Block file loading for trash root AND its children
    if (selectedContainerId !== trashRootId && trashChildIds.has(selectedContainerId)) {
      setFiles([]);
      return;
    }


    async function loadFiles() {
      try {
        const data = await fileAPI.getFilesByContainer(selectedContainerId);
        console.log('Files returned:', data);
        let filesWithBookmark = data.map(f => ({
          ...f,
          bookmarked: f.is_bookmarked
        }));

        // Sort by most recently opened if in recent container
        if (selectedContainerId === recentRootId) {
          filesWithBookmark = filesWithBookmark.sort(
            (a, b) => new Date(b.last_opened_at) - new Date(a.last_opened_at)
          );
        }

        setFiles(filesWithBookmark);
      } catch (err) {
        console.error('Failed to load files', err);
      }
    }

    loadFiles();
  }, [selectedContainerId, refreshTrigger, trashChildIds]);


  useEffect(() => {
    async function fetchBookmarkRoot() {
      try {
        const bookmarkContainers = await containerAPI.getContainers('bookmark');
        const bookmarkRoot = bookmarkContainers.find(c => !c.parent_id);

        if (bookmarkRoot) {
          setBookmarkRootId(bookmarkRoot.id);
        }
      } catch (err) {
        console.error("Failed to fetch bookmark root", err);
      }
    }

    fetchBookmarkRoot();
  }, []);

  const handleRightClick = (e, file) => {
    e.preventDefault(); // prevent browser context menu
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, file });
  };

  const closeMenu = () => setContextMenu({ ...contextMenu, visible: false });

  const handleDeleteFile = async () => {
    if (!contextMenu.file) return;

    try {
      const file = contextMenu.file;

      // 1. Save original container
      await fileAPI.saveOriginalLocationFiles(file.id);

      // 2. Get Trash container
      const trashContainers = await containerAPI.getContainers('trash');
      const trashRoot = trashContainers.find(c => !c.parent_id);
      if (!trashRoot) throw new Error('Trash root not found');

      // 3. Move file to Trash
      await fileAPI.updateFileContainer(file.id, trashRoot.id);

      // 4. Update frontend state
      setFiles(prev => prev.filter(f => f.id !== file.id));

      // Close tab if it's open
      if (onFileDeleted) {
        onFileDeleted(file.id);
      }


      closeMenu(); // cleaner than manually setting state
    } catch (err) {
      console.error('Failed to move file to trash', err);
    }
  };

  const handleDeleteFilePermanently = async () => {
    if (!contextMenu.file) return;

    try {
      const file = contextMenu.file;

      // Permanently delete file from database
      await fileAPI.deleteFile(file.id);

      // Remove from UI
      setFiles(prev => prev.filter(f => f.id !== file.id));

      // Close tab if it is open
      if (onFileDeleted) {
        onFileDeleted(file.id);
      }

      closeMenu();
    } catch (err) {
      console.error("Failed to permanently delete file", err);
    }
  };

  const handleRestoreFile = async () => {
    if (!contextMenu.file) return;

    try {
      const originalParent = await fileAPI.getFileOriginalParent(contextMenu.file.id);

      await fileAPI.updateFileContainer(contextMenu.file.id, originalParent);

      setFiles(prev => prev.filter(f => f.id !== contextMenu.file.id));
      closeMenu();

    } catch (err) {
      console.error("Failed to restore file", err);
    }
  };

  const [summarizeFile, setSummarizeFile] = useState(null);

  const handleSummarize = (file) => {
    closeMenu();           // close the right-click menu
    setSummarizeFile(file); // store the file → this will trigger the overlay
  };

  return (
    <div className="h-full w-full overflow-auto mt-3">
      {!selectedContainerId && <p>Select a folder</p>}
      {files.length === 0 && selectedContainerId && <p>No files</p>}

      {files.map((file, index) => (
        <div
          key={file.id}
          className="rounded-md transition hover:bg-gray-200"
          style={{
            backgroundColor: index % 2 === 0 ? '#448AFF0D' : '#FFFFFF'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#448AFF4D'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#448AFF0D' : '#FFFFFF'}
        >
          <button
            onClick={() => {
              if (selectedContainerId === trashRootId) return;
              onOpenFile({ ...file, type: 'file' });
              // Record as recently visited
              fileAPI.recordRecentFile(file.id).catch(err => console.error('Failed to record recent', err));
            }}
            onContextMenu={(e) => handleRightClick(e, file)}
            className="w-full flex gap-4 text-left text-sm text-gray-800"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontWeight: '400' }}
          >
            <img src={file_icon} alt="file" className="w-4 h-4 object-contain" />
            {file.editing ? (
              <input
                autoFocus
                value={file.name}
                className="bg-white text-xs px-1 rounded outline-none border border-gray-400"
                style={{ fontSize: '12px', fontWeight: 400 }}
                onChange={(e) =>
                  setFiles(prev =>
                    prev.map(f =>
                      f.id === file.id ? { ...f, name: e.target.value } : f
                    )
                  )
                }
                onBlur={async (e) => {
                  const newName = e.target.value.trim();

                  // Stop editing
                  setFiles(prev =>
                    prev.map(f =>
                      f.id === file.id ? { ...f, editing: false } : f
                    )
                  );

                  try {
                    await fileAPI.updateFileName(file.id, newName);
                  } catch (err) {
                    console.error('Failed to rename file', err);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.target.blur();
                }}
              />
            ) : (
              <span>{file.name}</span>
            )}
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
              {selectedContainerId !== trashRootId && (
                <>
                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={() => handleAskNyayamitra(contextMenu.file)}
                  >
                    <img src={law} alt="file" className="w-4 h-4 object-contain" />
                    <span>Ask Nyayamitra</span>
                  </button>

                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={() => handleSummarize(contextMenu.file)}
                  >
                    <img src={summary_icon} alt="file" className="w-4 h-4 object-contain" />
                    <span>Summarize</span>
                  </button>


                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={() => handleFileHistory(contextMenu.file)}
                  >
                    <img src={recent} alt="file" className="w-4 h-4 object-contain" />
                    <span>File History</span>
                  </button>

                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={handleRenameFile}
                  >
                    <img src={edit_icon} alt="rename" className="w-3 h-3 object-contain " />
                    <span className="ml-1">Rename File</span>
                  </button>

                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={handleToggleBookmark}
                  >
                    <img
                      src={contextMenu.file?.bookmarked ? bookmark_icon : bookmark}
                      alt="bookmark"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{contextMenu.file?.bookmarked ? 'Remove Bookmark' : 'Bookmark'}</span>
                  </button>

                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={handleDeleteFile}
                  >
                    <img src={trash} alt="file" className="w-4 h-4 object-contain" />
                    <span>Delete File</span>
                  </button>
                </>
              )}

              {selectedContainerId === trashRootId && (
                <>
                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={handleRestoreFile}
                  >
                    <img src={restore_img} alt="restore" className="w-4 h-4 object-contain" />
                    <span>Restore File</span>
                  </button>


                  <button
                    className="context-btn flex items-center gap-5 w-full text-left"
                    onClick={handleDeleteFilePermanently}
                  >
                    <img src={trash} alt="restore" className="w-4 h-4 object-contain" />
                    <span>Delete Files permanently</span>
                  </button>
                </>




              )}


            </div>


          </div>
        </>
      )}

      {summarizeFile && (
        <SummarizeOverlay
          file={summarizeFile}
          onClose={() => setSummarizeFile(null)}
        />
      )}
    </div>
  );
}
