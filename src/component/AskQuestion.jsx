import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SendIcon from '../assets/send.png';
import addIcon from '../assets/add.png';

const AskQuestion = ({ onAskQuestion, question, answer, loading, error, initialFile = null }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState(initialFile ? [initialFile] : []);
  const canSend = (!loading) && (inputValue.trim() || attachedFiles.length > 0);



  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
    }
  }, [inputValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('question', inputValue);

      // Loop over attached files
      for (let file of attachedFiles) {
        // Check if it's a real File (from input)
        if (file instanceof File) {
          formData.append('files', file);
        } else if (file.file_path) {
          // It's a FileManager file object → fetch it as Blob

          if (file.file_path) {
            const response = await fetch(`https://localhost:5000/uploads/${file.file_path}`);
            const blob = await response.blob();

            // Determine MIME type from file extension
            const extension = file.name.split('.').pop().toLowerCase();
            let mimeType = '';
            if (extension === 'pdf') mimeType = 'application/pdf';
            else if (extension === 'doc') mimeType = 'application/msword';
            else if (extension === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            else if (extension === 'txt') mimeType = 'text/plain';

            formData.append('files', new File([blob], file.name, { type: mimeType }));
          }
        }
      }






      const response = await fetch('https://localhost:5000/api/ask', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      console.log('Backend response:', data);

      // optional: show answer in UI
      // setAnswer(data.answer);

      setInputValue('');
      setAttachedFiles([]);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };


  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-regular text-gray-800">NYAYAMITRA</h1>
      </div>

      {/* Content from backend (TOP, scrollable) */}
      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="ml-4 text-gray-600">Processing your question...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {answer && !loading && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Question:</h3>
            <p className="text-gray-700 mb-4">{question}</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Answer:</h3>
            <div className="markdown-content text-gray-700">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Question Input (BOTTOM) */}
      <form onSubmit={handleSubmit} className="mt-auto py-4 pl-70 pr-50">


        <div className="flex items-end gap-2 border-2 border-gray-300 rounded-3xl p-2
                  focus-within:border-black">

          {/* Attachment button – LEFT */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="self-end w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 ml-5 mr-2"
            title="Attach file"
            style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none' }}
          >
            <img
              src={addIcon}
              alt="Send"
              className="w-5 h-5"
            />
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
                const filteredNewFiles = newFiles.filter(
                  f => !existingNames.has(f.name)
                );
                return [...prevFiles, ...filteredNewFiles];
              });


              // Reset input so same file can be selected again if needed
              e.target.value = null;
            }}

          />

          <div className="flex flex-col flex-1">
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1 ">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border border-gray-300 rounded-xl text-sm text-gray-600 px-2 py-2"
                  >
                    📄
                    <span className="truncate max-w-xs">{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
                      }
                      className="text-red-500 hover:text-red-700"
                      style={{ border: 'none', padding: 0, outline: 'none' }}
                    >
                      ✕
                    </button>
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
              disabled={loading}
              className="w-full px-0 py-2 focus:outline-none resize-none bg-transparent overflow-y-auto max-h-40"
              style={{ minHeight: '2.5rem' }}
            />
          </div>


          {/* Send button – RIGHT */}
          <button
            type="submit"
            disabled={!canSend}
            className={`self-end rounded-full w-10 h-10 flex items-center justify-center mr-2
    ${!canSend ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}
  `}
            title="Send"
            style={{ border: 'none', padding: 0, outline: 'none' }}
          >
            <img
              src={SendIcon}
              alt="Send"
              className="w-5 h-5"
            />
          </button>



        </div>
      </form>

    </div>
  );
};

export default AskQuestion;