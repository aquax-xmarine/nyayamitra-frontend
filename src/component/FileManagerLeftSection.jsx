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
import edit_name_icon from '../assets/editNameIcon.png';
import files_img from '../assets/files_img.png';
import restore_img from '../assets/reset.png';

export default function FileManagerLeftSection({ width, onSelectContainer, selectedContainerId, onFilesUploaded }) {
    const [activeSection, setActiveSection] = useState(null);
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        section: null,
    });
    const handleRightClick = (e, section) => {
        e.preventDefault();

        // Don't show context menu for Trash root folder
        if (section?.sectionKey === 'trash' && trees.trash[0]?.id === section.id) {
            return;
        }

        // Don't show context menu for bookmark and recent sections
        if (section?.sectionKey === 'bookmark' || section?.sectionKey === 'recent') {
            return;
        }

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

        // fallback to activeSection if uploadSection is undefined
        const sectionKey = fileInputRef.current?.uploadSection || activeSection;

        if (!selectedContainerId && !sectionKey) {
            console.warn('No container or section selected');
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        if (selectedContainerId) {
            formData.append('containerId', selectedContainerId);
        } else if (sectionKey) {
            formData.append('section', sectionKey); // send section for root
        }

        try {
            const response = await fileAPI.uploadFiles(formData);
            console.log('Upload successful', response);
            if (onFilesUploaded) onFilesUploaded();
        } catch (err) {
            console.error('Upload failed:', err.response?.data || err.message);
        }
    };


    const [trees, setTrees] = useState({
        library: [],
        workingCases: [],
        trash: [],
        bookmark: [],
        recent: [],
    });

    const [libraryOpen, setLibraryOpen] = useState(false);
    const [workingCasesOpen, setWorkingCasesOpen] = useState(false);

    const collectAllDescendantIds = (node) => {
        let ids = [node.id];
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                ids = ids.concat(collectAllDescendantIds(child));
            });
        }
        return ids;
    };


    const restoreSubcollection = async (nodeId) => {
        try {
            // 1. Fetch original location
            const originalSection = await containerAPI.getOriginalSection(nodeId);
            const originalParentId = await containerAPI.getOriginalParent(nodeId);

            // 2. Update container to original section and parent
            await containerAPI.updateContainerSection(nodeId, originalSection);
            await containerAPI.updateContainerParent(nodeId, originalParentId);

            // 3. Update state
            setTrees(prev => {
                const nodeToRestore = findNodeById(prev.trash, nodeId);
                if (!nodeToRestore) return prev;

                // Remove from Trash
                const updatedTrash = removeNode(prev.trash, nodeId);

                // Add to original section
                return {
                    ...prev,
                    trash: updatedTrash,
                    [originalSection]: originalParentId
                        ? addChildNode(prev[originalSection], originalParentId, nodeToRestore)
                        : [...prev[originalSection], nodeToRestore],
                };
            });
        } catch (err) {
            console.error('Failed to restore subcollection', err);
        }
    };




    const deleteSubcollection = async (nodeId, section) => {
        if (!nodeId) return;

        setTrees(prev => {
            // 1. Find the node first
            const nodeToMove = findNodeById(prev[section], nodeId);
            if (!nodeToMove) return prev;

            // 2. Remove node from its original section
            const sectionNodes = removeNode(prev[section], nodeId);

            // 3. Ensure trash root exists
            let trashRoot = prev.trash[0];
            if (!trashRoot) {
                trashRoot = { id: 'trashRoot', name: 'Trash', open: true, editing: false, children: [] };
            }

            // 4. Append the deleted node to trash root children
            const updatedTrash = [
                {
                    ...trashRoot,
                    children: [...trashRoot.children, { ...nodeToMove, sectionKey: 'trash' }],
                }
            ];

            return {
                ...prev,
                [section]: sectionNodes,
                trash: updatedTrash,
            };
        });

        try {
            //  Get the real Trash root from backend
            const trashRoots = await containerAPI.getContainers('trash');
            const trashRoot = trashRoots.find(r => !r.parent_id);

            if (!trashRoot) throw new Error('Trash root not found');

            // Recursively collect all descendant IDs including the parent
            const nodeToMove = findNodeById(trees[section], nodeId);
            const allIds = collectAllDescendantIds(nodeToMove);

            // 1. Save original location for all descendants
            await containerAPI.saveOriginalLocation(nodeId);

            // Only top node parent_id should change
            await containerAPI.updateContainerParent(nodeId, trashRoot.id);
            await containerAPI.updateContainerSection(nodeId, 'trash');

        
        } catch (err) {
            console.error('Failed to move container to trash', err);
        }
    };




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


    const isRootFolder = (section) => {
        if (typeof section === 'string') return true;

        // Check if this node is in the root level of any section
        if (section?.sectionKey) {
            const sectionTrees = trees[section.sectionKey];
            return sectionTrees.some(node => node.id === section.id);
        }

        return false;
    };


    const removeNode = (nodes, nodeId) =>
        nodes
            .filter(node => node.id !== nodeId)
            .map(node => ({
                ...node,
                children: removeNode(node.children, nodeId),
            }));


    const findNodeById = (nodes, id) => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children.length > 0) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    //converts flat structure returned by backend into tree structure for frontend
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
                const [library, workingCases, trash, bookmark, recent] = await Promise.all([
                    containerAPI.getContainers('library'),
                    containerAPI.getContainers('workingCases'),
                    containerAPI.getContainers('trash'),
                    containerAPI.getContainers('bookmark'),
                    containerAPI.getContainers('recent')
                ]);

                setTrees({
                    library: buildTree(library),
                    workingCases: buildTree(workingCases),
                    trash: buildTree(trash),
                    bookmark: buildTree(bookmark),
                    recent: buildTree(recent)
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
                        if (sectionKey !== 'bookmark' && sectionKey !== 'recent') {
                            toggle(sectionKey, node.id);
                        }
                        onSelectContainer(node);
                        console.log('Selected node:', node); 
                        setActiveSection(null);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();



                        // open context menu
                        handleRightClick(e, { ...node, sectionKey });
                    }}

                    className={`sidebar-btn px-3 py-1 text-xs flex items-center gap-2 
    ${selectedContainerId === node.id ? 'active' : ''}`}
                    style={{
                        paddingLeft: 23 + level * 15,
                        fontWeight: 400
                    }}
                >
                    {!(sectionKey === 'trash' && level > 0) && (
                        <img
                            src={right_arrow}
                            className={`w-2 h-4 transition-transform ${node.open ? 'rotate-90' : ''}`}
                            style={{ opacity: node.children.length === 0 ? 0.3 : 1 }}
                        />
                    )}
                    <img
                        src={
                            sectionKey === 'trash' && node.id === trees.trash[0]?.id
                                ? trash_icon
                                : folder_img
                        }
                        alt=""
                        className="w-3 h-3"
                    />
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
                    !(sectionKey === 'trash' && level > 0) && // Only hide Trash children deeper than level 1
                    node.children.map(child => (
                        <CollectionNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            sectionKey={sectionKey}
                            onSelectContainer={onSelectContainer}
                            selectedContainerId={selectedContainerId}
                        />
                    ))
                }

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
                onChange={(e) => handleFileUpload(e, fileInputRef.current.uploadSection)}
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

                {/* Render all library root folders */}
                {trees.library.map(node => (
                    <CollectionNode
                        key={node.id}
                        node={node}
                        level={0} // top level
                        sectionKey="library"
                        onSelectContainer={onSelectContainer}
                        selectedContainerId={selectedContainerId}
                    />
                ))}

                {/* Render all workingCases root folders */}
                {trees.workingCases.map(node => (
                    <CollectionNode
                        key={node.id}
                        node={node}
                        level={0} // top level
                        sectionKey="workingCases"
                        onSelectContainer={onSelectContainer}
                        selectedContainerId={selectedContainerId}
                    />
                ))}



                {/* Render Bookmark root */}
                {trees.bookmark.map(node => (
                    <CollectionNode
                        key={node.id}
                        node={node}
                        level={0}
                        sectionKey="bookmark"
                        onSelectContainer={onSelectContainer}
                        selectedContainerId={selectedContainerId}
                    />
                ))}

                {/* Render Recently Visited root */}
                {trees.recent.map(node => (
                    <CollectionNode
                        key={node.id}
                        node={node}
                        level={0}
                        sectionKey="recent"
                        onSelectContainer={onSelectContainer}
                        selectedContainerId={selectedContainerId}
                    />
                ))}








                {/* Render all trash root folders */}
                {trees.trash.map(node => (
                    <CollectionNode
                        key={node.id}
                        node={node}
                        level={0}
                        sectionKey="trash"
                        onSelectContainer={onSelectContainer}
                        selectedContainerId={selectedContainerId}
                    />
                ))}



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
                                {/* Show only Restore Subcollection for subfolders in Trash */}
                                {contextMenu.section?.sectionKey === 'trash' ? (
                                    <button
                                        className="context-btn block w-full text-left py-1"
                                        onClick={async () => {
                                            try {
                                                const nodeId = contextMenu.section.id;
                                                const originalParentSection = await containerAPI.getOriginalSection(nodeId);
                                                const originalParentId = await containerAPI.getOriginalParent(nodeId);

                                                await containerAPI.updateContainerSection(nodeId, originalParentSection);
                                                await containerAPI.updateContainerParent(nodeId, originalParentId);

                                                setTrees(prev => {
                                                    const nodeToRestore = findNodeById(prev.trash, nodeId);
                                                    const updatedTrash = removeNode(prev.trash, nodeId);

                                                    return {
                                                        ...prev,
                                                        trash: updatedTrash,
                                                        [originalParentSection]: originalParentId
                                                            ? addChildNode(prev[originalParentSection], originalParentId, nodeToRestore)
                                                            : [...prev[originalParentSection], nodeToRestore],
                                                    };
                                                });

                                                setContextMenu({ ...contextMenu, visible: false });
                                            } catch (err) {
                                                console.error('Failed to restore subcollection', err);
                                            }
                                        }}
                                    >
                                        <img src={restore_img} alt="restore" className="w-3 h-3 object-contain" />
                                        <span>Restore Subcollection</span>
                                    </button>
                                ) : (
                                    <>
                                        {/* Existing buttons for all other folders */}
                                        <button
                                            className="context-btn block w-full text-left py-1"
                                            onClick={() => {
                                                if (typeof contextMenu.section === 'string') {
                                                    fileInputRef.current.uploadSection = contextMenu.section;
                                                } else {
                                                    fileInputRef.current.uploadSection = null;
                                                }
                                                fileInputRef.current?.click();
                                                setContextMenu({ ...contextMenu, visible: false });
                                            }}
                                        >
                                            <img src={files_img} alt="upload" className="w-3 h-3 object-contain" />
                                            <span>Upload Files</span>
                                        </button>

                                        <button
                                            className="context-btn block w-full text-left py-1"
                                            onClick={async () => {
                                                const isRoot = typeof contextMenu.section === 'string';
                                                const section = isRoot
                                                    ? contextMenu.section
                                                    : contextMenu.section.sectionKey;
                                                const parent_id = !isRoot ? contextMenu.section?.id : null;

                                                if (section === 'library') setLibraryOpen(true);
                                                if (section === 'workingCases') setWorkingCasesOpen(true);

                                                try {
                                                    const saved = await containerAPI.createContainer({
                                                        name: 'New Subcollection',
                                                        section,
                                                        parent_id,
                                                    });

                                                    const newNode = {
                                                        id: saved.id,
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
                                                            [section]: addChildNode(prev[section], parent_id, newNode),
                                                        };
                                                    });
                                                } catch (err) {
                                                    console.error('Failed to create container', err);
                                                }

                                                setContextMenu({ ...contextMenu, visible: false });
                                            }}
                                        >
                                            <img src={folder_img} alt="new_folder" className="w-3 h-3 object-contain" />
                                            <span>New Subcollection</span>
                                        </button>

                                        {!isRootFolder(contextMenu.section) && (
                                            <>
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
                                                    <img src={edit_name_icon} alt="rename" className="w-3 h-3 object-contain" />
                                                    <span>Rename Subcollection</span>
                                                </button>

                                                <button
                                                    className="context-btn block w-full text-left py-1"
                                                    onClick={async () => {
                                                        const section = contextMenu.section.sectionKey;
                                                        const nodeId = contextMenu.section.id;
                                                        deleteSubcollection(nodeId, section);
                                                        setContextMenu({ ...contextMenu, visible: false });
                                                    }}
                                                >
                                                    <img src={trash_icon} alt="delete" className="w-3 h-3 object-contain" />
                                                    <span>Delete Subcollection</span>

                                                </button>
                                            </>
                                        )}
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
