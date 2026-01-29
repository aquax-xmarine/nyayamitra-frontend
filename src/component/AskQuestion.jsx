import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SendIcon from '../assets/send.png';

const AskQuestion = ({ onAskQuestion, question, answer, loading, error }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      alert('Please enter a question');
      return;
    }

    onAskQuestion(inputValue);
    setInputValue(''); // Clear input after submission
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
        <div className="flex items-center gap-2 border-2 border-gray-300 rounded-3xl p-2
                  focus-within:border-black">

          {/* Attachment button – LEFT */}
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 ml-5 mr-2"
            title="Attach file"
            style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none' }}
          >
            📎
          </button>

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your legal question here..."
            rows="1"
            disabled={loading}
            className="flex-1 px-2 py-2 focus:outline-none resize-none bg-transparent overflow-y-auto max-h-40 custom-scrollbar"
            style={{ minHeight: '2.5rem' }}
          />

          {/* Send button – RIGHT */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full w-10 h-10 flex items-center justify-center disabled:bg-white mr-2"
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