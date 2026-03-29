import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SendIcon from '../assets/send.png';
import addIcon from '../assets/add.png';
import logo from '../assets/logo.png';
import API_URL from '../config/api';
import remarkGfm from 'remark-gfm';


const AskQuestion = ({ onAskQuestion, question, answer, loading, error, initialFile = null, questionFiles = [], user, sessionIdToLoad = null }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]); // list of {question, answer, files}
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState(initialFile ? [initialFile] : []);
  const [documentHashes, setDocumentHashes] = useState([]);
  const bottomRef = useRef(null);
  const [documentId, setDocumentId] = useState(null);

  //  Use isLoading (local) not loading (prop)
  const canSend = (!isLoading) && (inputValue.trim() || attachedFiles.length > 0);

  const [sessionId, setSessionId] = useState(
    () => localStorage.getItem('chatSessionId') || null
  );


  const displayedAnswer = answer?.mode === 'summary' ? answer.summary : answer?.answer || answer;

  const getProfilePictureUrl = () => {
    if (user?.profile_picture) {
      return `${API_URL}${user.profile_picture}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=000000&color=ffffff&size=80&bold=true`;
  };

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (!sessionIdToLoad) return;

    const loadSession = async () => {
      console.log('📂 Loading session:', sessionIdToLoad);
      try {
        const res = await fetch(`${API_URL}/api/chats/sessions/${sessionIdToLoad}/messages`, {
          credentials: 'include'
        });
        const data = await res.json();

        // Convert DB rows to messages state format
        const loaded = data.map(row => ({
          question: row.question,
          answer: row.answer,
          files: []
        }));

        setMessages(loaded);
        setSessionId(sessionIdToLoad);
        console.log('✅ Session loaded:', loaded.length, 'messages');
      } catch (err) {
        console.error('Failed to load session:', err);
      }
    };

    loadSession();
  }, [sessionIdToLoad]);

  useEffect(() => {
  if (!sessionId) return;

  const loadMessages = async () => {
    console.log('📂 Loading messages for session:', sessionId);
    try {
      const res = await fetch(`${API_URL}/api/chats/sessions/${sessionId}/messages`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.log('No messages found for session');
        return;
      }

      const loaded = data.map(row => ({
        question: row.question,
        answer: row.answer,
        files: []
      }));

      setMessages(loaded);
      console.log('✅ Messages loaded:', loaded.length);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  loadMessages();
}, []); // empty array — only runs once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && attachedFiles.length === 0 && !documentId) return;

    const currentQuestion = inputValue;
    const currentFiles = [...attachedFiles];

    setMessages(prev => [...prev, { question: currentQuestion, answer: null, files: currentFiles }]);
    setInputValue('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const activeContainerId = documentId || crypto.randomUUID();

      // Step 1: Upload files to Node DB
      const newFiles = currentFiles.filter(f => f instanceof File);
      if (newFiles.length > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append('source', 'chat');
        newFiles.forEach(file => uploadFormData.append('files', file));
        const uploadRes = await fetch(`${API_URL}/api/files/upload`, {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData
        });
        const uploadData = await uploadRes.json();
        console.log('Upload result:', uploadData.files);
      }

      // Step 2: Send to Python
      const formData = new FormData();
      formData.append('question', currentQuestion);
      formData.append('document_id', activeContainerId);
      for (const file of currentFiles) {
        if (file instanceof File) formData.append('files', file);
      }

      const response = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();

      const newDocumentId = data.document_id || activeContainerId;
      setDocumentId(newDocumentId);

      const answerText = data?.mode === 'summary' ? data.summary : data?.answer || 'No answer found.';

      // Step 3: Create session if first message, then save Q&A
      // Step 3: Create session if first message, then save Q&A
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        console.log('🆕 Creating new chat session...');
        const sessionRes = await fetch(`${API_URL}/api/chats/sessions`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentQuestion.slice(0, 50),
            document_id: newDocumentId
          })
        });
        const sessionData = await sessionRes.json();
        console.log('📦 Session creation response:', sessionData); // ADD
        currentSessionId = sessionData.id;
        localStorage.setItem('chatSessionId', currentSessionId);
        console.log('🆔 currentSessionId:', currentSessionId);    // ADD
        setSessionId(currentSessionId);
        console.log('✅ Session created:', currentSessionId);
      }

      console.log('💾 Saving message, currentSessionId:', currentSessionId); // ADD

      // Save Q&A pair to DB
      await fetch(`${API_URL}/api/chats/sessions/${currentSessionId}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, answer: answerText })
      });
      console.log('✅ Message saved to DB');

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], answer: answerText };
        return updated;
      });

    } catch (err) {
      console.error('Submit failed:', err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], answer: 'Something went wrong. Please try again.' };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      <div>
        <h1 className="text-xl font-regular text-gray-800 py-5 leading-none">NYAYAMITRA</h1>
      </div>

      <div className="flex-1 overflow-auto pl-70 pr-50 -mt-10">

        {messages.map((msg, index) => (
          <div key={index}>
            {/* Question bubble */}
            <div className="flex justify-end mb-6">
              <div className="flex flex-col gap-2 items-end max-w-[70%]">
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end mr-11">
                    {msg.files.map((file, i) => (
                      <a
                        key={i}
                        href={file.file_path ? `https://localhost:5000/uploads/${file.file_path}` : URL.createObjectURL(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-100 border border-slate-300 text-slate-700 px-3 py-2 rounded-[7px] text-xs font-medium hover:bg-slate-200 transition-colors shadow-sm"
                      >
                        📄
                        <span className="truncate max-w-xs">{file.name}</span>
                        <span className="text-slate-400 uppercase tracking-wider ml-1">
                          {file.name.split('.').pop()}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 items-start">
                  <div className="bg-slate-200 border border-slate-300 rounded-2xl rounded-tr-sm px-5 py-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">You</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{msg.question}</p>
                  </div>
                  <img src={getProfilePictureUrl()} alt="User" className="w-8 h-8 shrink-0 rounded-[7px] object-cover" />
                </div>
              </div>
            </div>

            {/* Answer bubble */}
            {msg.answer && (
              <div className="flex justify-start mb-8">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 border border-black rounded-[7px]">
                    <img src={logo} alt="NyayaMitra" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">NyayaMitra Response</p>
                    <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="mb-2 leading-relaxed text-gray-700" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 mb-2 text-gray-700" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-5 mb-2 text-gray-700" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="mb-1" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-semibold text-slate-800" {...props} />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1 className="text-lg font-semibold mb-2" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-md font-semibold mb-2" {...props} />
                          ),
                          code: ({ node, ...props }) => (
                            <code className="bg-gray-100 px-1 rounded text-sm" {...props} />
                          ),
                        }}
                      >
                        {msg.answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start mb-6 gap-3">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 border border-black rounded-[7px]">
              <img src={logo} alt="NyayaMitra" />
            </div>
            <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Analysing...</p>
              <div className="flex gap-1 items-center h-4">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>


      <form onSubmit={handleSubmit} className="mt-auto py-4 pl-70 pr-50">
        <div className="flex items-end gap-2 border-2 border-gray-300 rounded-3xl p-2 focus-within:border-black">

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="self-end w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 ml-5 mr-2"
            title="Attach file"
            style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none' }}
          >
            <img src={addIcon} alt="Add" className="w-5 h-5" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            multiple
            onChange={(e) => {
              const newFiles = Array.from(e.target.files);
              setAttachedFiles((prevFiles) => {
                const existingNames = new Set(prevFiles.map(f => f.name));
                return [...prevFiles, ...newFiles.filter(f => !existingNames.has(f.name))];
              });
              e.target.value = null;
            }}
          />

          <div className="flex flex-col flex-1">
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 border border-gray-300 rounded-xl text-sm text-gray-600 px-2 py-2">
                    📄
                    <span className="truncate max-w-xs">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                      style={{ border: 'none', padding: 0, outline: 'none' }}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={attachedFiles.length > 0 ? '' : 'Ask your legal question here...'}
              rows="1"
              disabled={isLoading} //  use isLoading
              className="w-full px-0 py-2 focus:outline-none resize-none bg-transparent overflow-y-auto max-h-40"
              style={{ minHeight: '2.5rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={!canSend}
            className={`self-end rounded-full w-10 h-10 flex items-center justify-center mr-2 ${!canSend ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
            title="Send"
            style={{ border: 'none', padding: 0, outline: 'none' }}
          >
            <img src={SendIcon} alt="Send" className="w-5 h-5" />
          </button>

        </div>
      </form>
    </div >
  );
};

export default AskQuestion;