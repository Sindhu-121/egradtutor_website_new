import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<WebSiteLandingPage/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;
