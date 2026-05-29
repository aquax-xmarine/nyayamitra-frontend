import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginNavbarAsk from '../component/AskQuestion.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon.jsx';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import { useAuth } from '../context/AuthContext';


const Dashboard = () => {
  const location = useLocation();

  const isFileMode = location.state?.fileHistoryMode && location.state?.file;
  const isGlobalMode = location.state?.globalHistory;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questionFiles, setQuestionFiles] = useState([]);
  const { user } = useAuth();
  const newChatRef = useRef(null)
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState("newChat");
  console.log("activeIcon is:", activeIcon);

  const fileHistoryMode = location.state?.fileHistoryMode || false;
  const selectedFile = !fileHistoryMode ? (location.state?.file || null) : null;
  const historyFile = fileHistoryMode ? (location.state?.file || null) : null;




  const [view, setView] = useState('chat');
  const [showHistory, setShowHistory] = useState(false);
  // Handle initial showHistory from navigation state separately
  useEffect(() => {
    if (location.state?.showHistory === true) {
      setShowHistory(true);
      setActiveIcon("history");
    }
  }, []); // only on mount

  useEffect(() => {
  if (isGlobalMode) {
    setSelectedFile(null); // clear file context
  }
}, [isGlobalMode]);






  //  Simply receive question + answer from AskQuestion component
  const handleAskQuestion = (userQuestion, groqAnswer, files) => {
    if (groqAnswer) {
      //  Second call - answer is ready
      setAnswer(groqAnswer);
    } else {
      //  First call - show question + files immediately
      setQuestion(userQuestion);
      setQuestionFiles(files || []);
      setAnswer(''); // clear previous answer
    }

  };

  return (
    <div className='flex h-screen max-h-screen overflow-hidden relative'>
      <div className='w-16 border-r shrink-0 overflow-y-auto'>
        <div className='py-3 px-2'>
          <LoginNavbarIcon
            onNewChat={() => {
              newChatRef.current?.();
              setShowHistory(false);
              setActiveIcon("newChat");
            }}
            onToggleHistory={() => {
              console.log("onToggleHistory called, setting activeIcon to history");
              setShowHistory(prev => !prev);
              setActiveIcon("history");  // ← add this
            }}
            onFileManager={() => {
              setShowHistory(false);
              //setActiveIcon("fileManager");   // ✅ ADD THIS

              navigate("/fileManager");             // (or whatever your route is)
            }}
            activeIcon={activeIcon}
          // setActiveIcon={setActiveIcon}
          />
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${showHistory ? 'pl-78' : 'px-10'}`}>
        <LoginNavbarAsk
          onAskQuestion={handleAskQuestion}
          question={question}
          answer={answer}
          loading={loading}
          error={error}
          questionFiles={questionFiles}
          initialFile={selectedFile}
          user={user}
          onNewChatReady={(fn) => { newChatRef.current = fn; }}
          showHistory={showHistory}
          onCloseHistory={() => setShowHistory(false)}
          fileHistoryMode={fileHistoryMode}
          historyFile={historyFile}
        />
      </div>

      <div className='absolute top-0 right-0 w-30 z-10'>
        <div className='px-4 py-2'>
          <LoginNavbarProfile />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;