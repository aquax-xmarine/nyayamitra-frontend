import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginNavbarAsk from '../component/AskQuestion.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const location = useLocation();
  const selectedFile = location.state?.file || null;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questionFiles, setQuestionFiles] = useState([]);
  const { user } = useAuth();

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
          <LoginNavbarIcon />
        </div>
      </div>

      <div className='flex-1 flex flex-col min-w-0 px-8'>
        <LoginNavbarAsk
          onAskQuestion={handleAskQuestion}
          question={question}
          answer={answer}
          loading={loading}
          error={error}
          questionFiles={questionFiles}
          initialFile={selectedFile}
          user={user}
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