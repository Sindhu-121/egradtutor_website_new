import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage"

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<WebSiteLandingPage/>}/>
      <Route path="/BranchHomePage" element={<BranchHomePage/>}/>
      <Route path="/ExamHomePage" element={<ExamHomePage />}/>
      </Routes>
    </Router>
    
  );
}

export default App;
