import { useState, useEffect } from 'react';
import cross_img from '../assets/cross_img.png';
import API_URL from '../config/api';

export default function HistoryPanel({ onCloseHistory, onSelectSession }) {
    const [sessionList, setSessionList] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(
        () => sessionStorage.getItem('chatSessionId') || null
    );

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch(`${API_URL}/api/chats/sessions`, { credentials: 'include' });
                const data = await res.json();
                if (Array.isArray(data)) setSessionList(data);
            } catch (err) {
                console.error('Failed to fetch sessions:', err);
            }
        };
        fetchSessions();
    }, []);

    const handleSessionClick = async (session) => {
        if (session.document_id) {
            sessionStorage.setItem('documentId', session.document_id);
        }
        sessionStorage.setItem('chatSessionId', session.id);
        setActiveSessionId(session.id);

        const res = await fetch(`${API_URL}/api/chats/sessions/${session.id}/messages`, { credentials: 'include' });
        const data = await res.json();

        if (Array.isArray(data)) {
            onSelectSession({
                sessionId: session.id,
                documentId: session.document_id,
                messages: data.map((row) => ({
                    question: row.question,
                    answer: row.answer,
                    files: Array.isArray(row.files) ? row.files : []
                }))
            });
        }
        onCloseHistory();
    };

    return (
        <div className="fixed left-16 top-0 h-full w-72 bg-white border-r border-gray-100 z-50 flex flex-col">

            {/* Header */}
            <div className="px-5 pt-6 pb-4" style={{ position: 'relative' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">CHAT HISTORY</p>
                <button
                    onClick={onCloseHistory}
                    style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        position: 'absolute',
                        top: '15px',
                        right: '0px',
                        cursor: 'pointer'
                    }}
                >
                    <img src={cross_img} alt="close" className="w-4 h-4 object-contain" />
                </button>
                <div className="h-px bg-gray-100 mt-3" />
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto px-0 pb-6 flex flex-col gap-0 custom-scrollbar">
                {sessionList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        <p className="text-xs text-gray-400">No chats yet</p>
                    </div>
                ) : (
                    sessionList.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => handleSessionClick(session)}
                            className={`w-full text-left px-3 py-3 rounded-[15px] transition-all group hover:bg-gray-50`}
                            style={{
                                border: 'none',
                                outline: 'none',
                                background: activeSessionId === session.id ? '#f9fafb' : 'transparent'
                            }}
                        >
                            <p className="text-sm text-gray-700 truncate font-normal leading-snug group-hover:text-black transition-colors">
                                {session.title || 'Untitled Chat'}
                            </p>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}