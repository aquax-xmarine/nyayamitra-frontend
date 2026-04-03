import logo from "../assets/logo.png";
import add from "../assets/add.png";
import folder_img from "../assets/folder_img.png";
import { useNavigate, useLocation } from "react-router-dom";
import recent from "../assets/recent_icon.png";

export default function LoginNavbarIcon({ onNewChat, onToggleHistory }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex flex-col items-center justify-center gap-5"

            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#A39E9E' }}
        >
            <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src={logo}
                    alt="logo"
                    onClick={() => navigate("/dashboard")}
                    className="w-8 h-7 object-contain border border-black rounded-[7px] cursor-pointer"
                />
            </div>

            <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src={add}
                    alt="new chat"
                    onClick={() => {
                        // Clear session storage so dashboard starts fresh
                        sessionStorage.removeItem('documentId');
                        sessionStorage.removeItem('chatSessionId');
                        onNewChat?.();
                        navigate("/dashboard");
                    }}
                    className="w-9 h-8 p-1 object-contain cursor-pointer"
                />
            </div>

            <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src={folder_img}
                    alt="secondary"
                    onClick={() => navigate("/fileManager")}
                    className="w-12 h-11 p-1 object-contain cursor-pointer"
                />
            </div>


            {/* New Chat
            <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src={folder_img}
                    alt="new chat"
                    onClick={() => {
                        if (onNewChat) {
                            onNewChat(); // on dashboard, clears the chat
                        } else {
                            navigate("/dashboard"); // on other pages, just go to dashboard
                        }
                    }}
                    className="w-12 h-11 p-1 object-contain cursor-pointer"
                />
            </div> */}


            <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src={recent}
                    alt="history"
                    onClick={onToggleHistory}
                    className="w-9 h-8 p-1 object-contain cursor-pointer"
                />
            </div>


        </div>
    );
};