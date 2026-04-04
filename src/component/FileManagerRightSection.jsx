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

    // ⛔ Block file loading for trash root AND its children
    if (selectedContainerId !== trashRootId && trashChildIds.has(selectedContainerId)) {
      setFiles([]);
      return;
    }


    async function loadFiles() {
      try {
        const data = await fileAPI.getFilesByContainer(selectedContainerId);
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

      // 1️⃣ Save original container
      await fileAPI.saveOriginalLocationFiles(file.id);

      // 2️⃣ Get Trash container
      const trashContainers = await containerAPI.getContainers('trash');
      const trashRoot = trashContainers.find(c => !c.parent_id);
      if (!trashRoot) throw new Error('Trash root not found');

      // 3️⃣ Move file to Trash
      await fileAPI.updateFileContainer(file.id, trashRoot.id);

      // 4️⃣ Update frontend state
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
                    onClick={() => handleFileHistory(contextMenu.file)}
                  >
                    <img src={law} alt="file" className="w-4 h-4 object-contain" />
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
