import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { containerAPI, fileAPI } from '../services/api';
import search_icon from '../assets/search_icon.png';
import library_icon from '../assets/library_icon.png';
import bookmark_icon from '../assets/bookmark_icon.png';
import recent_icon from '../assets/recent_icon.png';
import duplicate_icon from '../assets/duplicate_icon.png';
import trash_icon from '../assets/trash_icon.png';
import current_working_cases_icon from '../assets/current_working_cases_icon.png';
import right_arrow from '../assets/right_arrow.png';
import folder_img from '../assets/folder.png';
import '../css_styling/FileManagerLeftSection.css';

export default function FileManagerLeftSection({ width, onSelectContainer, selectedContainerId, onFilesUploaded }) {
    const [activeSection, setActiveSection] = useState(null);
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        section: null,
    });
    const handleRightClick = (e, section) => {
        e.preventDefault(); // 

        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            section,
        });
    };

    const fileInputRef = useRef(null);



    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (!selectedContainerId) {
            console.warn('No container selected');
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        formData.append('containerId', selectedContainerId);

        try {
            await fileAPI.uploadFiles(formData);
            console.log('Upload successful');


            // Trigger refresh
            if (onFilesUploaded) {
                onFilesUploaded();
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };


    const [trees, setTrees] = useState({
        library: [],
        workingCases: [],
    });

    const [libraryOpen, setLibraryOpen] = useState(false);
    const [workingCasesOpen, setWorkingCasesOpen] = useState(false);


    const toggleNode = (nodes, id) =>
        nodes.map(node =>
            node.id === id
                ? { ...node, open: !node.open }
                : {
                    ...node,
                    children: toggleNode(node.children, id),
                }
        );

    const toggle = (sectionKey, id) => {
        setTrees(prev => ({
            ...prev,
            [sectionKey]: toggleNode(prev[sectionKey], id),
        }));
    };





    const addChildNode = (nodes, parentId, newNode) =>
        nodes.map(node =>
            node.id === parentId
                ? { ...node, children: [...node.children, newNode], open: true }
                : { ...node, children: addChildNode(node.children, parentId, newNode) }
        );

    const setEditingNode = (nodes, id) =>
        nodes.map(node =>
            node.id === id
                ? { ...node, editing: true }
                : {
                    ...node,
                    children: setEditingNode(node.children, id),
                }
        );

    const updateNodeName = (nodes, id, name) =>
        nodes.map(node =>
            node.id === id
                ? { ...node, name }
                : { ...node, children: updateNodeName(node.children, id, name) }
        );

    const stopEditingNode = (nodes, id) =>
        nodes.map(node =>
            node.id === id
                ? { ...node, editing: false }
                : { ...node, children: stopEditingNode(node.children, id) }
        );


    const isRootSection =
        contextMenu.section === 'library' ||
        contextMenu.section === 'workingCases';


    function buildTree(rows) {
        const map = {};
        const roots = [];

        rows.forEach(row => {
            map[row.id] = {
                id: row.id,
                name: row.name,
                open: false,
                editing: false,
                children: [],
            };
        });

        rows.forEach(row => {
            if (row.parent_id) {
                map[row.parent_id]?.children.push(map[row.id]);
            } else {
                roots.push(map[row.id]);
            }
        });

        return roots;
    }

    useEffect(() => {
        async function loadContainers() {
            try {
                const [library, workingCases] = await Promise.all([
                    containerAPI.getContainers('library'),
                    containerAPI.getContainers('workingCases'),
                ]);

                setTrees({
                    library: buildTree(library),
                    workingCases: buildTree(workingCases),
                });
            } catch (err) {
                console.error('Failed to load containers', err);
            }
        }

        loadContainers();
    }, []);

    useEffect(() => {
        if (selectedContainerId) {


            // Check which section and open it
            const checkSection = (nodes) => {
                for (const node of nodes) {
                    if (node.id === selectedContainerId) return true;
                    if (node.children.length > 0 && checkSection(node.children)) return true;
                }
                return false;
            };

            if (checkSection(trees.library)) {
                setLibraryOpen(true);
                expandToNode('library', selectedContainerId);
            } else if (checkSection(trees.workingCases)) {
                setWorkingCasesOpen(true);
                expandToNode('workingCases', selectedContainerId);
            }
        }
    }, [selectedContainerId]);



    const expandNodePath = (nodes, targetId, path = []) => {
        for (const node of nodes) {
            if (node.id === targetId) {
                return [...path, node.id];
            }
            if (node.children.length > 0) {
                const found = expandNodePath(node.children, targetId, [...path, node.id]);
                if (found) return found;
            }
        }
        return null;
    };

    const expandToNode = (sectionKey, nodeId) => {
        setTrees(prev => {
            const path = expandNodePath(prev[sectionKey], nodeId);
            if (!path) return prev;

            let updated = [...prev[sectionKey]];

            // Open all nodes in the path except the last one (the target node itself)
            path.slice(0, -1).forEach(id => {
                updated = updated.map(node => setNodeOpen(node, id, true));
            });

            return {
                ...prev,
                [sectionKey]: updated
            };
        });
    };

    const setNodeOpen = (node, id, open) => {
        if (node.id === id) {
            return { ...node, open };
        }
        if (node.children.length > 0) {
            return {
                ...node,
                children: node.children.map(child => setNodeOpen(child, id, open))
            };
        }
        return node;
    };






    function CollectionNode({ node, level, sectionKey, onSelectContainer, selectedContainerId }) {
        return (
            <>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectContainer(node);
                        setActiveSection(null);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();



                        // open context menu
                        handleRightClick(e, { ...node, sectionKey });
                    }}

                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 
    ${selectedContainerId === node.id ? 'active' : ''}`}
                    style={{ paddingLeft: 23 + level * 15, fontWeight: 400 }}
                >
                    <img
                        src={right_arrow}
                        className={`w-2 h-4 transition-transform ${node.open ? 'rotate-90' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggle(sectionKey, node.id);
                            onSelectContainer(node);
                        }}
                    />
                    <img src={folder_img} alt="" className="w-3 h-3" />
                    {node.editing ? (
                        <input
                            autoFocus
                            value={node.name}
                            className="bg-white text-xs px-1 rounded outline-none border border-gray-400"
                            onChange={e => {
                                setTrees(prev => ({
                                    ...prev,
                                    [sectionKey]: updateNodeName(
                                        prev[sectionKey],
                                        node.id,
                                        e.target.value
                                    ),
                                }));

                            }}

                            onBlur={async (e) => {
                                console.log('BLUR FIRED');
                                const newName = e.target.value.trim();

                                setTrees(prev => ({
                                    ...prev,
                                    [sectionKey]: stopEditingNode(
                                        prev[sectionKey],
                                        node.id
                                    ),
                                }));

                                try {
                                    await containerAPI.updateContainerName(node.id, newName);
                                } catch (err) {
                                    console.error('Failed to rename container', err);
                                }
                            }}



                            onKeyDown={e => {
                                if (e.key === 'Enter') e.target.blur();
                            }}
                        />
                    ) : (
                        <span>{node.name}</span>
                    )}

                </button>

                {node.open &&
                    node.children.map(child => (
                        <CollectionNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            sectionKey={sectionKey}
                            onSelectContainer={onSelectContainer}
                            selectedContainerId={selectedContainerId}
                        />
                    ))}

            </>
        );
    }














    return (

        <div
            className=" px-3 pr-1 pt-1 -ml-2 relative h-full flex flex-col"
            style={{
                width: width, // now comes from props
                backgroundColor: '#ffffff', 
                 
                borderTopLeftRadius: '0.5rem',
                borderBottomLeftRadius: '0.5rem',
            }}
        >

            {/* 🔹 Hidden file input (lives here) */}
            <input
                type="file"

                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />

            {/*  FIXED HEADER - Image and Search */}
            <div className="flex flex-col gap-2 mt-3">

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

            {/*  SCROLLABLE BODY - All the buttons and folders */}

            <div className="flex flex-col gap-2 mt-4 pr-1 overflow-y-auto flex-1">
                {/* Library Button */}
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

                {libraryOpen &&
                    trees.library.map(node => (
                        <CollectionNode
                            key={node.id}
                            node={node}
                            level={1}
                            sectionKey="library"
                            onSelectContainer={onSelectContainer}
                            selectedContainerId={selectedContainerId}
                        />
                    ))}


                {/* WorkingCases Button */}

                <button
                    onClick={() => {
                        setActiveSection('workingCases');

                        setWorkingCasesOpen(prev => !prev);
                    }}
                    onContextMenu={(e) => handleRightClick(e, 'workingCases')}


                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 ${activeSection === 'workingCases' ? 'active' : ''
                        }`}
                    style={{
                        fontWeight: "400",
                    }}
                >

                    <img
                        src={right_arrow}
                        alt=""
                        className={`w-2 h-4 ml-5 transition-transform duration-200 ${workingCasesOpen ? 'rotate-90' : ''
                            }`}
                    />
                    <img src={current_working_cases_icon} alt="" className="w-3 h-3" />
                    <span >Current Working Cases</span>
                </button>

                {workingCasesOpen &&
                    trees.workingCases.map(node => (
                        <CollectionNode
                            key={node.id}
                            node={node}
                            level={1}
                            sectionKey="workingCases"
                            onSelectContainer={onSelectContainer}
                            selectedContainerId={selectedContainerId}
                        />
                    ))}



                {/* Bookmark Button */}
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


                {/* Recent Button */}
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


                {/* Duplicate Button */}
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




                {/* Trash Button */}
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
                                className="  pr-11 pl-1 py-2"
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

                                {/* Upload Button  */}
                                <button
                                    className="context-btn block w-full text-left py-1"
                                    onClick={() => {
                                        fileInputRef.current?.click();
                                        setContextMenu({ ...contextMenu, visible: false });
                                    }}
                                >
                                    Upload Files
                                </button>



                                {/* SubCollection Button */}
                                <button
                                    className="context-btn block w-full text-left py-1"
                                    onClick={async () => {
                                        const isRoot = typeof contextMenu.section === 'string';


                                        const section = isRoot

                                            ? contextMenu.section
                                            : contextMenu.section.sectionKey;

                                        const parent_id =
                                            !isRoot && contextMenu.section?.id
                                                ? contextMenu.section.id
                                                : null;


                                        if (section === 'library') setLibraryOpen(true);
                                        if (section === 'workingCases') setWorkingCasesOpen(true);

                                        try {
                                            const saved = await containerAPI.createContainer({
                                                name: 'New Subcollection',
                                                section,
                                                parent_id,
                                            });

                                            const newNode = {
                                                id: saved.id,     //  REAL UUID
                                                name: saved.name,
                                                editing: true,
                                                open: false,
                                                children: [],
                                            };

                                            setTrees(prev => {
                                                if (!parent_id) {
                                                    return {
                                                        ...prev,
                                                        [section]: [...prev[section], newNode],
                                                    };
                                                }

                                                return {
                                                    ...prev,
                                                    [section]: addChildNode(
                                                        prev[section],
                                                        parent_id,
                                                        newNode
                                                    ),
                                                };
                                            });

                                        } catch (err) {
                                            console.error('Failed to create container', err);
                                        }

                                        setContextMenu({ ...contextMenu, visible: false });
                                    }}





                                >
                                    New Subcollection
                                </button>


                                {/* Only show below for subcollections */}
                                {!isRootSection && (
                                    <>
                                        {/* Rename Button */}
                                        <button
                                            className="context-btn block w-full text-left py-1"
                                            onClick={() => {
                                                setTrees(prev => ({
                                                    ...prev,
                                                    [contextMenu.section.sectionKey]: setEditingNode(
                                                        prev[contextMenu.section.sectionKey],
                                                        contextMenu.section.id
                                                    ),
                                                }));
                                                setContextMenu({ ...contextMenu, visible: false });
                                            }}
                                        >
                                            Rename
                                        </button>


                                        {/* <button className="context-btn block w-full text-left py-1">
                                            Move To
                                        </button>
                                        <button className="context-btn block w-full text-left py-1">
                                            Copy To
                                        </button>
                                        <button className="context-btn block w-full text-left py-1">
                                            Delete Subcollection
                                        </button> */}
                                    </>
                                )}



                            </div>
                        </div>
                    </>
                )}


            </div>





        </div>
    );
}
