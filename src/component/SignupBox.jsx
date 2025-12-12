import { useState } from 'react';
import eyeOpen from '../assets/eye-opened.png';
import eyeClosed from '../assets/eye-closed.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Make sure this import exists

export default function SignUpCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Add name field if needed
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth(); // Add this line

  // Password strength checker
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 'none', text: '', color: '' };

    let strength = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };

    strength = Object.values(checks).filter(Boolean).length;

    if (strength <= 2) return { strength: 'weak', text: 'Weak', color: 'text-red-600' };
    if (strength <= 3) return { strength: 'medium', text: 'Medium', color: 'text-yellow-600' };
    if (strength <= 4) return { strength: 'good', text: 'Good', color: 'text-blue-600' };
    return { strength: 'strong', text: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = checkPasswordStrength(password);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setLoading(true);

    // Check if all fields are empty
    if (!email && !password && !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (passwordStrength.strength === 'weak') {
      setPasswordError('Password is too weak. Use a mix of uppercase, lowercase, numbers, and special characters');
      setLoading(false);
      return;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Call the actual signup function from AuthContext
      await signup(email, password, name || email.split('@')[0]);

      // Clear onboarding state for fresh start
      localStorage.removeItem("onboardingStep");

      navigate('/onboarding');
    } catch (err) {
      // Handle specific error messages from backend
      const errorMessage = err.response?.data?.error || 'Registration failed';

      if (errorMessage.toLowerCase().includes('email')) {
        setEmailError('Email already exists or is invalid');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center">
      <div className="w-[450px] bg-white rounded-3xl shadow-lg px-20 py-1 pt-0 pb-0">

        {/* Header */}
        <div className="mb-4 pt-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Welcome!
          </h1>
          <p className="text-gray-600 text-[11px]">
            Manage your legal queries easily.
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
              className="block text-sm font-semibold text-gray-900 mb-1"
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
              className={`placeholder:text-xs text-sm w-full px-3 py-3 border ${emailError ? 'border-red-300' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-400' : 'focus:ring-gray-400'
                } focus:border-transparent transition-all text-gray-900 placeholder-gray-400`}
            />
            {emailError && (
              <p className="text-red-600 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-1"
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
                className={`placeholder:text-xs text-sm w-full px-3 py-3 border ${passwordError ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl focus:outline-none focus:ring-2 ${passwordError ? 'focus:ring-red-400' : 'focus:ring-gray-400'
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
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-1">
                <p className={`text-xs ${passwordStrength.color} font-semibold`}>
                  Password strength: {passwordStrength.text}
                </p>

                <p className="text-[10px] text-gray-500 mt-1">
                  Must have: 8+ characters, uppercase, lowercase, number, special character
                </p>
              </div>
            )}

            {passwordError && (
              <p className="text-red-600 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError('');
                  if (error) setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Confirm your password"
                className={`placeholder:text-xs text-sm w-full px-3 py-3 border ${confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl focus:outline-none focus:ring-2 ${confirmPasswordError ? 'focus:ring-red-400' : 'focus:ring-gray-400'
                  } focus:border-transparent transition-all text-gray-900 placeholder-gray-400 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none' }}
              >
                <img
                  src={showConfirmPassword ? eyeOpen : eyeClosed}
                  alt={showConfirmPassword ? "Hide password" : "Show password"}
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Real-time password match indicator */}
            {confirmPassword && (
              <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}

            {confirmPasswordError && (
              <p className="text-red-600 text-xs mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <div className='pt-1' />
          {/* Register Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="-mt-10 w-full bg-gray-900 text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4 pb-8">
          <p className="text-xs text-gray-600">
            Already a member?{' '}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              style={{ border: 'none', background: 'transparent', outline: 'none', padding: 0 }}
            >
              Log in
            </button>
          </p>
        </div>

        <div className='pt-2' />

      </div>
    </div>
  );
}