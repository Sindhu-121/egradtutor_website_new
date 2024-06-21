import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage";
import { ThemeProvider } from "./ThemesFolder/ThemeContext/Context";
import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/AboutUsPage/AboutUs";
import FAQ from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/FAQPage/FAQ";
import OTS_QuizPage from "./EgradTutorFrontEnd/OnlinePortals/OTS_QuizPage/OTS_QuizPage";
import Practice_QuestionBank_QuizPage from "./EgradTutorFrontEnd/OnlinePortals/OQB_PracticeQuizPage/Practice_QuestionBank_QuizPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WebSiteLandingPage />} />
          <Route
            path="/BranchHomePage/:Branch_Id"
            element={<BranchHomePage />}
          />
          <Route
            path="/ExamHomePage/:EntranceExams_Id"
            element={<ExamHomePage />}
          />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/OTS_QuizPage" element={<OTS_QuizPage />} />
          <Route path="/Practice_QuestionBank_QuizPage" element={<Practice_QuestionBank_QuizPage/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
