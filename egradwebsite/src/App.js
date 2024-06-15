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



function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
      <Route path="/" element={<WebSiteLandingPage/>}/>
      <Route path="/BranchHomePage" element={<BranchHomePage/>}/>
      <Route path="/ExamHomePage" element={<ExamHomePage />}/>
      </Routes>
    </Router>
     </ThemeProvider>

  );
}

export default App;
