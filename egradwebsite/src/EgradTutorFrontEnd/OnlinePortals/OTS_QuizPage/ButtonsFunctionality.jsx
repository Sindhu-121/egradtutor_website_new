import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "../Styles/RightSidebar.css";
import BASE_URL from "../../../apiConfig";

// This component manages the functionality of buttons in the right sidebar
const ButtonsFunctionality = ({
  activeQuestion,
  onQuestionSelect,
  questionStatus,
  seconds,
  setQuestionStatus,
  answeredCount,
  notAnsweredCount,
  answeredmarkedForReviewCount,
  markedForReviewCount,
  VisitedCount,
  questionData,
  updateQuestionStatus,
  onUpdateOption,
  option,
}) => {
  const [wtimer, setWTimer] = useState(0); // State to manage timer

  // Calculate remaining questions based on different counts
  const questions = questionData.questions ? questionData.questions.length : 0;
  const remainingQuestions =
    questions -
    VisitedCount -
    notAnsweredCount -
    answeredCount -
    markedForReviewCount -
    answeredmarkedForReviewCount;
  const NotVisited = remainingQuestions < 0 ? 0 : remainingQuestions;

  useEffect(() => {}, [activeQuestion]);
  // const [activeQuestion, setActiveQuestion] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [testName, setTestName] = useState("");
  const { testCreationTableId } = useParams();

  //---------------------Render buttons based on question status
  const renderQuestionButtons = Array.isArray(questionData.questions)
    ? questionData.questions.map((question, index) => {
        let className = "right_bar_Buttons ";
        const questionKey = question.id || index;
        // const questionStatusAtIndex = questionStatus && questionStatus[index];
        let questionStatusAtIndex;
        // Set the status of the first button to "notAnswered" by default
        if (index === 0 && !questionStatus[index]) {
          questionStatusAtIndex = "notAnswered";
        } else {
          questionStatusAtIndex = questionStatus[index];
        }

        if (questionStatusAtIndex === "answered") {
          className += " instruction-btn1";
        } else if (questionStatusAtIndex === "notAnswered") {
          className += " instruction-btn2";
        } else if (questionStatusAtIndex === "marked") {
          className += " instruction-btn3";
        } else if (questionStatusAtIndex === "Answered but marked for review") {
          className += " instruction-btn4";
        } else if (questionStatusAtIndex === "notVisited") {
          className += " instruction-btn5";
        }
        // Highlight the current question being displayed
        if (index === activeQuestion) {
          className += " active-question";
        }
        // Different tooltip text for each button
        let tooltipText = "";
        if (questionStatusAtIndex === "answered") {
          tooltipText = "Answered";
        } else if (questionStatusAtIndex === "notAnswered") {
          tooltipText = "Not Answered";
        } else if (questionStatusAtIndex === "marked") {
          tooltipText = "Marked for review";
        } else if (questionStatusAtIndex === "Answered but marked for review") {
          tooltipText = "Answered but marked for review";
        } else if (questionStatusAtIndex === "notVisited") {
          tooltipText = "Not Visited";
        }

        return (
          <li key={questionKey}>
            <button
              onClick={() => handleButtonClick(index + 1)}
              className={className}
              title={tooltipText}
            >
              {index + 1}
            </button>
          </li>
        );
      })
    : null;

  // Fetch user data
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/ughomepage_banner_login/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to headers for authentication
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchUserData();
  }, []);

  const [questionData1, setQuestionData1] = useState({ questions: [] });
  useEffect(() => {
    // Check if testCreationTableId is defined before making the request
    if (testCreationTableId) {
      fetchData();
    }
  }, [testCreationTableId]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${testCreationTableId}/${userData.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData1(data);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };
  useEffect(() => {
    fetchTestName();
  }, [testCreationTableId]); // Re-fetch test name when testCreationTableId changes

  const fetchTestName = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${testCreationTableId}/${userData.id}`
      );
      const data = await response.json();
      const testName = data.questions[0].TestName;
      setTestName(testName);
    } catch (error) {
      console.error("Error fetching test name:", error);
    }
  };

  const handleButtonClick = useCallback(
    async (questionNumber) => {
      const questionIndex = questionNumber - 1;

      try {
        const response = await fetch(
          `${BASE_URL}/QuizPage/questionOptions/${testCreationTableId}/${userData.id}`
        );
        const data = await response.json();

        const testName = data.questions[0].TestName;
        setTestName(testName);
        fetchData();

        // Update question status based on its current status
        const currentStatus = questionStatus[questionIndex];
        console.log("Current status:", currentStatus);

        if (
          currentStatus !== "marked" &&
          currentStatus !== "answered" &&
          currentStatus !== "Answered but marked for review"
        ) {
          const updatedQuestionStatus = [...questionStatus];
          updatedQuestionStatus[questionIndex] = "notAnswered";
          setQuestionStatus(updatedQuestionStatus);
        } else {
        }

        onQuestionSelect(questionNumber);

        // Update other necessary state or perform additional logic
        setAnsweredQuestions((prevAnsweredQuestions) => [
          ...prevAnsweredQuestions,
          questionNumber,
        ]);
        setIsPaused(false);

        // Optionally, you may update the option state in the parent component here
        onUpdateOption(null); // Assuming null means no option is selected

        // Log the active question number
        console.log("Active question number:", questionNumber);
      } catch (error) {
        console.error("Error fetching test name:", error);
      }
    },
    [
      questionStatus,
      setQuestionStatus,
      onQuestionSelect,
      answeredQuestions,
      onUpdateOption,
      testCreationTableId,
      userData.id,
    ]
  );

  // Proptypes for button functionality component
  ButtonsFunctionality.propTypes = {
    onQuestionSelect: PropTypes.func.isRequired,
    questionStatus: PropTypes.arrayOf(PropTypes.string),
    seconds: PropTypes.number, // Add the appropriate prop type
    setQuestionStatus: PropTypes.func.isRequired,
    answeredCount: PropTypes.number, // Add the appropriate prop type
    notAnsweredCount: PropTypes.number, // Add the appropriate prop type
    answeredmarkedForReviewCount: PropTypes.number, // Add the appropriate prop type
    markedForReviewCount: PropTypes.number, // Add the appropriate prop type
    VisitedCount: PropTypes.number, // Add the appropriate prop type
    selectedSubject: PropTypes.string, // Add the appropriate prop type
    updateButtonStatus: PropTypes.func, // Add the appropriate prop type
    data: PropTypes.object, // Add the appropriate prop type
    updateQuestionStatus: PropTypes.func.isRequired, // Add the prop type
    option: PropTypes.func.isRequired,
  };

  // Format time into hours, minutes, seconds
  const WformatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
  };

  // useEffect to manage timer
  useEffect(() => {
    const interval = setInterval(() => {
      setWTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Clear the interval and handle time-up logic when timer reaches 0
    if (wtimer <= 0) {
      clearInterval(interval);
      // Handle time-up logic here (e.g., navigate to a different component)
    }

    // Clean up the interval on component unmount or when navigating away
    return () => {
      clearInterval(interval);
    };
  }, [wtimer]);

  return (
    <>
      <div className="right-side-bar">
        <div className="rightSidebar-topHeader">
          <img
            title={userData.username}
            src={userData.imageData}
            alt={`Image ${userData.user_Id}`}
          />
          <p>Candidate Name: {userData.username}</p>
          <p key={testName.testCreationTableId}>Test Name: {testName}</p>
        </div>

        <div className="buttons_container">
          <div className="ques-btn">
            <ul className="btn-ul quesAns-btn">{renderQuestionButtons}</ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <h4 className="sidebar-footer-header">Legend:</h4>
          <div className="footer-btns">
            <div className="inst-btns">
              {" "}
              <button
                className="instruction-btn5 r_S_B_BTNS"
                title="VisitedCount"
              >
                {NotVisited}
              </button>
              <span>Not Visited</span>
            </div>
            <div className="inst-btns">
              <p className="instruction-btn1 r_S_B_BTNS" title="answeredCount">
                {answeredCount}
              </p>
              <span>Answered</span>
            </div>
            <div className="inst-btns">
              <p
                className="instruction-btn2 r_S_B_BTNS"
                title="notAnsweredCount"
              >
                {notAnsweredCount}
              </p>
              <span>Not Answered</span>
            </div>
            <div className="inst-btns">
              <p
                className="instruction-btn3 r_S_B_BTNS"
                title="answeredmarkedForReviewCount"
              >
                {answeredmarkedForReviewCount}
              </p>
              <span>Marked for Review</span>
            </div>
            <div className="inst-btns">
              <p
                className="instruction-btn4 r_S_B_BTNS"
                title="markedForReviewCount"
              >
                {markedForReviewCount}
              </p>
              <span>
                Answered & Marked for Review (will be considered for evaluation)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonsFunctionality;
