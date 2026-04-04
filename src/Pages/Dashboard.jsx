import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginNavbarAsk from '../component/AskQuestion.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import { useAuth } from '../context/AuthContext';


const Dashboard = () => {
  const location = useLocation();


  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questionFiles, setQuestionFiles] = useState([]);
  const { user } = useAuth();
  const newChatRef = useRef(null)
  const navigate = useNavigate();

  const fileHistoryMode = location.state?.fileHistoryMode || false;
  const selectedFile = !fileHistoryMode ? (location.state?.file || null) : null;
  const historyFile = fileHistoryMode ? (location.state?.file || null) : null;




  const [view, setView] = useState('chat');
  const [showHistory, setShowHistory] = useState(
    () => location.state?.showHistory === true
  );


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
    <div className='flex h-screen overflow-hidden'>
      <div className='w-16 border-r shrink-0 overflow-y-auto'>
        <div className='py-3 px-2'>
          <LoginNavbarIcon
            onNewChat={() => {
              newChatRef.current?.();
              setShowHistory(false);  // ← add this
            }}
            onToggleHistory={() => setShowHistory(prev => !prev)}
          />
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${showHistory ? 'pl-20 pr-0' : 'px-10'}`}>
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

      <div className='w-30 shrink-0'>
        <div className='px-4 py-2'>
          <LoginNavbarProfile />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;