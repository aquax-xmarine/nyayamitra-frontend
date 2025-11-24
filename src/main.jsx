import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css'

import LandingPage from './Pages/LandingPage.jsx'
import Login from "./Pages/LoginPage.jsx";
import SignUp from "./Pages/SignUpPage.jsx";
import Profilepage from './Pages/ProfilePage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/profile" element={<Profilepage />} />
       
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
