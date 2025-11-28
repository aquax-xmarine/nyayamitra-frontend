import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import API_URL from '../config/api';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: ''
  });
  const [originalData, setOriginalData] = useState({
    name: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [nameError, setNameError] = useState('');
  const [messageProgress, setMessageProgress] = useState(100);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  // Auto-dismiss success messages after 3 seconds with progress bar
  useEffect(() => {
    if (message.type === 'success' && message.text) {
      setMessageProgress(100);
      
      // Animate progress bar
      const interval = setInterval(() => {
        setMessageProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setMessage({ type: '', text: '' });
            return 0;
          }
          return prev - (100 / 30); // 3000ms / 100ms intervals = 30 steps
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [message]);

  // Check if there are any changes
  const hasChanges = () => {
    // Check if name has changed
    const nameChanged = formData.name.trim() !== originalData.name.trim();
    
    // Check if a new photo was selected
    const photoChanged = selectedFile !== null;
    
    return nameChanged || photoChanged;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
    if (nameError) setNameError('');
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5000000) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Only JPEG, JPG, PNG, and GIF images are allowed' });
      return;
    }

    // Clear any previous messages
    setMessage({ type: '', text: '' });

    // Store the file and create preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // Clear previous errors
    setMessage({ type: '', text: '' });
    setNameError('');

    // Validate name field
    if (!formData.name || formData.name.trim() === '') {
      setNameError('Name must not be empty');
      return;
    }

    setLoading(true);

    try {
      // Upload profile picture first if a new one was selected
      if (selectedFile) {
        const uploadResponse = await userAPI.uploadProfilePicture(selectedFile);
        console.log('Upload response:', uploadResponse);
      }

      // Then update the profile name
      const response = await userAPI.updateProfile(formData);
      updateUser(response.user); // Update user in AuthContext
      
      // Update original data to reflect the saved state
      setOriginalData({
        name: formData.name
      });
      
      // Clear the selected file and preview after successful save
      setSelectedFile(null);
      setPreviewUrl(null);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Save error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get profile picture URL (with preview support)
  const getProfilePictureUrl = () => {
    // Show preview if user selected a new image
    if (previewUrl) {
      return previewUrl;
    }
    
    // Show uploaded profile picture
    if (user?.profile_picture) {
      return `${API_URL}${user.profile_picture}?t=${Date.now()}`;
    }
    
    // Default avatar with user's initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=000000&color=ffffff&size=200&bold=true`;
  };

  // Add loading check
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto -mt-6 text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto -mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit profile</h1>

      {/* Success/Error Message with Progress Bar */}
      {message.text && (
        <div className={`mb-4 rounded-lg overflow-hidden ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="p-3">
            <p className={`text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          </div>
          {/* Progress Bar - Only show for success messages */}
          {message.type === 'success' && (
            <div className="h-1 bg-green-200">
              <div 
                className="h-full bg-green-600 transition-all duration-100 ease-linear"
                style={{ width: `${messageProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Photo Section */}
      <div className="mb-6">
        <p className="text-xs text-gray-600 mb-1">Photo</p>
        <div className="flex items-center gap-4">
          <img
            src={getProfilePictureUrl()}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <label
            htmlFor="photo-upload"
            className="px-4 py-1.5 bg-black text-white text-xs rounded-[7px] hover:bg-gray-800 transition cursor-pointer"
            style={{ border: 'none', borderRadius: '7px', backgroundColor: '#000000', outline: 'none', fontSize: '11px', color: '#FFFFFF', padding: '4px 8px', fontWeight: 'normal' }}
          >
            Change
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handlePhotoSelect}
            className="hidden"
            disabled={loading}
          />
          
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3 mb-6">
        {/* Name Field - EDITABLE */}
        <div>
          <div className={`border ${nameError ? 'border-red-300' : 'border-gray-300'} rounded-lg pl-3 p-1`}>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-sm text-gray-800 focus:outline-none bg-transparent"
              disabled={loading}
              placeholder="Enter your name"
            />
          </div>
          {/* Name Error Message - OUTSIDE THE BOX */}
          {nameError && (
            <p className="text-red-600 text-xs mt-1">{nameError}</p>
          )}
        </div>

        {/* Email Field - READ ONLY */}
        <div className="border border-gray-200 bg-gray-50 rounded-lg pl-3 p-1">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full text-sm text-gray-500 focus:outline-none bg-transparent cursor-not-allowed"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={loading || !hasChanges()}
          className="px-8 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ border: 'none', borderRadius: '7px', backgroundColor: '#000000', outline: 'none', fontSize: '11px', color: '#FFFFFF', padding: '7px 20px', fontWeight: 'normal' }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}