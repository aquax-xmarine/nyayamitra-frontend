import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

export default function History() {
    const [sessionList, setSessionList] = useState([]);
    const navigate = useNavigate();

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

    return (
        <div className="flex flex-col h-full px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Chat History</p>
            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex-1 overflow-y-auto flex flex-col gap-0 custom-scrollbar">
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
                            onClick={() => {
                                sessionStorage.setItem('chatSessionId', session.id);
                                if (session.document_id) {
                                    sessionStorage.setItem('documentId', session.document_id);
                                }
                                navigate('/dashboard');
                            }}
                            className="w-full text-left px-3 py-3 rounded-[15px] hover:bg-gray-50 transition-all group"
                            style={{ border: 'none', outline: 'none', background: 'transparent' }}
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