import API_URL from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileAvatar({ size = 80 }) {
  const { user } = useAuth();

  const getProfilePictureUrl = () => {
    if (user?.profile_picture) {
      return `${API_URL}${user.profile_picture}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=000000&color=ffffff&size=${size}&bold=true`;
  };

  return (
    <img
      src={getProfilePictureUrl()}
      alt="profile"
      className="rounded-full object-cover"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
