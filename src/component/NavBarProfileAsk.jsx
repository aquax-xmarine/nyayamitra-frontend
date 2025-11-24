import logo from "../assets/law.png";


export default function LoginNavbarAsk() {
  
    return (
        <div className="flex items-center justify-center p-1 w-full gap-3 px-7 mb-20 h-9">
            <button
              className="w-full px-3 py-4 border border-gray-500 focus:outline-none focus:border-transparent transition-all text-gray-400 text-left hover:border-gray-600 flex items-center gap-2"
              style={{ fontSize: '12px', borderRadius: '7px', borderColor: '#000000' }}
            >
              <img src={logo} alt="Logo" className="w-4 h-4 rounded-[7px]" />
              Ask NyayaMitra
            </button>
        </div>
    );
};
