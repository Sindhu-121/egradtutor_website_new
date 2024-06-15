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



function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
      <Route path="/" element={<WebSiteLandingPage/>}/>
      <Route path="/BranchHomePage" element={<BranchHomePage/>}/>
      <Route path="/ExamHomePage" element={<ExamHomePage />}/>
      <Route path="/AboutUs" element={<AboutUs/>}/>
      </Routes>
    </Router>
     </ThemeProvider>

  );
}

export default App;
