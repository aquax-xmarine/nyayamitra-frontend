import React, { useState } from 'react';
import eyeOpen from '../assets/eye-opened.png';
import eyeClosed from '../assets/eye-closed.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // General error for top message box
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Clear previous errors
    setError('');
    setEmailError('');
    setPasswordError('');
    setLoading(true);

    // Check if both fields are empty
    if (!email && !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    // Basic validation
    if (!email) {
      setEmailError('Email is required');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      // Parse backend error response
      const errorMessage = err.response?.data?.error || 'Invalid email or password';

      // Check if error is related to email or password
      if (errorMessage.toLowerCase().includes('email') ||
        errorMessage.toLowerCase().includes('user not found')) {
        setEmailError('Incorrect email address');
      } else if (errorMessage.toLowerCase().includes('password') ||
        errorMessage.toLowerCase().includes('invalid credentials')) {
        setPasswordError('Incorrect password');
      } else {
        // Generic error - show in top error box
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-[450px] bg-white rounded-3xl shadow-lg px-20 py-12 pt-1 pb-1">

        {/* Header */}
        <div className="mb-8 pt-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-[11px]">
            Log in to manage your legal queries easily.
          </p>
        </div>
        <div className='pt-1' />

        {/* ERROR MESSAGE BOX - For general errors */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (error) setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Input your email"
              className={`placeholder:text-xs text-sm w-full px-3 py-3 border ${
                emailError ? 'border-red-300' : 'border-gray-300'
              } rounded-xl focus:outline-none focus:ring-2 ${
                emailError ? 'focus:ring-red-400' : 'focus:ring-gray-400'
              } focus:border-transparent transition-all text-gray-900 placeholder-gray-400`}
            />
            {/* Email Error Message */}
            {emailError && (
              <p className="text-red-600 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                  if (error) setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Input your password"
                className={`placeholder:text-xs text-sm w-full px-3 py-3 border ${
                  passwordError ? 'border-red-300' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 ${
                  passwordError ? 'focus:ring-red-400' : 'focus:ring-gray-400'
                } focus:border-transparent transition-all text-gray-900 placeholder-gray-400 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none' }}
              >
                <img
                  src={showPassword ? eyeOpen : eyeClosed}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="w-5 h-5 "
                />
              </button>
            </div>

            {/* Password Error Message */}
            {passwordError && (
              <p className="text-red-600 text-xs mt-1">{passwordError}</p>
            )}

            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => alert('Password reset functionality')}
                className=" transition-colors"
                style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none', fontSize: '11px', color: '#A39E9E' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#A39E9E'}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <div className='pt-1' />
          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="-mt-10 w-full bg-gray-900 text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6 pb-12">
          <p className="text-xs text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate("/signUp")}
              className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              style={{ border: 'none', background: 'transparent', outline: 'none', padding: 0 }}
            >
              Sign up here
            </button>
          </p>
        </div>

        <div className='pt-2' />

      </div>
    </div>
  );
}