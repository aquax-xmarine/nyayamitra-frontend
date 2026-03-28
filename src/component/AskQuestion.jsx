import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SendIcon from '../assets/send.png';
import addIcon from '../assets/add.png';
import logo from '../assets/logo.png';
import API_URL from '../config/api';
import remarkGfm from 'remark-gfm';


const AskQuestion = ({ onAskQuestion, question, answer, loading, error, initialFile = null, questionFiles = [], user }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState(initialFile ? [initialFile] : []);
  const [documentHashes, setDocumentHashes] = useState([]);

  //  Use isLoading (local) not loading (prop)
  const canSend = (!isLoading) && (inputValue.trim() || attachedFiles.length > 0);


  const displayedAnswer = answer?.mode === 'summary' ? answer.summary : answer?.answer || answer;

  const getProfilePictureUrl = () => {
    if (user?.profile_picture) {
      return `${API_URL}${user.profile_picture}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=000000&color=ffffff&size=80&bold=true`;
  };


  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true); //  show spinner
      const formData = new FormData();
      formData.append('question', inputValue);
      const filesToSend = [...attachedFiles];

      //  Show question + files immediately before API call
      onAskQuestion(inputValue, null, filesToSend);

      setInputValue('');
      setAttachedFiles([]);



      for (let file of filesToSend) {
        if (file instanceof File) {
          formData.append('files', file);
        } else if (file.file_path) {
          const response = await fetch(`https://localhost:5000/uploads/${file.file_path}`);
          const blob = await response.blob();
          const extension = file.name.split('.').pop().toLowerCase();
          let mimeType = '';
          if (extension === 'pdf') mimeType = 'application/pdf';
          else if (extension === 'doc') mimeType = 'application/msword';
          else if (extension === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          else if (extension === 'txt') mimeType = 'text/plain';
          formData.append('files', new File([blob], file.name, { type: mimeType }));
        }
      }

      const response = await fetch('https://localhost:5000/api/ask', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      console.log('Backend response:', data);

      onAskQuestion(inputValue, data, filesToSend);

      if (data.answer) {
        onAskQuestion(inputValue, data.answer, filesToSend); // pass attached files
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsLoading(false); //  always stop spinner
    }
  };

  return (
    <div className="h-full flex flex-col">

      <div>
        <h1 className="text-xl font-regular text-gray-800 py-5 leading-none">NYAYAMITRA</h1>
      </div>

      <div className="flex-1 overflow-auto pl-70 pr-50 -mt-10">


        {error && (
          <div className=" p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700"> {error}</p>
          </div>
        )}

        {/* Question bubble */}
        {question && (
          <div className="flex justify-end mb-6">
            <div className="flex flex-col gap-2 items-end max-w-[70%]">


              {/* Files above bubble */}
              {questionFiles && questionFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end mr-11">
                  {questionFiles.map((file, index) => (
                    <a
                      key={index}
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

              {/* Question bubble - formal dark navy */}
              <div className="flex gap-3 items-start">
                {/* Light card - mirroring answer style */}
                <div className="bg-slate-200 border border-slate-300 rounded-2xl rounded-tr-sm px-5 py-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    You
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {question}
                  </p>
                </div>

                {/* User avatar badge - right side */}
                <img
                  src={getProfilePictureUrl()}
                  alt="User"
                  className="w-8 h-8 shrink-0   rounded-[7px] object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Answer card */}
        {displayedAnswer && !isLoading && (
          <div className="flex justify-start mb-8">
            <div className="flex gap-3 max-w-[80%]">

              {/* Formal N badge */}
              <div className="w-8 h-8 flex items-center justify-center shrink-0 border border-black rounded-[7px]">
                <img
                  src={logo}
                  alt="NyayaMitra"

                ></img>


              </div>

              {/* Light card with border */}
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  NyayaMitra Response
                </p>
                <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none
  prose-headings:text-slate-800 prose-headings:font-semibold
  prose-p:text-gray-700 prose-p:leading-relaxed
  prose-strong:text-slate-800 prose-strong:font-semibold
  prose-ul:list-disc prose-ul:pl-5 prose-ul:text-gray-700
  prose-ol:list-decimal prose-ol:pl-5
  prose-li:marker:text-slate-400
  prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({ node, ...props }) => (
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '0.5rem' }} {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '0.5rem' }} {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li style={{ marginBottom: '0.25rem' }} {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong style={{ fontWeight: '600', color: '#1e293b' }} {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p style={{ marginBottom: '0.5rem' }} {...props} />
                      ),
                    }}
                  >
                    {displayedAnswer}
                  </ReactMarkdown>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start mb-6 gap-3">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 border border-black rounded-[7px]">
              <img
                src={logo}
                alt="NyayaMitra"

              />

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