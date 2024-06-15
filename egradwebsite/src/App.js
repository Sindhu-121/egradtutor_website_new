import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage"
import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/AboutUsPage/AboutUs";
import ContactUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/ContactUsPage/ContactUs"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebSiteLandingPage />} />

        <Route path="/BranchHomePage" element={<BranchHomePage />} />

        <Route path="/ExamHomePage" element={<ExamHomePage />} />
        <Route path="AboutUs" element={<AboutUs />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route />
      </Routes>
    </Router>

  );
}

export default App;
