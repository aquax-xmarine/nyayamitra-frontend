import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export default function LoginNavbarProfile() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setIsOverlayOpen(false);
    };

    // Get profile picture URL with default avatar
    const getProfilePictureUrl = () => {
        if (user?.profile_picture) {
            return `${API_URL}${user.profile_picture}`;
        }
        // Default avatar with user's initials (smaller size for navbar)
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=000000&color=ffffff&size=80&bold=true`;
    };

    return (
        <div className="flex items-center justify-start p-2 w-40">
            <div className="h-9 w-9">
                <img
                    src={getProfilePictureUrl()}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                />
            </div>

            <button
                className="z-50"
                onClick={() => setIsOverlayOpen(!isOverlayOpen)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#000000'}}
            >
                {isOverlayOpen ? <SlArrowUp /> : <SlArrowDown />}
            </button>

            {/* Overlay Button */}
            {isOverlayOpen && (
                <>
                    {/* Background overlay to close when clicking outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOverlayOpen(false)}
                    />

                    {/* The actual button */}
                    <div className="absolute right-2 top-12 z-50">
                        <button
                            onClick={handleLogout}
                            className="bg-white border border-gray-300 rounded-lg px-2 py-2 shadow-lg hover:bg-gray-50"
                            style={{ border: 'none', borderRadius: '7px', background: '#000000', outline: 'none', fontSize: '11px', color: '#FFFFFF', marginTop: '10px', marginRight: '20px'}}
                        >
                            Log out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}