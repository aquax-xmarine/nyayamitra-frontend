import cat from "../assets/car.jpg"
import { useState } from 'react';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    username: '0x9c905a55b14158338df375003fc2fe3d4d1ee88',
    name: 'miri',
    email: 'mirisuki@gmail.com'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
  };

  const handlePhotoChange = () => {
    console.log('Change photo clicked');
  };

  return (
    <div className="max-w-2xl mx-auto -mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit profile</h1>

      {/* Photo Section */}
      <div className="mb-6">
        <p className="text-xs text-gray-600 mb-1">Photo</p>
        <div className="flex items-center gap-4">
          <img 
            src={cat} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover"
          />
          <button 
            onClick={handlePhotoChange}
            className="px-4 py-1.5 bg-black text-white text-xs rounded-[7px] hover:bg-gray-800 transition"
            style={{ border: 'none', borderRadius: '7px', backgroundColor: '#000000', outline: 'none', fontSize: '11px', color: '#FFFFFF', padding: '4px 8px', fontWeight: 'normal' }}
          >
            Change
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3 mb-6">
        {/* Username Field */}
        <div className="border border-gray-300 rounded-lg pl-3 p-1">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full text-sm text-gray-600 focus:outline-none bg-transparent"
          />
        </div>

        {/* Name Field */}
        <div className="border border-gray-300 rounded-lg pl-3 p-1">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full text-sm text-gray-800 focus:outline-none bg-transparent"
          />
        </div>

        {/* Email Field */}
        <div className="border border-gray-300 rounded-lg pl-3 p-1">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-sm text-gray-600 focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button 
          onClick={handleSave}
          className="px-8 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
          style={{ border: 'none', borderRadius: '7px', backgroundColor: '#000000', outline: 'none', fontSize: '11px', color: '#FFFFFF', padding: '7px 20px', fontWeight: 'normal' }}
        >
          Save
        </button>
      </div>
    </div>
  );
}