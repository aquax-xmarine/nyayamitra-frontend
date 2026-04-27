import logo from "../assets/logo.png";
import add from "../assets/add.png";
import folder_img from "../assets/folder_img.png";
import { useNavigate, useLocation} from "react-router-dom";
import recent from "../assets/recent_icon.png";

export default function LoginNavbarIcon({ onNewChat, onToggleHistory, onFileManager,activeIcon }) {
    const navigate = useNavigate();
    const location = useLocation();

    // // Sync active icon with route changes
    // useEffect(() => {
    //     if (location.pathname === "/dashboard") setActiveIcon?.("dashboard");
    //     else if (location.pathname === "/fileManager") setActiveIcon?.("fileManager");
    // }, [location.pathname]);

    const iconWrapperClass = (iconName) => {
  let isActive = activeIcon === iconName;

  // ✅ override ONLY for fileManager
  if (iconName === "fileManager") {
    isActive = location.pathname === "/fileManager";
  }

  return `w-10 h-9 flex items-center justify-center rounded-[7px] cursor-pointer ${
    isActive ? "border border-black rounded-[9px]" : ""
  }`;
};

    return (
        <div
            className="flex flex-col items-center justify-center gap-10"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#A39E9E' }}
        >
            {/* Logo */}
            <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src={logo}
                    alt="logo"
                    onClick={() => navigate("/dashboard")}
                    className="w-10 h-9 object-contain rounded-[7px] cursor-pointer"
                />
            </div>

            {/* New Chat */}
            <div
                className={iconWrapperClass("newChat")}
                onClick={() => {
                    sessionStorage.removeItem('documentId');
                    sessionStorage.removeItem('chatSessionId');
                    // setActiveIcon?.("newChat");
                    onNewChat?.();
                    navigate("/dashboard");
                }}
            >
                <img src={add} alt="new chat" className="w-8 h-7 object-contain" />
            </div>

            {/* File Manager */}
            <div
                className={iconWrapperClass("fileManager")}
                onClick={() => {
                    onFileManager?.();
                }}
            >
                <img src={folder_img} alt="secondary" className="w-20 h-19 object-contain" />
            </div>

            {/* History */}
            <div
                className={iconWrapperClass("history")}
                onClick={() => {
                   
                    // navigate("/chat-history");
                    onToggleHistory?.();
                }}
            >
                <img src={recent} alt="history" className="w-8 h-7 object-contain" />
            </div>
        </div>
    );
}