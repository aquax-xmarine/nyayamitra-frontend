import { useState } from "react";  // Add this
import { useNavigate } from "react-router-dom";
import LoginNavbarAsk from '../component/NavBarProfileAsk';
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
    <div className='flex h-screen'>
      <div className='w-15 py-3 border-r'>
        <LoginNavbarIcon />
      </div>

      <div className='flex-1 py-4 h-full'>
        <LoginNavbarAsk
          onAskQuestion={handleAskQuestion}
          question={question}
          answer={answer}
          loading={loading}
          error={error}
        />
      </div>


      <div className='w-25 py-2'>
        <LoginNavbarProfile />
      </div>


    </div>

  );
};

export default Dashboard;
