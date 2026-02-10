import { useState, useRef } from 'react';
import LoginNavbarAsk from '../component/NavBarProfileAsk.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import FileManagerLeftSection from '../component/FileManagerLeftSection.jsx';
import FileManagerRightSection from '../component/FileManagerRightSection.jsx';

export default function FileManager() {
  const [openTabs, setOpenTabs] = useState([]);

  const [activeTabId, setActiveTabId] = useState(null);

  const [selectedContainerId, setSelectedContainerId] = useState(null);

  const containerRef = useRef(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      // optional: clamp width between 100px and containerWidth-100
      if (newWidth > 100 && newWidth < containerWidth - 100) {
        setLeftWidth(newWidth);
      }
    }
  };

  function handleOpenFile(file) {
    setOpenTabs(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) return prev;
      return [...prev, file];
    });

    setActiveTabId(file.id);
  }


  function FileTabs({ openTabs, activeTabId, onSelect, onClose }) {
    return (
      <div className="flex border-b bg-gray-100">
        {openTabs.map(file => (
          <div
            key={file.id}
            className={`px-4 py-2 cursor-pointer flex items-center gap-2
            ${file.id === activeTabId ? 'bg-white border-t border-l border-r' : ''}`}
            onClick={() => onSelect(file.id)}
          >
            <span className="truncate max-w-[150px]">{file.name}</span>
            <button
              onClick={e => {
                e.stopPropagation();
                onClose(file.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  }

  function FilePreview({ file }) {
    if (!file) return null;

    return (
      <div className="h-64 border-b">
        <iframe
          src={`https://localhost:5000/uploads/${file.file_path}`}
          className="w-full h-full"
          title={file.name}
        />
      </div>
    );
  }

  function closeTab(id) {
    setOpenTabs(prev => prev.filter(f => f.id !== id));

    setActiveTabId(prev =>
      prev === id ? openTabs[0]?.id ?? null : prev
    );
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
          <div
            className=" px-2 py-1 "
            style={{ width: leftWidth, backgroundColor: '#F1EDED', borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}
          >
            <FileManagerLeftSection
              width={leftWidth}
              selectedContainerId={selectedContainerId}
              onSelectContainer={(id) => {
                console.log('SELECTED CONTAINER ID:', id);
                setSelectedContainerId(id);

              }}
              onFilesUploaded={() => setRefreshTrigger(prev => prev + 1)}
            />

          </div>

          {/* Divider / Drag handle */}
          <div
            className="w-1 bg-gray-300 cursor-col-resize"
            onMouseDown={startResizing}
          />

          {/* Right section */}
          <div
            className="overflow-auto px-4 py-4 flex-1"
            style={{ backgroundColor: '#F7F2F2', borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}
          >
            <FileTabs
              openTabs={openTabs}
              activeTabId={activeTabId}
              onSelect={setActiveTabId}
              onClose={closeTab}
            />

            <FilePreview
              file={openTabs.find(f => f.id === activeTabId)}
            />

            <FileManagerRightSection
              selectedContainerId={selectedContainerId}
              refreshTrigger={refreshTrigger}
              onOpenFile={handleOpenFile}
            />

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
