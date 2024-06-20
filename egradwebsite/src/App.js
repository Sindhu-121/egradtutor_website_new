import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage"
import { ThemeProvider } from "./ThemesFolder/ThemeContext/Context";
import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/AboutUsPage/AboutUs";
import Login from "./Login/Login";
import AdminLogin from "./Login/AdminLogin";
import Register from "./Login/Register";



function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/userlogin" element={<Login/>}/>
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/Register" element={<Register/>} />
      <Route path="/" element={<WebSiteLandingPage/>}/>
      <Route path="/BranchHomePage/:Branch_Id" element={<BranchHomePage/>}/>
      <Route path="/ExamHomePage/:EntranceExams_Id" element={<ExamHomePage />}/>
      <Route path="/AboutUs" element={<AboutUs/>}/>
      
      </Routes>
    </Router>
     </ThemeProvider>

  );
}

export default App;
