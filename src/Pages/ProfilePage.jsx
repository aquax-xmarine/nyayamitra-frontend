import EditProfile from '../component/EditProfile';

import LoginNavbarAsk from '../component/NavBarProfileAsk';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';

const Profilepage = () => {
  return (
    <div className='flex h-screen'>
      <div className='w-15 py-3 border-r'>
        <LoginNavbarIcon />
      </div>

      <div className='flex-1 py-4 h-full'>
        <LoginNavbarAsk />
        <EditProfile />
      </div>


      <div className='w-25 py-2'>
        <LoginNavbarProfile />
      </div>


    </div>

  );
};

export default Profilepage;


