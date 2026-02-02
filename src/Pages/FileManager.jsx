import { useState, useRef } from 'react';
import LoginNavbarAsk from '../component/NavBarProfileAsk.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import FileManagerLeftSection from '../component/FileManagerLeftSection.jsx';

export default function FileManager() {
  const containerRef = useRef(null);

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
            style={{ width: leftWidth, backgroundColor: '#F1EDED',  borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem'  }}
          >
            <FileManagerLeftSection width={leftWidth}/>
          </div>

          {/* Divider / Drag handle */}
          <div
            className="w-1 bg-gray-300 cursor-col-resize"
            onMouseDown={startResizing}
          />

          {/* Right section */}
          <div
            className="overflow-auto px-4 py-4 flex-1"
            style={{ backgroundColor: '#F7F2F2',  borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem'}}
          >
           
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
