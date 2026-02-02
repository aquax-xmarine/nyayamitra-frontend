import React from 'react';
import contract_img from '../assets/contract_img.png';
import search_icon from '../assets/search_icon.png';
import library_icon from '../assets/library_icon.png';
import bookmark_icon from '../assets/bookmark_icon.png';
import recent_icon from '../assets/recent_icon.png';
import duplicate_icon from '../assets/duplicate_icon.png';
import trash_icon from '../assets/trash_icon.png';
import current_working_cases_icon from '../assets/current_working_cases_icon.png';

export default function FileManagerLeftSection({ width }) {
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
            {/* Header with icon and search */}
            <div className="flex flex-col gap-2">
                <img
                    src={contract_img}
                    alt="icon"
                    className="w-4 h-4 cursor-pointer self-end"
                />
                <button
                    className="w-full max-w-[98%] inline-flex items-center justify-between"
                    style={{ height: '24px', fontSize: '12px', backgroundColor: '#D9D9D9', color: '#4C4B4B', borderRadius: '7px', borderColor: '#4C4B4B' }}
                >
                    <span>Search</span>
                    <img
                        src={search_icon}
                        alt="search icon"
                        className="w-3 h-3"
                    />
                </button>
            </div>

            <div className="flex flex-col gap-2 mt-4 pr-1 pl-5">
                <button
                    className="px-3 py-1 text-xs rounded flex items-center gap-2"
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                        cursor: "pointer",
                        fontWeight: "400",
                        outline: "none"
                    }}
                >
                    <img src={library_icon} alt="" className="w-3 h-3" />
                    <span>My Library</span>
                </button>

                <button
                    className="px-3 py-1 text-xs rounded flex items-center gap-2"
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                        cursor: "pointer",
                        fontWeight: "400",
                        outline: "none"

                    }}
                >
                    <img src={current_working_cases_icon} alt="" className="w-3 h-3" />
                    <span>Current Working Cases</span>
                </button>

                <button
                    className="px-3 py-1 text-xs rounded flex items-center gap-2"
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                        cursor: "pointer",
                        fontWeight: "400",
                        outline: "none"
                    }}
                >
                    <img src={bookmark_icon} alt="" className="w-3 h-3" />
                    <span>Bookmark</span>
                </button>

                <button
                    className="px-3 py-1 text-xs rounded flex items-center gap-2"
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                        cursor: "pointer",
                        fontWeight: "400",
                        outline: "none"
                    }}
                >
                    <img src={recent_icon} alt="" className="w-3 h-3" />
                    <span>Recently Visited</span>
                </button>

                <button
                    className="px-3 py-1 text-xs rounded flex items-center gap-2"
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                        cursor: "pointer",
                        fontWeight: "400",
                        outline: "none"
                    }}
                >
                    <img src={duplicate_icon} alt="" className="w-3 h-3" />
                    <span>Duplicate Items</span>
                </button>

                <button
                    className="px-3 py-1 text-xs rounded flex items-center gap-2"
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                        cursor: "pointer",
                        fontWeight: "400",
                        outline: "none"
                    }}
                >
                    <img src={trash_icon} alt="" className="w-3 h-3" />
                    <span>Trash</span>
                </button>
            </div>



        </div>
    );
}
