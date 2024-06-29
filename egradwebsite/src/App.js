import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './assets/actions/store';
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
import CoursePage from './EgradTutorFrontEnd/EgradTutorWebsit/CoursePages/CoursePage';
import UserLogin from './Login/UserLogin';
import StudentRegistrationPage from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/StudentRegistationPage';
import PasswordChangeForm from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PasswordChangeForm';
import SuperAdminLogin from './Login/SuperAdminLogin';
import UserDashboard from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UserDashboard ';
import PrivateRoute from './Login/PrivateRoute';

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
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/userloginn" element={<Login />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/UgadminHome" element={<UgadminHome />} />
              <Route path="/" element={<WebSiteLandingPage isEditMode={isEditMode} />} />
              <Route path="/BranchHomePage/:Branch_Id" element={<BranchHomePage isEditMode={isEditMode} />} />
              <Route path="/ExamHomePage/:EntranceExams_Id" element={<ExamHomePage isEditMode={isEditMode} />} />
              <Route path="/CoursePage/:Branch_Id/:Portale_Id" element={<CoursePage isEditMode={isEditMode} />} />
              <Route path="/AboutUs" element={<AboutUs isEditMode={isEditMode} />} />
              <Route path="/ContactUs" element={<ContactUs />} />
              <Route path="/Faq" element={<FAQ />} />
              <Route path="/linkpage/:Link_Id" element={<LinkPage />} />
              {/* New Login System */}
              <Route path="/UserLogin" element={<UserLogin />} />
              <Route path="/SuperAdminLogin" element={<SuperAdminLogin />} />
              <Route path="/Registation" element={<StudentRegistrationPage />} />
              <Route path="/login/:userId" element={<PasswordChangeForm />} />

              <Route path="/user-dashboard/:userId" element={<PrivateRoute>
                <UserDashboard />
              </PrivateRoute>} />
            </Routes>
          </Router>
        </Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
