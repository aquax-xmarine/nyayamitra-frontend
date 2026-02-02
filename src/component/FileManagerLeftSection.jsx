import React from 'react';
import contract_img from '../assets/contract_img.png'; 
import search_icon from '../assets/search_icon.png';

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


        </div>
    );
}
