import React, { useState, useRef } from 'react';

import contract_img from '../assets/contract_img.png';
import search_icon from '../assets/search_icon.png';
import library_icon from '../assets/library_icon.png';
import bookmark_icon from '../assets/bookmark_icon.png';
import recent_icon from '../assets/recent_icon.png';
import duplicate_icon from '../assets/duplicate_icon.png';
import trash_icon from '../assets/trash_icon.png';
import current_working_cases_icon from '../assets/current_working_cases_icon.png';
import right_arrow from '../assets/right_arrow.png';
import down_arrow from '../assets/down_arrow.png';
import '../css_styling/FileManagerLeftSection.css';

export default function FileManagerLeftSection({ width }) {
    const [activeSection, setActiveSection] = useState(null);
    const [openOverlay, setOpenOverlay] = useState(null);
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        section: null,
    });
    const handleRightClick = (e, section) => {
        e.preventDefault(); // 🚫 disable browser menu

        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            section,
        });
    };

    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        console.log('Uploaded files:', files);

        // TODO:
        // - save to state
        // - send to backend
        // - attach to current collection
    };

    const [subcollections, setSubcollections] = useState([]);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const inputRefs = useRef({});

    


    return (

        <div
            className=" px-3 pr-1 pt-1 -ml-2 relative "
            style={{
                width: width, // now comes from props
                backgroundColor: '#F1EDED',
                borderTopLeftRadius: '0.5rem',
                borderBottomLeftRadius: '0.5rem',
            }}
        >

            {/* 🔹 Hidden file input (lives here) */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
            {/* Header with icon and search */}
            <div className="flex flex-col gap-2">
                <img
                    src={contract_img}
                    alt="icon"
                    className="w-4 h-4 cursor-pointer self-end"
                />
                <button
                    className="w-full max-w-[98%] inline-flex items-center justify-between"
                    style={{ height: '26px', fontSize: '12px', backgroundColor: '#D9D9D9', color: '#4C4B4B', borderRadius: '7px', borderColor: '#4C4B4B' }}
                >
                    <span>Search</span>
                    <img
                        src={search_icon}
                        alt="search icon"
                        className="w-3 h-3"
                    />
                </button>
            </div>

            <div className="flex flex-col gap-2 mt-4 pr-1">
                <button
                    onClick={() => {
                        setActiveSection('library');
                        setLibraryOpen(prev => !prev);
                    }}
                    onContextMenu={(e) => handleRightClick(e, 'library')}
                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 ${activeSection === 'library' ? 'active' : ''
                        }`}
                    style={{
                        fontWeight: "400",
                    }}

                >
                    <img
                        src={right_arrow}
                        alt=""
                        className={`w-2 h-4 ml-5 transition-transform duration-200 ${libraryOpen ? 'rotate-90' : ''
                            }`}
                    />


                    <img src={library_icon} alt="" className="w-3 h-3" />
                    <span >My Library</span>
                </button>

                {activeSection === 'library' && subcollections.map(sub => (
                    <button
                        key={sub.id}
                        className="sidebar-btn px-3 py-1 text-xs flex items-center gap-2"
                        style={{
                            marginLeft: '15px',   //  indentation
                            fontWeight: '400',
                            opacity: 0.9,
                        }}
                    >
                        <img
                            src={right_arrow}
                            alt=""
                            className={`w-2 h-4 ml-5 transition-transform duration-200 ${libraryOpen ? 'rotate-90' : ''
                                }`}
                        />


                        {sub.editing ? (
                            <input
                                ref={el => (inputRefs.current[sub.id] = el)}
                                value={sub.name}
                                autoFocus
                                className="bg-white text-xs px-1 rounded outline-none border border-gray-400"
                                onChange={e => {
                                    setSubcollections(prev =>
                                        prev.map(s =>
                                            s.id === sub.id ? { ...s, name: e.target.value } : s
                                        )
                                    );
                                }}
                                onBlur={() => {
                                    setSubcollections(prev =>
                                        prev.map(s =>
                                            s.id === sub.id ? { ...s, editing: false } : s
                                        )
                                    );
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.target.blur();
                                    }
                                }}
                            />
                        ) : (
                            <span>{sub.name}</span>
                        )}
                    </button>
                ))}


                <button
                    onClick={() => setActiveSection('workingCases')}
                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 ${activeSection === 'workingCases' ? 'active' : ''
                        }`}
                    style={{
                        fontWeight: "400",
                    }}
                >
                    <img src={right_arrow} alt="" className="w-2 h-4 ml-5" />
                    <img src={current_working_cases_icon} alt="" className="w-3 h-3" />
                    <span >Current Working Cases</span>
                </button>




                <button
                    onClick={() => setActiveSection('bookmark')}
                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 ${activeSection === 'bookmark' ? 'active' : ''
                        }`}
                    style={{
                        fontWeight: "400",
                    }}
                >
                    <img src={bookmark_icon} alt="" className="w-3 h-3 ml-5" />
                    <span >Bookmark</span>
                </button>

                <button
                    onClick={() => setActiveSection('recent')}
                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 ${activeSection === 'recent' ? 'active' : ''
                        }`}
                    style={{
                        fontWeight: "400",
                    }}
                >
                    <img src={recent_icon} alt="" className="w-3 h-3 ml-5" />
                    <span>Recently Visited</span>
                </button>

                <button
                    onClick={() => setActiveSection('duplicate')}
                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 ${activeSection === 'duplicate' ? 'active' : ''
                        }`}
                    style={{
                        fontWeight: "400",
                    }}
                >
                    <img src={duplicate_icon} alt="" className="w-3 h-3 ml-5" />
                    <span >Duplicate Items</span>
                </button>

                <button
                    onClick={() => setActiveSection('trash')}
                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 ${activeSection === 'trash' ? 'active' : ''
                        }`}
                    style={{
                        fontWeight: "400",
                    }}
                >
                    <img src={trash_icon} alt="" className="w-3 h-3 ml-5" />
                    <span>Trash</span>
                </button>

                {contextMenu.visible && (
                    <>
                        {/* Click outside */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() =>
                                setContextMenu({ ...contextMenu, visible: false })
                            }
                        />

                        {/* Context Menu */}
                        <div
                            className="fixed z-50"
                            style={{
                                top: contextMenu.y,
                                left: contextMenu.x,
                            }}
                        >
                            <div
                                className=" px-8 py-2"
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
                                    className="context-btn block w-full text-left py-1"
                                    onClick={() => {
                                        setSubcollections(prev => [
                                            ...prev,
                                            {
                                                id: Date.now(),
                                                name: 'New Subcollection',
                                                editing: true,
                                            }
                                        ]);

                                        setContextMenu({ ...contextMenu, visible: false });
                                    }}
                                >
                                    New Subcollection
                                </button>

                                <button className="context-btn block w-full text-left py-1">
                                    Rename
                                </button>
                                <button className="context-btn block w-full text-left py-1">
                                    Move To
                                </button>
                                <button className="context-btn block w-full text-left py-1">
                                    Copy To
                                </button>
                                <button className="context-btn block w-full text-left py-1">
                                    Delete Subcollection
                                </button>
                            </div>
                        </div>
                    </>
                )}


            </div>





        </div>
    );
}
