import logo from "../assets/logo.png";
import add from "../assets/add.png";
import folder_img from "../assets/folder_img.png";
import { useNavigate } from "react-router-dom";

export default function LoginNavbarIcon() {
    const navigate = useNavigate();

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
                    alt="secondary"
                    onClick={() => navigate("/dashboard")}
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


        </div>
    );
};