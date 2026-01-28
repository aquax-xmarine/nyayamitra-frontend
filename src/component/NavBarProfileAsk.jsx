// import logo from "../assets/law.png";
// import { useState } from 'react';
// import ReactMarkdown from 'react-markdown';

// const LoginNavbarAsk = ({ onAskQuestion, question, answer, loading, error }) => {
//   const [inputValue, setInputValue] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!inputValue.trim()) {
//       alert('Please enter a question');
//       return;
//     }

//     onAskQuestion(inputValue);
//     // setInputValue(''); // Uncomment this if you want to clear input after submit
//   };

//   return (
//     <div className="h-full flex flex-col px-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">NyayaMitra</h1>
//         <p className="text-gray-600">Ask legal questions in English or Nepali</p>
//       </div>

//       {/* Question Input Form */}
//       <form onSubmit={handleSubmit} className="mb-6">
//         <div className="flex flex-col gap-3">
//           <textarea
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             placeholder="Ask your legal question here..."
//             className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
//             rows="4"
//             disabled={loading}
//           />
          
//           <button
//             type="submit"
//             disabled={loading}
//             className={`py-3 px-6 rounded-lg font-semibold transition-colors ${
//               loading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             {loading ? 'Getting Answer...' : 'Ask Question'}
//           </button>
//         </div>
//       </form>

//       {/* Loading Indicator */}
//       {loading && (
//         <div className="flex items-center justify-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="ml-4 text-gray-600">Processing your question...</p>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
//           <p className="text-red-700">❌ {error}</p>
//         </div>
//       )}

//       {/* Answer Display */}
//       {answer && !loading && (
//         <div className="flex-1 overflow-auto">
//           <div className="bg-green-50 border-l-4 border-green-500 rounded p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Question:</h3>
//             <p className="text-gray-700 mb-4">{question}</p>
            
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Answer:</h3>
//             <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
//           </div>
//         </div>
//       )}

//       {/* Empty State */}
//       {!answer && !loading && !error && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center text-gray-400">
//             <svg 
//               className="mx-auto h-24 w-24 mb-4" 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
//               />
//             </svg>
//             <p className="text-lg">Ask a question to get started</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginNavbarAsk;


import { useState } from 'react';
import ReactMarkdown from 'react-markdown';  // ← Add this import at the top

const LoginNavbarAsk = ({ onAskQuestion, question, answer, loading, error }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      alert('Please enter a question');
      return;
    }

    onAskQuestion(inputValue);
  };

  return (
    <div className="h-full flex flex-col px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">NyayaMitra</h1>
        <p className="text-gray-600">Ask legal questions in English or Nepali</p>
      </div>

      {/* Question Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your legal question here..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            rows="4"
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading}
            className={`py-3 px-6 rounded-lg font-semibold transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Getting Answer...' : 'Ask Question'}
          </button>
        </div>
      </form>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Processing your question...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Answer Display - WITH MARKDOWN */}
      {answer && !loading && (
        <div className="flex-1 overflow-auto">
          <div className="bg-green-50 border-l-4 border-green-500 rounded p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Question:</h3>
            <p className="text-gray-700 mb-4">{question}</p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Answer:</h3>
            
            {/* CHANGED: Use ReactMarkdown instead of <p> */}
            <div className="markdown-content text-gray-700">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!answer && !loading && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg 
              className="mx-auto h-24 w-24 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-lg">Ask a question to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginNavbarAsk;