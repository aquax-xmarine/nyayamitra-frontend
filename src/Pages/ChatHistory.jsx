// import { useState, useEffect } from 'react';
// import API_URL from '../config/api';

// const ChatHistory = ({ onSelectSession }) => {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/chats/sessions`, {
//           credentials: 'include'
//         });
//         const data = await res.json();
//         setSessions(data);
//       } catch (err) {
//         console.error('Failed to fetch sessions:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSessions();
//   }, []);

//   const deleteSession = async (e, id) => {
//     e.stopPropagation();
//     try {
//       await fetch(`${API_URL}/api/chats/sessions/${id}`, {
//         method: 'DELETE',
//         credentials: 'include'
//       });
//       setSessions(prev => prev.filter(s => s.id !== id));
//     } catch (err) {
//       console.error('Failed to delete session:', err);
//     }
//   };

//   if (loading) return <p className="text-gray-400 p-6">Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold text-gray-800 mb-6">Chat History</h1>
//       {sessions.length === 0 ? (
//         <p className="text-gray-400 text-sm">No chats yet.</p>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {sessions.map(session => (
//             <div
//               key={session.id}
//               onClick={() => onSelectSession(session.id)}
//               className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
//             >
//               <div>
//                 <p className="text-sm font-medium text-gray-800">{session.title}</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {new Date(session.created_at).toLocaleString()}
//                 </p>
//               </div>
//               <button
//                 onClick={(e) => deleteSession(e, session.id)}
//                 className="text-red-400 hover:text-red-600 text-xs ml-4"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatHistory;