import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

import './index.css'

import LandingPage from './Pages/LandingPage.jsx'
import Login from "./Pages/LoginPage.jsx";
import SignUp from "./Pages/SignUpPage.jsx";
import Profilepage from './Pages/ProfilePage.jsx';
import Onboarding from './Pages/Onboarding.jsx';
import Dashboard from './Pages/Dashboard.jsx'
import FileManager from './Pages/FileManager.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fileManager" element={<FileManager />} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)