import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ButtonsFunctionality from "./ButtonsFunctionality";
// import Tooltip from "@mui/material/Tooltip";
// import { Tooltip } from '@mui/material';

import "../Styles/Paper.css";
import { MdOutlineTimer } from "react-icons/md";
import { useRef } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import BASE_URL from "../../../apiConfig";
import defaultImage from "../../../assets/defaultImage.png";


const OTS_QuizPage = () => {
  const [image, setImage] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [questionData, setQuestionData] = useState({ questions: [] });
  const [value, setValue] = useState("");
  const { subjectId, testCreationTableId, userId, question_id, user_Id } =
    useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questionStatus, setQuestionStatus] = useState(
    Array.isArray(questionData)
      ? [
          Array(questionData.questions.length).fill("notAnswered")[0],
          ...Array(questionData.questions.length - 1).fill("notAnswered"),
        ]
      : []
  );
  const [answeredCount, setAnsweredCount] = useState(0);
  const [notAnsweredCount, setNotAnsweredCount] = useState(0);
  const [answeredmarkedForReviewCount, setAnsweredmarkedForReviewCount] =
    useState(0);
  const [markedForReviewCount, setMarkedForReviewCount] = useState(0);
  const [VisitedCount, setVisitedCount] = useState(0);
  const questions = questionData.questions ? questionData.questions.length : 0;
  const [showExamSumary, setShowExamSumary] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questionData.length).fill("")
  );
  const [clickCount, setClickCount] = useState(0);
  const [answeredQuestionsMap, setAnsweredQuestionsMap] = useState({});
  const [selectedAnswersMap1, setSelectedAnswersMap1] = useState({});
  const [selectedAnswersMap2, setSelectedAnswersMap2] = useState({});
  const [selectedAnswersMap3, setSelectedAnswersMap3] = useState({});
  const calculateResult = () => {};
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScoreCount] = useState({ totalMarks: 0, netMarks: 0 });
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [testDetails, setTestDetails] = useState([]);
  const [option, setOption] = useState({ ans: null });
  // ======================================================================

  //----------logo_image_fetching_start---------
  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Logo/image`, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  useEffect(() => {
    fetchImage();
  }, []);
  //---------logo_image_fetching_end-------------

  // ======================================================================

  //-----------open_close_rightsidebar_toggle_start-------------
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  //------------open_close_rightsidebar_toggle_end---------------

  // ======================================================================

  //----------------Mouse_leftClick_disable_start------------------
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  //----------------Mouse_leftClick_disable_end------------------

  // ======================================================================

  //---------Keyboard_disabled_For_numberplate_inputFields_start-------------
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault(); // Prevent default keyboard action
      event.stopPropagation();
    };
    // Attach event listener to intercept keydown events
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  //---------Keyboard_disabled_For_numberplate_inputFields_end-------------

  // ======================================================================

  //--------------------Counts_functionality_start---------------------
  const remainingQuestions =
    questions -
    VisitedCount -
    notAnsweredCount -
    answeredCount -
    markedForReviewCount -
    answeredmarkedForReviewCount;

  const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
  const calculateQuestionCounts = () => {
    let answered = 0;
    let notAnswered = 0;
    let markedForReview = 0;
    let answeredmarkedForReviewCount = 0;
    let VisitedCount = 0;
    let NotVisited = 0;
    questionStatus.forEach((status, index) => {
      if (status === "answered") {
        answered++;
      } else if (status === "notAnswered") {
        notAnswered++;
      } else if (status === "marked") {
        markedForReview++;
      } else if (status === "Answered but marked for review") {
        answeredmarkedForReviewCount++;
      } else if (status === "notVisited") {
        VisitedCount++;
      }
    });

    return {
      answered,
      notAnswered,
      markedForReview,
      answeredmarkedForReviewCount,
      VisitedCount,
    };
  };
  const updateCounters = () => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let markedForReview = 0;
    let Visited = 0;

    // If questionStatus is empty, set notAnswered count to 1
    if (questionStatus.length === 0) {
      notAnswered = 1;
    } else {
      // Otherwise, count the occurrences of "notAnswered" status
      questionStatus.forEach((status) => {
        if (status === "answered") {
          answered++;
        } else if (status === "notAnswered") {
          notAnswered++;
        } else if (status === "marked") {
          marked++;
        } else if (status === "Answered but marked for review") {
          markedForReview++;
        } else if (status === "notVisited") {
          Visited++;
        }
      });
    }
    // Update the state with the counts
    setAnsweredCount(answered);
    setNotAnsweredCount(notAnswered);
    setAnsweredmarkedForReviewCount(marked);
    setMarkedForReviewCount(markedForReview);
    setVisitedCount(Visited);
  };
  //--------------------Counts_functionality_end---------------------

  // ======================================================================

  //---------questionSelect_OnClicking_OnButton_functionality_start---------------
  const handleQuestionSelect = async (questionNumber) => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${testCreationTableId}/${userData.id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuestionData(data);

      const updatedQuestionStatus = [...questionStatus];
      const updatedIndex = questionNumber - 1; // Calculate the updated index

      setCurrentQuestionIndex(updatedIndex); // Update the current question index
      updatedQuestionStatus[updatedIndex] = "notAnswered"; // Update the question status at the updated index
      setActiveQuestion(updatedIndex); // Set the active question to the updated index

      // Extract the useranswer value from the response
      let useranswer = null;

      if (
        data.questions[questionNumber - 1].useranswer &&
        data.questions[questionNumber - 1].useranswer.ans !== null
      ) {
        useranswer = data.questions[questionNumber - 1].useranswer.ans;
      }

      // Check if the question is answered
      let isAnswered = useranswer !== null;

      // If useranswer is null, update isAnswered to false
      if (useranswer === null) {
        isAnswered = false;
      }
      // Log the entire response data for debugging
      console.log(`Question ${questionNumber} - Response Data:`, data);
      console.log(`Question ${questionNumber} - User Answer:`, useranswer);
      console.log(`Question ${questionNumber} - Is Answered:`, isAnswered);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };
  //---------questionSelect_OnClicking_OnButton_functionality_end---------------

  // ======================================================================

  const fetchQuestionCount = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/TestResultPage/getStudentMarks/${testCreationTableId}/${userData.id}`
      );
      const data = await response.json();
      setScoreCount(data);
    } catch (error) {
      console.error("Error fetching question count:", error);
    }
  };

  // ======================================================================
  // -----------------TIMER FUNCTION_start--------------
  const [timer, setTimer] = useState(0);
  const [timers, setTimers] = useState(
    Array(questionData.questions.length).fill(0)
  );

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
  };

  useEffect(() => {
    setTimer(timers[currentQuestionIndex] || 0);
    let interval;
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentQuestionIndex, timers]);

  // ---------------END_OF_TIMER FUNCTION--------------------
  // ======================================================================

  // ------------overall_time_functionality_start-------------------
  const [wtimer, setWTimer] = useState(0);
  const WformatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
  };

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setWTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [wtimer]);
  // ------------overall_time_functionality_end-------------------
  // ======================================================================

  const onAnswerSelected1 = (optionIndex) => {
    const questionId = questionData.questions[currentQuestionIndex].question_id;
    const charcodeatopt = String.fromCharCode("a".charCodeAt(0) + optionIndex);

    const questionIndex = currentQuestionIndex + 1;
    console.log("Selected option index:", optionIndex);

    const selectedOption =
      questionData.questions[currentQuestionIndex].options[optionIndex];
    // Retrieve the option ID
    const optionId = selectedOption.option_id;

    // Log the selected option index ID and option ID
    console.log("Selected option index:", optionIndex);
    console.log("Selected option ID:", optionId);

    setSelectedAnswersMap1((prevMap) => ({
      ...prevMap,
      [currentQuestion.question_id]: optionIndex,
    }));

    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[activeQuestion] = optionIndex;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const onAnswerSelected2 = (optionIndex) => {
    const questionId = questionData.questions[currentQuestionIndex].question_id;
    const charcodeatopt = String.fromCharCode("a".charCodeAt(0) + optionIndex);

    // Retrieve the existing selected options for the current question
    const existingSelection = selectedAnswersMap2[questionId] || [];

    // Check if the selected option is already in the existing selection
    const isSelected = existingSelection.includes(optionIndex);

    // Update the selection based on whether the option was already selected or not
    const updatedSelection = isSelected
      ? existingSelection.filter((index) => index !== optionIndex) // Deselect the option if already selected
      : [...existingSelection, optionIndex]; // Select the option if not already selected

    // Update the selected answers map with the updated selection for the current question
    setSelectedAnswersMap2((prevMap) => ({
      ...prevMap,
      [questionId]: updatedSelection,
    }));

    // Update the selected answers array for the active question
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[activeQuestion] = updatedSelection;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const onAnswerSelected3 = (e) => {
    // Call clearResponse with the appropriate clearType for input field
    clearResponse("input");
    const inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);

    // Set the value state
    setValue(parsedValue);

    if (
      !questionData.questions ||
      !questionData.questions[currentQuestionIndex]
    ) {
      console.error("Invalid question data or index");
      return;
    }

    const currentQuestion = questionData.questions[currentQuestionIndex];
    const questionId = currentQuestion.question_id;

    // Extract the answerNumber from the current question
    const answerNumber = currentQuestion.answerNumber;

    // Update the selected answers map with the answer value
    setSelectedAnswersMap3((prevMap) => ({
      ...prevMap,
      [questionId]: answerNumber,
    }));

    // Directly set the value attribute of the input field
    const inputField = document.getElementById(
      `question-${currentQuestionIndex}`
    );
    if (inputField) {
      inputField.value = answerNumber ? answerNumber.toString() : ""; // Set the value if answerNumber is not null
    }

    console.log("Calculator Value:", parsedValue);
    console.log("Calculator Input Text Box Value:", inputValue);
    console.log("Answer Number:", answerNumber);

    // Update the question status based on the answer
    const updatedQuestionStatus = [...questionStatus];
    updatedQuestionStatus[currentQuestionIndex] = "answered";
    setQuestionStatus(updatedQuestionStatus);
  };

  //users fetching use effect code
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/ughomepage_banner_login/user1`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to headers for authentication
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          // console.log(userData);
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchUserData();
  }, []);
  //end users fetching use effect code

  //counts use effect code
  useEffect(() => {
    const counts = calculateQuestionCounts();
    setAnsweredCount(counts.answered);
    setNotAnsweredCount(counts.notAnswered);
    setMarkedForReviewCount(counts.markedForReview);
    setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
    setVisitedCount(counts.VisitedCount);
  }, [questionStatus]);

  useEffect(() => {
    // Check if testCreationTableId is defined before making the request
    if (testCreationTableId) {
      fetchData();
    }
  }, [testCreationTableId]);

  const [testName, setTestName] = useState("");
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${testCreationTableId}/${userData.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);
      const testName = data.questions[0].TestName;
      setTestName(testName);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  const currentQuestion =
    questionData.questions && questionData.questions[currentQuestionIndex];

  const [userData, setUserData] = useState({});
  // user data
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
          // console.log(userData);
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Call the updateCounters function initially when the component mounts
    updateCounters();
  }, [questionStatus]);

  useEffect(() => {
    if (
      !questionData.questions ||
      !questionData.questions[currentQuestionIndex]
    ) {
      // Handle the case where questions are not defined
      return;
    }

    // Clear the input since localStorage won't be used
    setValue("");
  }, [currentQuestionIndex, questionData]);

  const currentQuestionTypeId =
    currentQuestion && currentQuestion.quesion_type
      ? currentQuestion.quesion_type.quesionTypeId
      : "";
  // ======================================================================
  //---------------HANDLE_BUTTON_FUNCTIONS_START---------------------
  const handleYes = async () => {
    try {
      const userId = userData.id;
      console.log(userId);
      const courseCreationId = testDetails?.[0]?.courseCreationId;
      console.log(
        courseCreationId ? courseCreationId : "Course creation ID not available"
      );
      console.log(testCreationTableId);

      // Prepare data for the POST request
      const postData = {
        userId: userId,
        courseCreationId: courseCreationId,
        testCreationTableId: testCreationTableId,
        test_status: "Completed",
      };

      // Make the POST request
      const response = await fetch(
        `${BASE_URL}/QuizPage/insertTestAttemptStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to insert test attempt status");
      }
      console.log("Test attempt status inserted successfully");
      await fetchQuestionCount();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleNo = () => {
    setShowExamSumary(false);
  };
  const handleSaveNextQuestion = async () => {
    try {
      const updatedQuestionStatus = [...questionStatus];
      const calculatorInputValue = value;

      const isCurrentQuestionAnswered =
        selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
        (selectedAnswersMap2[currentQuestion.question_id] &&
          selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
        calculatorInputValue !== "";

      if (!isCurrentQuestionAnswered) {
        window.alert("Please answer the question before proceeding.");
      } else {
        updatedQuestionStatus[currentQuestionIndex] = "answered";
        setQuestionStatus(updatedQuestionStatus);

        setCurrentQuestionIndex((prevIndex) =>
          prevIndex < questionData.questions.length - 1
            ? prevIndex + 1
            : prevIndex
        );

        if (userData.id) {
          const userId = userData.id;
          const subjectId = currentQuestion.subjectId;
          const sectionId = currentQuestion.sectionId;
          const questionId = currentQuestion.question_id.toString();

          const valueObject = {
            testCreationTableId: testCreationTableId,
            value: calculatorInputValue,
            question_id: questionId,
          };

          // Store the calculator value in local storage
          localStorage.setItem(
            `calculatorValue_${questionId}`,
            JSON.stringify(valueObject)
          );

          // This ensures that the local storage has enough time to update
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Retrieve the stored calculator value
          const storedValue = localStorage.getItem(
            `calculatorValue_${questionId}`
          );
          const storedCalculatorInputValue = storedValue
            ? JSON.parse(storedValue).value
            : null;
          console.log("currentQuestionTypeId:", currentQuestionTypeId);

          if (calculatorInputValue === storedCalculatorInputValue) {
            const selectedOption1 =
              selectedAnswersMap1[currentQuestion.question_id];

            const selectedOption2 =
              selectedAnswersMap2[currentQuestion.question_id];

            const optionIndexes1 =
              selectedOption1 !== undefined ? [selectedOption1] : [];
            const optionIndexes2 =
              selectedOption2 !== undefined ? selectedOption2 : [];

            const hasAnswered = answeredQuestionsMap[questionId];

            const responses = {
              questionId: questionId,
              hasAnswered: hasAnswered,
              userId: userId,
              testCreationTableId: testCreationTableId,
              subjectId: subjectId,
              sectionId: sectionId,

              [questionId]: {
                optionIndexes1: optionIndexes1.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes1CharCodes: optionIndexes1.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),
                optionIndexes2: optionIndexes2.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes2CharCodes: optionIndexes2.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),
                calculatorInputValue: calculatorInputValue,
              },
            };

            setAnsweredQuestionsMap((prevMap) => ({
              ...prevMap,
              [questionId]: true,
            }));
            // Check if the response is cleared for the current question

            if (hasAnswered) {
              // If the question has been answered before, update the existing response with a PUT request

              const updatedResponse = {
                optionIndexes1: optionIndexes1.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                optionIndexes2: optionIndexes2.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                calculatorInputValue: calculatorInputValue,
              };

              await fetch(`${BASE_URL}/QuizPage/updateResponse/${questionId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  updatedResponse,
                  userId,
                  testCreationTableId,
                  subjectId,
                  sectionId,
                }),
              });
            } else {
              // If the question is being answered for the first time, save a new response with a POST request
              console.log("Making API request to save a new response...");

              await fetch(`${BASE_URL}/QuizPage/response`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(responses),
              });

              console.log("Handling the response after saving...");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error handling next click:", error);
    }
  };

  const handleNextQuestion = async () => {
    try {
      const currentQuestion = questionData.questions[currentQuestionIndex];

      // Check if the current question is answered
      const calculatorInputValue = value;
      const isCurrentQuestionAnswered =
        selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
        (selectedAnswersMap2[currentQuestion.question_id] &&
          selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
        calculatorInputValue !== "";

      if (!isCurrentQuestionAnswered || isCurrentQuestionAnswered) {
        // If the current question is not answered, update the status
        const updatedQuestionStatus = [...questionStatus];
        updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
        console.log(currentQuestionIndex);
        console.log(updatedQuestionStatus);
      } else {
        // Log a message indicating that the question is answered
      }

      // Set the next question status to notAnswered
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questionData.questions.length) {
        const updatedQuestionStatus = [...questionStatus];
        if (
          updatedQuestionStatus[nextQuestionIndex] === "answered" ||
          updatedQuestionStatus[nextQuestionIndex] ===
            "Answered but marked for review" ||
          updatedQuestionStatus[nextQuestionIndex] === "marked"
        ) {
          setQuestionStatus(updatedQuestionStatus);
        } else {
          updatedQuestionStatus[nextQuestionIndex] = "notAnswered";
          setQuestionStatus(updatedQuestionStatus);
        }
      }

      // Move to the next question index
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex < questionData.questions.length - 1
          ? prevIndex + 1
          : prevIndex
      );

      // Fetch user data using the token
      const token = localStorage.getItem("token");
      const response_user = await fetch(
        `${BASE_URL}/ughomepage_banner_login/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to headers for authentication
          },
        }
      );

      if (response_user.ok) {
        const userData = await response_user.json();
        setUserData(userData);

        // Ensure userId is defined
        const userId = userData.id;

        // Ensure questionData is not null or undefined
        if (!questionData || !questionData.questions) {
          console.error("Data or questions are null or undefined");
          return;
        }

        // Extract information for the current question
        const currentQuestion = questionData.questions[currentQuestionIndex];
        const selectedOption1 =
          selectedAnswersMap1[currentQuestion.question_id];
        const selectedOption2 =
          selectedAnswersMap2[currentQuestion.question_id];

        // Map selected options to indexes
        const optionIndexes1 =
          selectedOption1 !== undefined ? [selectedOption1] : [];
        const optionIndexes2 =
          selectedOption2 !== undefined ? selectedOption2 : [];

        // Prepare data to be sent in the response
        const questionId = currentQuestion.question_id;
        const responses = {
          userId: userId,
          testCreationTableId: testCreationTableId,
          [questionId]: {
            optionIndexes1: optionIndexes1.map((index) =>
              String.fromCharCode("a".charCodeAt(0) + index)
            ),
            optionIndexes2: optionIndexes2.map((index) =>
              String.fromCharCode("a".charCodeAt(0) + index)
            ),
          },
        };

        // Save the response to the server
        const saveResponse = await axios.post(`${BASE_URL}/QuizPage/response`, {
          responses,
        });

        setAnsweredQuestionsMap((prevMap) => ({
          ...prevMap,
          [questionId]: true,
        }));

        setClickCount((prevCount) => prevCount + 1);
      } else {
      }

      // Check if there are more questions, and if not, calculate the result
      if (currentQuestionIndex === questionData.questions.length - 1) {
        // setShowResult(true);
        calculateResult();
      }
    } catch (error) {
      console.error("Error handling next click:", error);
    }
  };

  const markForReview = async () => {
    try {
      setCurrentQuestionIndex((prevIndex) => {
        if (prevIndex < questionData.questions.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex;
      });

      const calculatorInputValue = value;
      const currentQuestion = questionData.questions[currentQuestionIndex];
      const isCurrentQuestionAnswered =
        selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
        (selectedAnswersMap2[currentQuestion.question_id] &&
          selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
        calculatorInputValue !== "";

      const updatedQuestionStatus = [...questionStatus];
      if (isCurrentQuestionAnswered) {
        // If the question is answered
        updatedQuestionStatus[currentQuestionIndex] =
          "Answered but marked for review";

        if (userData.id) {
          const userId = userData.id;
          const subjectId = currentQuestion.subjectId;
          const sectionId = currentQuestion.sectionId;
          const questionId = currentQuestion.question_id.toString();

          // Store the calculator value in local storage
          localStorage.setItem(
            `calculatorValue_${questionId}`,
            JSON.stringify({ value: calculatorInputValue })
          );

          // This ensures that the local storage has enough time to update
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Retrieve the stored calculator value
          const storedValue = localStorage.getItem(
            `calculatorValue_${questionId}`
          );
          const storedCalculatorInputValue = storedValue
            ? JSON.parse(storedValue).value
            : null;

          if (calculatorInputValue === storedCalculatorInputValue) {
            const selectedOption1 =
              selectedAnswersMap1[currentQuestion.question_id];
            const selectedOption2 =
              selectedAnswersMap2[currentQuestion.question_id];

            const optionIndexes1 =
              selectedOption1 !== undefined ? [selectedOption1] : [];
            const optionIndexes2 =
              selectedOption2 !== undefined ? selectedOption2 : [];

            const hasAnswered = answeredQuestionsMap[questionId];

            // Construct the responses object
            const responses = {
              questionId: questionId,
              hasAnswered: hasAnswered,
              userId: userId,
              testCreationTableId: testCreationTableId,
              subjectId: subjectId,
              sectionId: sectionId,
              [questionId]: {
                optionIndexes1: optionIndexes1.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes1CharCodes: optionIndexes1.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),
                optionIndexes2: optionIndexes2.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes2CharCodes: optionIndexes2.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),

                calculatorInputValue: calculatorInputValue,
              },
            };

            // Mark the question as answered
            setAnsweredQuestionsMap((prevMap) => ({
              ...prevMap,
              [questionId]: true,
            }));

            // Check if the question has been answered before
            if (hasAnswered) {
              // If the question has been answered before, update the existing response with a PUT request

              const updatedResponse = {
                optionIndexes1: optionIndexes1.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                optionIndexes2: optionIndexes2.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                calculatorInputValue: calculatorInputValue,
              };

              await fetch(`${BASE_URL}/QuizPage/updateResponse/${questionId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  updatedResponse,
                  userId,
                  testCreationTableId,
                  subjectId,
                  sectionId,
                }),
              });
            } else {
              // If the question is being answered for the first time, save a new response with a POST request

              await fetch(`${BASE_URL}/QuizPage/response`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(responses),
              });
            }
          }
        }
      } else {
        // If the question is not answered
        updatedQuestionStatus[currentQuestionIndex] = "marked";
      }

      setQuestionStatus(updatedQuestionStatus);
    } catch (error) {
      console.error("Error handling mark for review:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setShowExamSumary(true);
      calculateResult();
      const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
      const counts = calculateQuestionCounts();
      setAnsweredCount(counts.answered);
      setNotAnsweredCount(counts.notAnswered);
      setMarkedForReviewCount(counts.markedForReview);
      setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
      setVisitedCount(counts.VisitedCount);

      // Assuming you have these variables in your component's state
      const currentQuestion = questionData.questions[currentQuestionIndex];
      const questionId = currentQuestion.question_id;

      // Format time
      const formattedTime = WformatTime(wtimer);
      const response = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          totalUnattempted: notAnsweredCount,
          totalAnswered: answeredCount,
          NotVisitedb: NotVisitedb,
          testCreationTableId: testCreationTableId,
        }),
      });
      const result = await response.json();
      try {
        // Make a POST request to your server to submit time left
        const response = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: userData.id,
            testCreationTableId: testCreationTableId,
            timeLeft: formattedTime,
          }),
        });

        const result = await response.json();
      } catch (error) {
        console.error("Error submitting time left:", error);
      } finally {
        // Ensure that the questionId is correctly obtained
        if (questionId) {
          // Clear local storage data for the current question
          try {
            localStorage.removeItem(`calculatorValue_${questionId}`);
          } catch (error) {
            console.error("Error removing item from local storage:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handlePreviousClick = () => {
    const currentQuestion = questionData.questions[currentQuestionIndex];

    // Check if the current question is answered
    const calculatorInputValue = value;
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";

    if (!isCurrentQuestionAnswered || isCurrentQuestionAnswered) {
      // If the current question is not answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
      console.log(currentQuestionIndex);
      console.log(updatedQuestionStatus);
    } else {
      // Log a message indicating that the question is answered
    }

    setCurrentQuestionIndex((prevIndex) => {
      // Save the current timer value for the question
      const updatedTimers = [...timers];
      updatedTimers[prevIndex] = timer;
      setTimers(updatedTimers);
      // Move to the previous question
      return prevIndex - 1;
    });

    // Set the previous question status to notAnswered
    const previousQuestionIndex = currentQuestionIndex - 1;
    if (previousQuestionIndex >= 0) {
      const updatedQuestionStatus = [...questionStatus];
      if (
        updatedQuestionStatus[previousQuestionIndex] === "answered" ||
        updatedQuestionStatus[previousQuestionIndex] ===
          "Answered but marked for review" ||
        updatedQuestionStatus[previousQuestionIndex] === "marked"
      ) {
        setQuestionStatus(updatedQuestionStatus);
      } else {
        updatedQuestionStatus[previousQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
      }
    }

    fetchData();
    setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);
    // Set the value to the previously selected answer if available
    if (currentQuestionIndex > 0) {
      const prevQuestion = questionData.questions[currentQuestionIndex - 1];
      const prevQuestionId = prevQuestion.question_id;

      // Retrieve the stored answer from local storage using the question ID
      const value = localStorage.getItem(`calculatorValue_${prevQuestionId}`);
      if (value) {
        const parsedValue = JSON.parse(value).value;
        setValue(parsedValue);
      } else {
        // setValue(""); // Clear the input if there is no stored answer
        // console.log("No stored value found for previous question.");
      }
    }
  };
  const clearResponse = async () => {
    const currentQuestion = questionData.questions[currentQuestionIndex];

    const inputField = document.getElementById(
      `question-${currentQuestionIndex}`
    );
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      selectedAnswersMap3[currentQuestion.question_id] ||
      inputField !== "";

    fetchData();
    if (isCurrentQuestionAnswered) {
      // If the current question is answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
    }
    //-----------------buttons functionality end--------------

    try {
      const questionId =
        questionData.questions[currentQuestionIndex].question_id;

      // Clear response for radio buttons (MCQ)
      const updatedSelectedAnswersMap1 = { ...selectedAnswersMap1 };
      updatedSelectedAnswersMap1[questionId] = undefined;
      setSelectedAnswersMap1(updatedSelectedAnswersMap1);

      // Clear response for checkboxes (MSQ)
      const updatedSelectedAnswersMap2 = { ...selectedAnswersMap2 };
      updatedSelectedAnswersMap2[questionId] = [];
      setSelectedAnswersMap2(updatedSelectedAnswersMap2);

      // Clear response for input field
      const updatedSelectedAnswersMap3 = { ...selectedAnswersMap3 };
      updatedSelectedAnswersMap3[questionId] = undefined;
      setSelectedAnswersMap3(updatedSelectedAnswersMap3);
      // Clear response for input field by setting value directly in the input field
      const inputField = document.getElementById(
        `question-${currentQuestionIndex}`
      );
      if (inputField) {
        setTimeout(() => {
          inputField.value = ""; // Clear the value in the input field
        }, 0);
      }
      // Remove the stored calculator value in local storage
      localStorage.removeItem(`calculatorValue_${questionId}`);
      fetchData();
      // Additionally, you can set the value state to empty string
      setValue("");
      // Send a request to your server to clear the user's response for the current question
      const response = await axios.put(
        `${BASE_URL}/QuizPage/clearResponse/${questionId}/${userData.id}`
      );

      if (response.status === 200) {
        // Update any state or perform additional actions as needed
      } else {
        console.error("Failed to clear response:", response.data);
      }
    } catch (error) {
      console.error("Error clearing response:", error);
    }
  };
  //---------------HANDLE_BUTTON_FUNCTIONS_END--------------------------
  // ======================================================================

  const updateQuestionStatus = (index, status) => {
    // Update the question status in the QuestionPaper component
    const updatedQuestionStatus = [...questionStatus];
    updatedQuestionStatus[index] = status;
    setQuestionStatus(updatedQuestionStatus);
  };

  const currentQuestionType =
    currentQuestion && currentQuestion.quesion_type
      ? currentQuestion.quesion_type.typeofQuestion
      : "";

  const [testData, setTestData] = useState([]);
  const { courseCreationId, Portale_Id } = useParams();

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const responseTest = await fetch(
          `${BASE_URL}/TestPage/feachingtest/${courseCreationId}`
        );
        const testData = await responseTest.json();
        setTestData(testData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTestData();
  }, [courseCreationId]);

  // ======================================================================
  // -----------------COUNT_DOWN_TIMER_FUNCTIONALITY_START--------------
  const [countDown, setCountDown] = useState(180 * 60);
  const timerId = useRef();

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  // Convert seconds to hours, minutes, and seconds
  const hours = Math.floor(countDown / 3600);
  const minutes = Math.floor((countDown % 3600) / 60);
  const seconds = countDown % 60;
  // -----------------COUNT_DOWN_TIMER_FUNCTIONALITY_END--------------
 // ======================================================================

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/testDetails/${testCreationTableId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test details");
        }

        const data = await response.json();
        console.log(data);
        setTestDetails(data.results);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      }
    };

    if (testCreationTableId) {
      fetchTestDetails();
    }
  }, [testCreationTableId]);

  const openPopup = () => {
    // Close the current window
    window.close();
    // Set studentDashbordmyresult to true and store it in localStorage
    localStorage.setItem(
      "studentDashboardState",
      JSON.stringify({
        studentDashbordmyresult: true,
        studentDashbordconatiner: false,
        studentDashbordmycourse: false,
        studentDashbordbuycurses: false,
        studentDashborddountsection: false,
        studentDashbordbookmark: false,
        studentDashbordsettings: false,
      })
    );
    // Open the desired URL in a new window
    window.open("http://localhost:3000/student_dashboard");
  };

  // Handler to update option state
  const handleUpdateOption = (value) => {
    setOption({ ans: value });
  };

  return (
    <div className="QuestionPaper_-container">
      <div className="quiz_exam_interface_header quiz_exam_interface_header_q_if_H">
        <div className="quiz_exam_interface_header_LOGO ">
          <div>
            {image ? (
              <img src={image} alt="Current" />
            ) : (
              <img src={defaultImage} alt="Default" />
            )}
          </div>
        </div>
        <p
          className="testname_heading_quizPage"
          key={testName.testCreationTableId}
        >
          {testName}
        </p>
      </div>

      {!showExamSumary ? (
        <div className="quiz_exam_interface_body">
          {/* --------------- quiz examconatiner -------------------- */}
          <div className="quiz_exam_interface_body_left_container">
            {/* --------------- quiz sub container -------------------- */}

            {/* --------------- quiz question container -------------------- */}
            <div class="quiz_exam_interface_exam_CONTAINEr">
              {questionData.questions.length > 0 && (
                <>
                  <div className="quiz_exam_interface_exam_subCONTAINEr">
                    <div className="quiz_exam_interface_exam_qN_Q">
                      <div class="quiz_exam_interface_SUBJECTS_CONTAINER">
                        <div className="time_qtype_div">
                          <div class="">
                            <div>
                              <p className="time_left_tag">
                                <span>
                                  <MdOutlineTimer />
                                </span>
                                <div>
                                  Time Left: {hours.toString().padStart(2, "0")}
                                  :{minutes.toString().padStart(2, "0")}:
                                  {seconds.toString().padStart(2, "0")}
                                </div>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="question_options_div">
                        <div className="question_div">
                          <div className="pravagragh_container ">
                            {currentQuestion.paragraph &&
                              currentQuestion.paragraph.paragraphImg && (
                                <div className="Paragraph_div ">
                                  <b>Paragraph:</b>
                                  <img
                                    src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${currentQuestion.paragraph.paragraphImg}`}
                                    alt={`ParagraphImage ${currentQuestion.paragraph.paragraph_Id}`}
                                  />
                                </div>
                              )}
                          </div>
                        </div>
                        <b>Question</b>
                        <div className="question_number_continer">
                          <h4 id="question_number">
                            {currentQuestionIndex + 1}.
                          </h4>
                          <img
                            src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${currentQuestion.questionImgName}`}
                            alt={`Question ${currentQuestion.question_id}`}
                          />
                        </div>
                        <div className="parent-div">
                          {currentQuestionType.includes("NATD") ||
                          currentQuestionType.includes("NATI") ? (
                            <div className="quiz_exam_interface_exam_qN_Q_options_calculator_input">
                              {currentQuestion.options &&
                                Array.isArray(currentQuestion.options) &&
                                currentQuestion.options.filter(
                                  (opt) =>
                                    opt.question_id ===
                                    questionData.questions[currentQuestionIndex]
                                      ?.question_id
                                ) &&
                                currentQuestion.options.map(
                                  (option, optionIndex) => (
                                    <div
                                      className="option"
                                      key={option.option_id}
                                    >
                                      <li key={optionIndex}>
                                        {/* calculator ============ */}
                                        {currentQuestionType.includes(
                                          "NATD( Numeric Answer type of questions with Decimal values)"
                                        ) && (
                                          <div className="calculator">
                                            <div className="display">
                                              <label>Answer:</label>

                                              <input
                                                type="text"
                                                name={`question-${currentQuestionIndex}`}
                                                value={
                                                  option.ans !== null
                                                    ? option.ans
                                                    : value
                                                }
                                                onChange={(e) =>
                                                  onAnswerSelected3(e)
                                                }
                                                placeholder="Enter your answer"
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="DEL"
                                                onClick={(e) => {
                                                  if (option.ans !== null) {
                                                    option.ans = null;
                                                  } else {
                                                    setValue("");
                                                  }
                                                }}
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="7"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="8"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="9"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="4"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="5"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="6"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="1"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="2"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="3"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="0"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="."
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="-"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}
                                        {currentQuestionType.includes(
                                          "NATI( Numeric Answer type of questions with integer values)"
                                        ) && (
                                          <div className="calculator">
                                            <div className="display">
                                              <label>Answer:</label>

                                              <input
                                                type="text"
                                                name={`question-${currentQuestionIndex}`}
                                                value={
                                                  option.ans !== null
                                                    ? option.ans
                                                    : value
                                                }
                                                onChange={(e) =>
                                                  onAnswerSelected3(e)
                                                }
                                                placeholder="Enter your answer"
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="DEL"
                                                onClick={(e) => {
                                                  if (option.ans !== null) {
                                                    option.ans = null;
                                                  } else {
                                                    setValue(
                                                      String(value).slice(0, -1)
                                                    );
                                                  }
                                                }}
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="7"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="8"
                                                onClick={(e) =>
                                                  setValue(
                                                    value + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="9"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="4"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="5"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="6"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="1"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="2"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="3"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="0"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="."
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                              <input
                                                type="button"
                                                value="-"
                                                onClick={(e) =>
                                                  setValue(
                                                    (option.ans !== null
                                                      ? option.ans
                                                      : value) + e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}
                                        {/* calculator ============ */}
                                      </li>
                                    </div>
                                  )
                                )}
                            </div>
                          ) : (
                            <div className="quiz_exam_interface_exam_qN_Q_options">
                              {/* Render only if it's not NATD or NATI type question */}
                              <b>Options</b>
                              {currentQuestion.options &&
                                Array.isArray(currentQuestion.options) &&
                                currentQuestion.options.filter(
                                  (opt) =>
                                    opt.question_id ===
                                    questionData.questions[currentQuestionIndex]
                                      ?.question_id
                                ) &&
                                currentQuestion.options.map(
                                  (option, optionIndex) => (
                                    <div
                                      className="option"
                                      key={option.option_id}
                                    >
                                      <li key={optionIndex}>
                                        {currentQuestionType.includes(
                                          "MCQ4(MCQ with 4 Options)"
                                        ) && (
                                          <div>
                                            <input
                                              className="opt_btns"
                                              type="radio"
                                              name={`question-${currentQuestionIndex}-option`}
                                              value={option.ans}
                                              checked={
                                                selectedAnswersMap1[
                                                  currentQuestion.question_id
                                                ] === optionIndex
                                              }
                                              onChange={() =>
                                                onAnswerSelected1(optionIndex)
                                              }
                                            />
                                            <label htmlFor="">
                                              ({option.option_index})
                                            </label>
                                            <img
                                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                              alt={`Option ${option.option_id}`}
                                            />
                                          </div>
                                        )}
                                        {currentQuestionType.includes(
                                          "MCQ5(MCQ with 5 Options)"
                                        ) && (
                                          <div>
                                            <input
                                              className="opt_btns"
                                              type="radio"
                                              name={`question-${currentQuestionIndex}-option`}
                                              value={String.fromCharCode(
                                                "A".charCodeAt(0) + optionIndex
                                              )}
                                              checked={
                                                selectedAnswersMap1[
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                ] === optionIndex
                                              }
                                              onChange={() =>
                                                onAnswerSelected1(optionIndex)
                                              }
                                            />
                                            (
                                            {String.fromCharCode(
                                              "a".charCodeAt(0) + optionIndex
                                            )}
                                            )
                                            <img
                                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                              alt={`Option ${option.option_id}`}
                                            />
                                          </div>
                                        )}
                                        {currentQuestionType.includes(
                                          "MSQN(MSQ with -ve marking)"
                                        ) && (
                                          <div>
                                            <input
                                              className="opt_btns"
                                              type="checkbox"
                                              name={`question-${currentQuestionIndex}-optionIndex`}
                                              value={String.fromCharCode(
                                                "A".charCodeAt(0) + optionIndex
                                              )}
                                              checked={
                                                selectedAnswersMap2[
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                ] &&
                                                selectedAnswersMap2[
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                ].includes(optionIndex)
                                              }
                                              onChange={() =>
                                                onAnswerSelected2(optionIndex)
                                              }
                                            />
                                            (
                                            {String.fromCharCode(
                                              "a".charCodeAt(0) + optionIndex
                                            )}
                                            )
                                            <img
                                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                              alt={`Option ${option.option_id}`}
                                            />
                                          </div>
                                        )}
                                        {currentQuestionType.includes(
                                          "MSQ(MSQ without -ve marking)"
                                        ) && (
                                          <div>
                                            <input
                                              className="opt_btns"
                                              type="checkbox"
                                              name={`question-${currentQuestionIndex}-optionIndex`}
                                              value={String.fromCharCode(
                                                "A".charCodeAt(0) + optionIndex
                                              )}
                                              checked={
                                                selectedAnswersMap2[
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                ] &&
                                                selectedAnswersMap2[
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                ].includes(optionIndex)
                                              }
                                              onChange={() =>
                                                onAnswerSelected2(optionIndex)
                                              }
                                            />
                                            (
                                            {String.fromCharCode(
                                              "a".charCodeAt(0) + optionIndex
                                            )}
                                            )
                                            <img
                                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                              alt={`Option ${option.option_id}`}
                                            />{" "}
                                          </div>
                                        )}
                                        {currentQuestionType.includes(
                                          "TF(True or false)"
                                        ) && (
                                          <div>
                                            <input
                                              className="opt_btns"
                                              type="radio"
                                              name={`question-${currentQuestionIndex}-option`}
                                              value={String.fromCharCode(
                                                "A".charCodeAt(0) + optionIndex
                                              )}
                                              checked={
                                                selectedAnswersMap1[
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                ] === optionIndex
                                              }
                                              onChange={() =>
                                                onAnswerSelected1(optionIndex)
                                              }
                                            />
                                            (
                                            {String.fromCharCode(
                                              "a".charCodeAt(0) + optionIndex
                                            )}
                                            )
                                            <img
                                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                              alt={`Option ${option.option_id}`}
                                            />
                                          </div>
                                        )}

                                        {currentQuestionType.includes(
                                          "CTQ(Comprehension type of questions )"
                                        ) && (
                                          <div>
                                            <input
                                              className="opt_btns"
                                              type="radio"
                                              name={`question-${currentQuestionIndex}-option`}
                                              value={String.fromCharCode(
                                                "A".charCodeAt(0) + optionIndex
                                              )}
                                              checked={
                                                selectedAnswersMap1[
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                ] === optionIndex
                                              }
                                              onChange={() =>
                                                onAnswerSelected1(optionIndex)
                                              }
                                            />
                                            (
                                            {String.fromCharCode(
                                              "a".charCodeAt(0) + optionIndex
                                            )}
                                            )
                                            <img
                                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                              alt={`Option ${option.option_id}`}
                                            />
                                          </div>
                                        )}
                                      </li>
                                    </div>
                                  )
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="quiz_btns_contaioner">
                    <div>
                      {/* <Tooltip
                        title="Click here to Save & Mark for Review"
                        arrow
                      > */}
                      <button
                        className="Quiz_Save_MarkforReview"
                        onClick={markForReview}
                      >
                        Save & Mark for Review
                      </button>
                      {/* </Tooltip> */}
                      {/* <Tooltip title="Click here to Clear Response" arrow> */}
                      <button
                        className="Quiz_clearResponse"
                        onClick={clearResponse}
                      >
                        Clear Response
                      </button>
                      {/* </Tooltip> */}
                      {/* <Tooltip title="Click here to Save & Next" arrow> */}
                      <button
                        className="quizsave_next"
                        onClick={handleSaveNextQuestion}
                      >
                        Save & Next
                      </button>
                      {/* </Tooltip> */}
                    </div>
                    <div className="quiz_Next_back">
                      {/* <Tooltip title="Click here to go Back" arrow> */}
                      <button
                        className="previous-btn"
                        onClick={handlePreviousClick}
                        disabled={currentQuestionIndex === 0}
                      >
                        <i className="fa-solid fa-angles-left"></i> Back
                      </button>
                      {/* </Tooltip> */}
                      {/* <Tooltip title="Click here to go Next" arrow> */}
                      <button onClick={handleNextQuestion}>Next</button>
                      {/* </Tooltip> */}

                      {/* <Tooltip title="Click here to Submit" arrow> */}
                      <button
                        style={{ background: "#f0a607da" }}
                        onClick={handleSubmit}
                        id="resume_btn"
                      >
                        Submit
                      </button>
                      {/* </Tooltip> */}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* --------------- quiz btns container ------------ */}
          </div>

          <div className="quiz_exam_interface_body_right_container">
            {/* --------------- right bar -------------------- */}
            <div className="rightsidebar_container">
              <div
                className="rightsidebar_container_btn_menubar"
                onClick={toggleSidebar}
              >
                <BiMenuAltLeft />
              </div>
              <div
                className={
                  isSidebarVisible ? "rightsidebar visible" : "rightsidebar"
                }
              >
                <ButtonsFunctionality
                  onQuestionSelect={handleQuestionSelect}
                  questionStatus={questionStatus}
                  setQuestionStatus={setQuestionStatus}
                  answeredCount={answeredCount}
                  notAnsweredCount={notAnsweredCount}
                  answeredmarkedForReviewCount={answeredmarkedForReviewCount}
                  markedForReviewCount={markedForReviewCount}
                  VisitedCount={VisitedCount}
                  selectedSubject={selectedSubject}
                  questionData={questionData}
                  updateQuestionStatus={updateQuestionStatus}
                  // seconds={seconds}
                  seconds={600}
                  onUpdateOption={handleUpdateOption}
                  option={option}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="result">
          <h3 id="result_header">Exam Summary</h3>
          <div className="result_page_links"></div>

          <div className="Exam_summary_table">
            <table id="customers">
              <tr>
                <td>Total Questions</td>
                <td>Answered Questions</td>
                <td>Not Answered Questions</td>
                <td>Not Visited Count</td>
                <td>Marked for Review Questions</td>
                <td>Answered & Marked for Review Questions</td>
              </tr>
              <tr>
                <td>{questionData.questions.length}</td>
                <td>{answeredCount}</td>
                <td>{notAnsweredCount}</td>
                <td>{NotVisitedb}</td>
                <td>{markedForReviewCount}</td>
                <td>{answeredmarkedForReviewCount}</td>
              </tr>
            </table>
          </div>

          <div>
            <h2 className="Exam_summary_question_tag">
              Are you sure you want to submit ? <br />
              No changes will be allowed after submission.
            </h2>

            <div className="Exam_summary_btns">
              {/* <Tooltip title="Yes" arrow> */}
              <>
                <Link
                  className="es_btn"
                  to={`/TestResultsPage/${testCreationTableId}/${userData.id}`}
                  onClick={handleYes}
                >
                  Yes
                </Link>
              </>
              {/* </Tooltip> */}
              {/* <Tooltip title="No" arrow> */}
              <button className="es_btn" onClick={handleNo}>
                NO
              </button>
              {/* </Tooltip> */}
              {showPopup && (
                <div className="popup">
                  <div className="popup-content">
                    <div className="submit-page-container">
                      <div className="submit-page-card">
                        <h2 className="submit-page-heading">
                          Your Test has been submitted successfully.
                        </h2>
                        <h3 className="submit-page-subheading">
                          View your Test Report
                        </h3>
                        <button
                          onClick={openPopup}
                          className="submit-page-button"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTS_QuizPage;
