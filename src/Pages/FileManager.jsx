import { useState, useRef, useEffect } from 'react';
import LoginNavbarAsk from '../component/NavBarProfileAsk.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon.jsx';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import FileManagerLeftSection from '../component/FileManagerLeftSection.jsx';
import FileManagerRightSection from '../component/FileManagerRightSection.jsx';
import cross_img from '../assets/cross_img.png';
import files_img from '../assets/files_img.png';
import folder from '../assets/folder.png';
import { useNavigate } from 'react-router-dom';


export default function FileManager() {

  //stores all open tabs (both folders and files)
  const [openTabs, setOpenTabs] = useState([]);

  //stores which tab is currently selected
  const [activeTabId, setActiveTabId] = useState(null);

  //stores which folder is currently selected in the left section (for loading files)
  const [selectedContainerId, setSelectedContainerId] = useState(null);

  //hides the left section and makes right section full width when a file is opened in preview mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const containerRef = useRef(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const navigate = useNavigate();

 

  // width of left section (px)
  const [leftWidth, setLeftWidth] = useState(300); // default 30%

  const isResizing = useRef(false);

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

      if (newWidth > 100 && newWidth < containerWidth - 100) {
        setLeftWidth(newWidth);
      }
    }
  };



  const activeTab = openTabs.find(t => t.id === activeTabId);


  function handleOpenFolder(folder) {
    setSelectedContainerId(folder.id);
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
      // Container for all tabs
      <div
        className="flex items-end rounded-md"
        style={{ backgroundColor: '#transparent' }} // <-- container background
      >
        {openTabs.map(tab => {
          const isActive = tab.id === activeTabId;
          const isFolder = tab.type === 'folder';

          return (
            <div
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className="flex items-center gap-1 px-3 py-1 text-xs cursor-pointer rounded-md h-7"
              style={{
                backgroundColor: isActive ? '#448AFF4D' : 'transparent', // only active tab highlighted
                border: isActive ? '1px solid #E5E7EB' : 'none',
                transition: 'background-color 0.2s', // smooth hover
                fontSize: '12px',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#448AFF0D'; // subtle hover
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; // reset
              }}
            >
              <span className="flex items-center gap-1 truncate max-w-[110px]">
                <img
                  src={isFolder ? folder : files_img}
                  alt={isFolder ? 'folder' : 'file'}
                  className={`shrink-0 ${isFolder ? 'w-3 h-3' : 'w-4 h-4'}`}
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
                    height: 'auto',
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
                      verticalAlign: 'top',
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

  function closeTab(id) {
    setOpenTabs(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev; // tab not found

      const updated = prev.filter(t => t.id !== id);

      // Determine new active tab
      if (activeTabId === id) {
        if (updated.length === 0) {
          setActiveTabId(null);
          setIsPreviewMode(false); // exit preview mode
        } else {
          // Activate previous tab if exists, otherwise next tab
          const newIndex = index > 0 ? index - 1 : 0;
          setActiveTabId(updated[newIndex].id);
          setIsPreviewMode(updated[newIndex].type === 'file');
        }
      }

      // If closed tab wasn't active, do nothing with activeTabId
      return updated;
    });
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





  return (
    <div className="flex h-screen overflow-hidden relative" onMouseMove={resize} onMouseUp={stopResizing}>

      {/* Left Sidebar */}
      <div className="w-16 border-r shrink-0 overflow-y-auto">
        <div className="py-3 px-2">
          <LoginNavbarIcon onToggleHistory={() => navigate('/dashboard', { state: { showHistory: true } })}/>
        </div>
      </div>

      {/* Main Content - now goes full width minus left sidebar */}
      <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Navbar - now wrapped to leave space for right sidebar */}
        <div className="flex items-center justify-between p-4 pr-[136px] bg-white z-10">
          <LoginNavbarAsk />
        </div>

        {/* Resizable Sections */}
        <div className="flex flex-1 overflow-hidden px-2 rounded-lg">

          {/* Left section */}
          <div
            className="transition-all duration-200"
            style={{ width: isPreviewMode ? 0 : leftWidth, overflow: 'hidden' }}
          >
            <div
              className="px-2 py-1"
              style={{
                backgroundColor: '#ffffff',
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
                borderBottom: '1px solid black',
                borderRight: 'none',
                borderTopLeftRadius: '0.5rem',
                borderBottomLeftRadius: '0.5rem',
                height: '100%',
              }}
            >
              <FileManagerLeftSection
                onSelectContainer={(folder) => {
                  if (!folder) {
                    setSelectedContainerId(null);
                    return;
                  }

                  setSelectedContainerId(folder.id);
                  handleOpenFolder(folder);
                }}

                selectedContainerId={selectedContainerId}
                onFilesUploaded={() => setRefreshTrigger(prev => prev + 1)}
              />
            </div>
          </div>

          {/* Divider */}
          {!isPreviewMode && (
            <div
              className="w-1 bg-gray-300 cursor-col-resize"
              onMouseDown={startResizing}
              style={{
                borderTop: '1px solid black',
                borderBottom: '1px solid black',


              }}
            />
          )}

          {/* Right section - full width, profile floats on top */}
          <div
            className="flex-1 flex flex-col overflow-hidden"
            style={{
              backgroundColor: '#ffffff',

              borderTop: '1px solid black',
              borderBottom: '1px solid black',
              borderRight: '1px solid black',

              borderLeft: isPreviewMode ? '1px solid black' : 'none',

              borderTopRightRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',

              ...(isPreviewMode && {
                borderTopLeftRadius: '0.5rem',
                borderBottomLeftRadius: '0.5rem',
              }),

              padding: '0.5rem'
            }}
          >
            <FileTabs
              openTabs={openTabs}
              activeTabId={activeTabId}
              onSelect={(tabId) => {
                setActiveTabId(tabId);
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

            {activeTab?.type === 'file' && <FilePreview file={activeTab} />}

            {!isPreviewMode && (
              <FileManagerRightSection
                selectedContainerId={selectedContainerId}
                refreshTrigger={refreshTrigger}
                onOpenFile={handleOpenFile}
                onFileDeleted={closeTab}
              />
            )}
          </div>

        </div>
      </div>

      {/* Right Sidebar - absolutely positioned so it floats OVER the right section */}
      <div className="absolute top-0 right-0 w-[120px] h-full z-20 pointer-events-none">
        <div className="px-4 py-2 pointer-events-auto">
          <LoginNavbarProfile />
        </div>
      </div>

    </div>
  );
}
