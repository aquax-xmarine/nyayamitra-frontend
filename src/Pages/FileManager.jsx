import { useState, useRef } from 'react';
import LoginNavbarAsk from '../component/NavBarProfileAsk.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import FileManagerLeftSection from '../component/FileManagerLeftSection.jsx';
import FileManagerRightSection from '../component/FileManagerRightSection.jsx';
import cross_img from '../assets/cross_img.png';
import files_img from '../assets/files_img.png';
import folder from '../assets/folder.png';

export default function FileManager() {


  const [openTabs, setOpenTabs] = useState([]);

  const [activeTabId, setActiveTabId] = useState(null);

  const [selectedContainerId, setSelectedContainerId] = useState(null);

  const containerRef = useRef(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // width of left section (px)
  const [leftWidth, setLeftWidth] = useState(300); // default 30%

  const isResizing = useRef(false);

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const startResizing = (e) => {
    isResizing.current = true;
    e.preventDefault();
  };

  const stopResizing = () => {
    isResizing.current = false;
  };

  const resize = (e) => {
    if (isResizing.current && containerRef.current) {
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newWidth = e.clientX - containerLeft;
      const containerWidth = containerRef.current.clientWidth;
      // optional: clamp width between 100px and containerWidth-100
      if (newWidth > 100 && newWidth < containerWidth - 100) {
        setLeftWidth(newWidth);
      }
    }
  };

  const activeTab = openTabs.find(t => t.id === activeTabId);

  function handleOpenFolder(folder) {
    setOpenTabs(prev => {
      // remove existing folder tab
      const fileTabs = prev.filter(t => t.type === 'file');

      return [
        {
          id: folder.id,
          name: folder.name,
          type: 'folder',
        },
        ...fileTabs,
      ];
    });

    setActiveTabId(folder.id);
    setIsPreviewMode(false);
  }

  function handleOpenFile(file) {
    setOpenTabs(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) return prev;
      return [...prev, file];
    });

    setActiveTabId(file.id);
    setIsPreviewMode(true);
  }


  function FileTabs({ openTabs, activeTabId, onSelect, onClose }) {
    return (
      <div className="flex items-end bg-gray-100 pb-1">
        {openTabs.map(tab => {
          const isActive = tab.id === activeTabId;
          const isFolder = tab.type === 'folder';

          return (
            <div
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`
        flex items-center gap-1
        px-3 py-1 text-xs
        cursor-pointer rounded-md
        ${isActive ? 'bg-white border border-gray-200' : 'hover:bg-gray-200'}
      `}
            >
              <span className="flex items-center gap-1 truncate max-w-[110px]">
                <img
                  src={isFolder ? folder : files_img}
                  alt={isFolder ? 'folder' : 'file'}
                  className={`shrink-0 ${isFolder ? 'w-3 h-3' : 'w-4 h-4'
                    }`}
                />
                <span className="truncate">{tab.name}</span>
              </span>

              {!isFolder && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onClose(tab.id);
                  }}
                  className="ml-1 flex items-center justify-center"
                  style={{
                    outline: 'none',
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    margin: 0,
                    lineHeight: 0,
                    height: 'auto'
                  }}
                >
                  <img
                    src={cross_img}
                    className="w-3 h-3"
                    style={{
                      display: 'block',
                      padding: 0,
                      margin: 0,
                      lineHeight: 0,
                      verticalAlign: 'top'
                    }}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function FilePreview({ file }) {
    if (!file) {
      return null;
    }


    return (
      <div className="flex-1 w-full">
        <iframe
          src={`https://localhost:5000/uploads/${file.file_path}#toolbar=0`}
          className="w-full h-full"
          title={file.name}
        />
      </div>
    );
  }

  function closeTab(id) {
    setOpenTabs(prev => {
      const updated = prev.filter(f => f.id !== id);

      if (updated.length === 0) {
        setIsPreviewMode(false); // 👈 EXIT preview mode
        setActiveTabId(null);
      } else if (activeTabId === id) {
        setActiveTabId(updated[0].id);
      }

      return updated;
    });
  }



  return (
    <div className="flex h-screen overflow-hidden" onMouseMove={resize} onMouseUp={stopResizing}>

      {/* Left Sidebar */}
      <div className="w-16 border-r shrink-0 overflow-y-auto">
        <div className="py-3 px-2">
          <LoginNavbarIcon />
        </div>
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Navbar */}
        <div className="flex items-center justify-between p-4">
          <LoginNavbarAsk />
        </div>

        {/* Resizable Sections */}
        <div className="flex flex-1 overflow-hidden px-2 rounded-lg">

          {/* Left section */}
          {!isPreviewMode && (
            <div
              className="px-2 py-1"
              style={{
                width: leftWidth,
                backgroundColor: '#F1EDED',
                borderTopLeftRadius: '0.5rem',
                borderBottomLeftRadius: '0.5rem',
              }}
            >
              <FileManagerLeftSection
                onSelectContainer={(folder) => {
                  setSelectedContainerId(folder.id);
                  handleOpenFolder(folder);
                }}
                selectedContainerId={selectedContainerId}
                onFilesUploaded={() => setRefreshTrigger(prev => prev + 1)}
              />
            </div>
          )}

          {/* Divider / Drag handle */}
          {!isPreviewMode && (
            <div
              className="w-1 bg-gray-300 cursor-col-resize"
              onMouseDown={startResizing}
            />
          )}

          {/* Right section */}
          <div
            className="flex-1 flex flex-col overflow-hidden"
            style={{
              backgroundColor: '#F7F2F2',
              borderTopRightRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',
              ...(isPreviewMode ? {} : { padding: '1rem' })
            }}
          >
            <FileTabs
              openTabs={openTabs}
              activeTabId={activeTabId}
              onSelect={(tabId) => {
                setActiveTabId(tabId);
                // ✅ Check if the selected tab is a folder or file
                const selectedTab = openTabs.find(t => t.id === tabId);
                if (selectedTab?.type === 'folder') {
                  setIsPreviewMode(false);
                  setSelectedContainerId(selectedTab.id);
                } else if (selectedTab?.type === 'file') {
                  setIsPreviewMode(true);
                }
              }}
              onClose={closeTab}
            />

            {activeTab?.type === 'file' && (
              <FilePreview file={activeTab} />
            )}

            {!isPreviewMode && (
              <FileManagerRightSection
                selectedContainerId={selectedContainerId}
                refreshTrigger={refreshTrigger}
                onOpenFile={handleOpenFile}
              />
            )}

          </div>

        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[120px] shrink-0">
        <div className="px-4 py-2">
          <LoginNavbarProfile />
        </div>
      </div>

    </div>
  );
}
