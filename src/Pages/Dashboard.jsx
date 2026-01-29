import { useState } from "react";  // Add this
import { useNavigate } from "react-router-dom";
import LoginNavbarAsk from '../component/AskQuestion.jsx';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import { askNyayaLM } from '../services/nyayalm';  // Add this


const Dashboard = () => {
  // Add these state variables
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Add this function
  const handleAskQuestion = async (userQuestion) => {
    setQuestion(userQuestion);
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const data = await askNyayaLM(userQuestion);

      if (data.success) {
        setAnswer(data.answer);
      } else {
        setError(data.error || 'Failed to get answer');
      }
    } catch (err) {
      setError('Error connecting to API. Make sure the backend is running!');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Left Sidebar - Icon Navigation */}
      <div className='w-16 border-r shrink-0 overflow-y-auto'>
        <div className='py-3 px-2'>
          <LoginNavbarIcon />
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-w-0 px-8 py-5'>
  
          <LoginNavbarAsk
            onAskQuestion={handleAskQuestion}
            question={question}
            answer={answer}
            loading={loading}
            error={error}
          />

        
      </div>

      {/* Right Sidebar - Profile */}
      <div className='w-30 shrink-0'>
        <div className='px-4 py-2'>
          <LoginNavbarProfile />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
