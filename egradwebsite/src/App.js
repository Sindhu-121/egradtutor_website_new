import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebSiteLandingPage from './EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage';
import BranchHomePage from './EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage';
import ExamHomePage from './EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage';
import { ThemeProvider } from './ThemesFolder/ThemeContext/Context';
import AboutUs from './EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/AboutUsPage/AboutUs';
import ContactUs from './EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/ContactUs/ContactUs';

import Login from './Login/Login';
import AdminLogin from './Login/AdminLogin';
import Register from './Login/Register';
import UgadminHome from './Login/UgadminHome';
import LinkPage from './EgradTutorFrontEnd/EgradTutorWebsit/Footer/LinkPage';
import FAQ from './EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/FAQPage/FAQ';

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <ThemeProvider>
      <div>
        {isAdmin && (
          <button onClick={toggleEditMode}>
            {isEditMode ? 'Disable Edit' : 'Enable Edit'}
          </button>
        )}
        <Router>
          <Routes>
            <Route path="/userlogin" element={<Login />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/UgadminHome" element={<UgadminHome />} />
            <Route path="/" element={<WebSiteLandingPage isEditMode={isEditMode} />} />
            <Route path="/BranchHomePage/:Branch_Id" element={<BranchHomePage isEditMode={isEditMode} />} />
            <Route path="/ExamHomePage/:EntranceExams_Id" element={<ExamHomePage isEditMode={isEditMode} />} />
            <Route path="/AboutUs" element={<AboutUs isEditMode={isEditMode} />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/Faq" element={<FAQ/>} />
            <Route path="/linkpage/:Link_Id" element={<LinkPage/>} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
