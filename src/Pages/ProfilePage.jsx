import EditProfile from '../component/EditProfile';
import LoginNavbarAsk from '../component/NavBarProfileAsk';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';
import { useNavigate } from 'react-router-dom';

const Profilepage = () => {
  const navigate = useNavigate();
  
  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Left Sidebar - Icon Navigation */}
      <div className='w-16 border-r shrink-0 overflow-y-auto'>
        <div className='py-3 px-2'>
          <LoginNavbarIcon
    onNewChat={() => navigate('/dashboard')}
    onToggleHistory={() => navigate('/dashboard', { state: { showHistory: true } })}
    onFileManager={() => navigate('/fileManager')}
    activeIcon={null}
/>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 overflow-auto min-w-0'>
        <div className='max-w-full px-4 py-4'>
          <LoginNavbarAsk />
          <EditProfile />
        </div>
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

export default Profilepage;

