
import React from "react";
// import Exam_Portal_Home_Page from "../../Exam_Portal_QuizApp/Exam_Portal_Home_Page";
// import Quiz_dashboard from "../../Exam_Portal_QuizApp/Quiz_dashboard";
// import Student_dashboard from "../../StudentDashboard/Student_dashboard";

const UgadminHome = () => {
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/userlogin";
  };

  return (
    <div>
      {userRole === "admin" && (
        <div>
          {/* <Quiz_dashboard /> */}
        </div>
      )}

      {userRole === "ugotsadmin" && (
        <div>
          {/* <Quiz_dashboard /> */}

        </div>
      )}

      {userRole === "ugadmin" && (
        <div>
          {/* <Quiz_dashboard /> */}
        </div>
      )}

      {userRole === "viewer" && (
        <div>
          {/* <Student_dashboard /> */}
        </div>
      )}
    </div>
  );
};

export default UgadminHome;
