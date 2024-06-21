import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import OQB_ButtonsFunctionality from "./OQB_ButtonsFunctionality";
import Tooltip from "@mui/material/Tooltip";
import "../Styles/Paper.css";
import defaultImage from "../../../assets/defaultImage.png";
import { MdOutlineTimer } from "react-icons/md";
import { useRef } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import BASE_URL from "../../../apiConfig";
import { IoReloadCircle } from "react-icons/io5";

const Practice_QuestionBank_QuizPage = () => {


  //----------CONST_VARIABLES_DECLARATIONS_START-----------------
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({});
  const [testData, setTestData] = useState([]);
  const { courseCreationId } = useParams();
  const [testDetails, setTestDetails] = useState([]);
  const [showPopupallpb, setShowPopupallpb] = useState(false);
  const { testCreationTableId, user_Id } = useParams();
  const [showSolution, setShowSolution] = useState(false);
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };
  const [buttonText, setButtonText] = useState("Submit");
  const [finalTry, setFinalTry] = useState([]);
  const [finalTry2, setFinalTry2] = useState([]);
  const [finalTry3, setFinalTry3] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState([]);
  const [finalTryMap, setFinalTryMap] = useState(new Map());
  const [finalTry2Map, setFinalTry2Map] = useState(new Map());
  const [finalTry3Map, setFinalTry3Map] = useState(new Map());
  const [userAnswers, setUserAnswers] = useState({});
  const userCAArray = [];
  const userWAArray = [];
  const missingCorrectIndices = [];
  let correctOptions = [];
  let wrongOptions = [];
  let missingOptions = [];
  const optionIndices = [];
  const [calc, setCalc] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [questionData, setQuestionData] = useState({ questions: [] });
  const [value, setValue] = useState("");
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
  const [showExamSumary, setShowExamSumary] = useState(false);
  const questions = questionData.questions ? questionData.questions.length : 0;
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questionData.length).fill("")
  );
  const [answeredQuestionsMap, setAnsweredQuestionsMap] = useState({});
  const [selectedAnswersMap1, setSelectedAnswersMap1] = useState({});
  const [selectedAnswersMap2, setSelectedAnswersMap2] = useState({});
  const [selectedAnswersMap3, setSelectedAnswersMap3] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScoreCount] = useState({ totalMarks: 0, netMarks: 0 });
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [testName, setTestName] = useState("");
  const [setCompleteButtonText] = useState([]);
  const [option, setOption] = useState({ ans: null });

  //------END_OF_CONST_VARIABLES_DECLARATIONS------------
  // ======================================================================

  async function handleendthetestrestart(userId) {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/clearresponseforPB/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      } else {
        console.log("User data deleted successfully");
      }

      setShowPopupallpb(false);
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  }
  async function handleendthetest(userId) {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/clearresponseforPB/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      } else {
        console.log("User data deleted successfully");
      }
      window.close();
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  }

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

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}/${user_Id}`
        );

        setTestDetails(response.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [courseCreationId, user_Id]);

  window.addEventListener("beforeunload", async function (event) {
    // Call your delete API endpoint here
    const userId = userData.id;

    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/clearresponseforPB/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
    }

    // Get the specific items you want to retain
    let itemsToRetain = [
      "isLoggedIn",
      "student_dashboard_state",
      "userRole",
      "greeting",
      "token",
    ];
    let retainedItems = {};

    // Iterate over the specific items and store them in a temporary object
    itemsToRetain.forEach((item) => {
      let value = localStorage.getItem(item);
      if (value !== null) {
        retainedItems[item] = value;
      }
    });

    // Clear all items from local storage
    localStorage.clear();

    // Set back the specific items if the user is logged in
    if (retainedItems["isLoggedIn"] === "true") {
      Object.entries(retainedItems).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }
  });

  window.addEventListener("load", function () {
    if (performance.navigation.type === 1) {
      // Page reloaded
      window.history.go(-2);
    }
  });

  const onSubmit2 = () => {
    setSubmitted(true);
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer.answer_text.trim();

    const userAnswer = value.trim();
    if (userAnswer === "") {
      // Check if the user has submitted an empty answer
      console.log("Please enter your answer!");
      return;
    }
    if (correctAnswer === userAnswer) {
      console.log("user answerrr", userAnswer);
      console.log("Correct!");
      setShowCorrectAnswer(true);
      setCalc((prev) => [...prev, correctAnswer]);

      // Store the answer status as true in local storage
      localStorage.setItem(
        `answer_${currentQuestion.question_id}`,
        JSON.stringify({ correct: true, correctAnswer })
      );
    } else {
      console.log("Wrong!");
      console.log("Correct Answer:", correctAnswer);
      setShowCorrectAnswer(true);
      setCalc((prev) => [...prev, correctAnswer]);
      setCorrectAnswer(correctAnswer);

      localStorage.setItem(
        `answer_${currentQuestion.question_id}`,
        JSON.stringify({ correct: false, correctAnswer })
      );
    }
    // Add the submitted question to the array of submitted questions
    setSubmittedQuestions((prev) => [...prev, currentQuestion.question_id]);
    // Automatically change the button text to "View Solution" after submitting
    setButtonText("View Solution");
  };

  // Function to check if the current question is submitted
  const isQuestionSubmitted = (questionId) => {
    return submittedQuestions.includes(questionId);
  };

  const onSubmit = () => {
    setSubmitted(true);
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const selectedOptionIndex = selectedAnswers[activeQuestion];

    if (
      selectedOptionIndex >= 0 &&
      selectedOptionIndex < currentQuestion.options.length
    ) {
      const selectedOption = currentQuestion.options[selectedOptionIndex];
      const correctAnswerText = currentQuestion.answer.answer_text.trim();

      if (selectedOption) {
        const selectedAnswerText = selectedOption.option_index.trim();

        if (selectedAnswerText === correctAnswerText) {
          localStorage.setItem(`answer_${currentQuestion.question_id}`, true);
          // Here you can add your logic for handling correct answer
        } else {
          localStorage.setItem(`answer_${currentQuestion.question_id}`, true);
          const correctAnswerOptionIndex = currentQuestion.options.findIndex(
            (option) => option.option_index.trim() === correctAnswerText
          );
          const correctAnswerOptionId =
            currentQuestion.options[correctAnswerOptionIndex]?.option_id;
        }
      } else {
        console.error("Selected option is undefined.");
      }
    } else {
      console.error("Invalid selected option index.");
    }
    // Add the submitted question ID to the array
    setSubmittedQuestions([...submittedQuestions, currentQuestion.question_id]);
  };

  const onNextQuestion = () => {
    setShowSolution(false);
    setSubmitted(true); // Reset the submitted state when moving to the next question

    const currentQuestion = questionData.questions[currentQuestionIndex];
    const updatedQuestionStatus = [...questionStatus];
    // Check if the current question is answered
    const calculatorInputValue = value;
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";
    if (!isCurrentQuestionAnswered) {
      // If the current question is not answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
    } else {
      updatedQuestionStatus[currentQuestionIndex] = "answered";
      setQuestionStatus(updatedQuestionStatus);
    }

    // Move to the next question index
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questionData.questions.length - 1 ? prevIndex + 1 : prevIndex
    );

    // Set the next question status to notAnswered
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questionData.questions.length) {
      const updatedQuestionStatus = [...questionStatus];
      if (updatedQuestionStatus[nextQuestionIndex] === "answered") {
        setQuestionStatus(updatedQuestionStatus);
      } else {
        updatedQuestionStatus[nextQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
      }
    }

    // Check if the answer status is available in local storage
    const nextQuestion = questionData.questions[currentQuestionIndex + 1];
    if (nextQuestion) {
      const updatedQuestionStatus = [...questionStatus];
      const nextQuestionId = nextQuestion.question_id;
      const answerStatus = localStorage.getItem(`answer_${nextQuestionId}`);
      if (answerStatus === "true") {
        setButtonText("View Solution");
      } else {
        setButtonText("Submit");
      }
    }

    if (currentQuestionIndex + 1 === questionData.questions.length) {
      setCurrentQuestionIndex(0);
    }
  };

  function handlecloseSolution() {
    setShowSolution(false);
  }

  const STORAGE_KEY = "currentQuestionIndex";

  useEffect(() => {
    // Check if there is a stored value for the current question
    const storedValue = localStorage.getItem(
      selectedQuestionId[selectedQuestionId.length - 1]
    );
    if (storedValue) {
      setValue(storedValue);
    }
  }, [selectedQuestionId]);

  useEffect(() => {
    // Retrieve the current question index from local storage
    const storedIndex = localStorage.getItem(STORAGE_KEY);
    if (storedIndex) {
      setCurrentQuestionIndex(parseInt(storedIndex));
    }
  }, []);

  async function handleQType(currentQuestionType, qid) {
    setShowSolution(false);
    if (!showSolution) {
      setButtonText("View Solution");
      if (buttonText == "View Solution") {
        setShowSolution(true);
      }
    }
    if (buttonText == "Hide Solution") {
      setButtonText("View Solution");
      setShowSolution(false);
    }

    // Check if the question is answered for NATI or NATD type
    const isNATQuestionAnswered =
      currentQuestionType.includes("NATD") ||
      currentQuestionType.includes("NATI");

    if (!isNATQuestionAnswered) {
      console.log("NATQuestion not Answered");
    } else {
      console.log("NATQuestionAnswered");
    }
    const calculatorInputValue = value;
    const isQuestionAnswered =
      currentQuestionType.includes("MSQ") ||
      currentQuestionType.includes("MSQN") ||
      currentQuestionType.includes("MCQ4") ||
      currentQuestionType.includes("MCQ5") ||
      currentQuestionType.includes("CTQ");

    // Check if the question is answered in general
    const isCurrentQuestionAnswered =
      isNATQuestionAnswered ||
      isQuestionAnswered ||
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";
    setButtonText(isCurrentQuestionAnswered ? "View Solution" : "Submit");

    if (!isCurrentQuestionAnswered) {
      // If the question is not answered, show the "Submit" button
      setButtonText("Submit");
    } else {
      // If the question is answered, show the "View Solution" button
      setButtonText("View Solution");
    }

    if (!isCurrentQuestionAnswered && buttonText === "Submit") {
      window.alert("Please answer the question.");
      setButtonText("Submit");
      return;
    }

    if (!isCurrentQuestionAnswered && buttonText !== "Submit") {
      setButtonText("Submit");
      return;
    } else {
      if (!selectedQuestionId.includes(qid)) {
        // If it doesn't exist, create a new array by spreading the previous state and adding the newQuestionId
        const updatedSelectedQuestionId = [...selectedQuestionId, qid];
        // Update the state with the new array
        setSelectedQuestionId(updatedSelectedQuestionId);
      }
      if (
        currentQuestionType.includes("MCQ4") ||
        currentQuestionType.includes("MCQ5") ||
        currentQuestionType.includes("CTQ") ||
        currentQuestionType.includes("TF")
      ) {
        onSubmit();
      } else if (
        currentQuestionType.includes("MSQN") ||
        currentQuestionType.includes("MSQ")
      ) {
        //  i have to add code of check boxes
        checkBoxes(qid);
      } else if (
        currentQuestionType.includes("NATD") ||
        currentQuestionType.includes("NATI")
      ) {
        onSubmit2();
      }
      try {
        const updatedQuestionStatus = [...questionStatus];
        const calculatorInputValue = value;

        updatedQuestionStatus[currentQuestionIndex] = "answered";
        setQuestionStatus(updatedQuestionStatus);

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

              await fetch(`${BASE_URL}/QuizPage/responseforPB`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(responses),
              });
            }
          }
        }
        // Reset showCorrectAnswer state when a new question is selected
        setShowCorrectAnswer(false);
        setShowCorrectAnswer(true); // Set it to true after reset
      } catch (error) {
        console.error("Error handling next click:", error);
      }
    }
  }

  const checkBoxes = (qid) => {
    setSubmittedQuestions([...submittedQuestions, qid]);
    setSubmitted(true);
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const selectedOptionIndex = selectedAnswers[activeQuestion];
    const answerText = currentQuestion.answer.answer_text.trim();
    const array = answerText.split(",");
    const indexArray = array.map(
      (letter) => letter.charCodeAt(0) - "a".charCodeAt(0)
    );
    indexArray.forEach((correctIndex, index) => {
      // Check if selectedOptionIndex is defined before using it
      if (selectedOptionIndex && selectedOptionIndex.includes(correctIndex)) {
        userCAArray.push(correctIndex);
      } else {
        missingCorrectIndices.push(correctIndex);
      }
    });

    // Check if selectedOptionIndex is defined and is an array before using forEach
    if (Array.isArray(selectedOptionIndex)) {
      selectedOptionIndex.forEach((userIndex) => {
        if (
          !indexArray.includes(userIndex) &&
          !missingCorrectIndices.includes(userIndex)
        ) {
          userWAArray.push(userIndex);
        }
      });
    } else {
      console.error("selectedOptionIndex is not an array or is undefined.");
    }

    const answerOptions = currentQuestion.options;

    correctOptions = userCAArray.map((index) => answerOptions[index]);
    wrongOptions = userWAArray.map((index) => answerOptions[index]);
    missingOptions = missingCorrectIndices.map((index) => answerOptions[index]);
    missingOptions.forEach((item) => {
      console.log(item.option_index, "missingoptions lo option_index");
    });

    missingOptions.forEach((item) => {
      // Convert the option_index to its corresponding index value and push it into the array
      const index = item.option_index.charCodeAt(0) - "a".charCodeAt(0);
      optionIndices.push(index);
    });

    correctOptions.forEach((option) => {
      console.log(option, "option in loop");
    });
    correctOptions.forEach((option) => {
      const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
      if (!finalTry.includes(newIndex)) {
        setFinalTry((prev) => [...prev, newIndex]);
      }
    });
    wrongOptions.forEach((option) => {
      const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
      if (!finalTry2.includes(newIndex)) {
        setFinalTry2((prev) => [...prev, newIndex]);
      }
    });
    missingOptions.forEach((option) => {
      const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
      if (!finalTry3.includes(newIndex)) {
        setFinalTry3((prev) => [...prev, newIndex]);
      }
    });
    // const uniquePreviousValues = [...new Set(previousValues)];
    const finalTryMapCopy = new Map(finalTryMap);
    const finalTry2MapCopy = new Map(finalTry2Map);
    const finalTry3MapCopy = new Map(finalTry3Map);

    finalTryMapCopy.set(qid, userCAArray);
    finalTry2MapCopy.set(qid, userWAArray);
    finalTry3MapCopy.set(qid, missingCorrectIndices);

    setFinalTryMap(finalTryMapCopy);
    setFinalTry2Map(finalTry2MapCopy);
    setFinalTry3Map(finalTry3MapCopy);

    if (!selectedQuestionIds.includes(qid)) {
      setSelectedQuestionIds([...selectedQuestionIds, qid]);
    }

    // Store the answer status as true in local storage
    localStorage.setItem(`answer_${qid}`, true);
  };

  let message;
  if (showCorrectAnswer && submitted) {
    if (correctAnswer === userAnswer) {
      message = (
        <span
          style={{ marginLeft: "10px", fontWeight: "bolder", color: "Green" }}
        >
          Correct Answer!
        </span>
      );
    } else {
      message = (
        <span style={{ marginLeft: "10px", fontWeight: "bold", color: "red" }}>
          Correct Answer is: {correctAnswer}
        </span>
      );
    }
  }

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // ======================================================================
//---------Keyboard_disabled_For_numberplate_inputFields_start-------------
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault(); 
      event.stopPropagation(); 
    };
    // Attach event listener to intercept keydown events
    document.addEventListener("keydown", handleKeyDown);
    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); 
  //---------Keyboard_disabled_For_numberplate_inputFields_end-------------
  // ======================================================================

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
    let notAnswered = 1; // Set default value to 1
    let marked = 0;
    let markedForReview = 0;
    let Visited = 0;

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

    // Update notAnswered if there are actual notAnswered questions
    if (notAnswered === 1 && answered !== 0) {
      notAnswered = 0;
    }

    setAnsweredCount(answered);
    setNotAnsweredCount(notAnswered);
    setAnsweredmarkedForReviewCount(marked);
    setMarkedForReviewCount(markedForReview);
    setVisitedCount(Visited);
  };

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


  // ------------------------TIMER_FUNCTION_START------------------------------
  const [timer, setTimer] = useState(0);
  // const [timers, setTimers] = useState(Array(questionData));
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
  // ------------------------------------------END_OF_TIMER FUNCTION------------------------
  // ======================================================================
  // ----------------Overall_time_START-----------------------
  const [wtimer, setWTimer] = useState(0);
  const WformatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
    // return hours * 3600 + minutes * 60 + seconds;
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
  // ----------------Overall_time_END-----------------------
  // ======================================================================


  const onAnswerSelected1 = (optionIndex) => {
    const questionId = questionData.questions[currentQuestionIndex].question_id;
    const charcodeatopt = String.fromCharCode("a".charCodeAt(0) + optionIndex);

    // console.log("questionId from onAnswerSelected1 : ", questionId);
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

  const handleAnswerSelected = (e, questionId) => {
    const answer = e.target.value.trim();
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
    setValue(answer); // Update the current answer value
  };

  //----------USER_DATA_FETCHING_START--------------
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
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchUserData();
  }, []);
//----------USER_DATA_FETCHING_END--------------

  //-----------useEffect_counts_FUNCTIONALITY
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

  //------------FETCHING_QUESTION_OPTIONS_START-----------------
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptionsForPB/${testCreationTableId}/${userData.id}`
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
 //------------FETCHING_QUESTION_OPTIONS_END-------------------

  const currentQuestion =
    questionData.questions && questionData.questions[currentQuestionIndex];

  //------------FETCHING_USER_DATA_START-----------
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
  //------------FETCHING_USER_DATA_END-----------

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



    // ======================================================================
  //---------------HANDLE_BUTTON_FUNCTIONS_START---------------------

  const handleQuestionSelect = async (questionNumber) => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptionsForPB/${testCreationTableId}/${userData.id}`
      );
      setActiveIndex(questionNumber);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);

      const prevQuestion = data.questions[questionNumber - 1]; // Changed here
      const prevQuestionId = prevQuestion ? prevQuestion.question_id : null; // Changed here

      // Check if the answer status is available in local storage
      const answerStatus = localStorage.getItem(`answer_${prevQuestionId}`);
      if (answerStatus === "true") {
        setShowSolution(false);
        setButtonText("View Solution");
      } else {
        setShowSolution(false);
        setButtonText("Submit");
      }

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
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  const handleYes = async () => {
    try {
      const userId = userData.id;
      console.log("sddvfnjdxnvjkncmvncx");
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

  const handlePreviousClick = () => {
    setShowSolution(false);
    setButtonText("View Solution");
    setCurrentQuestionIndex((prevIndex) => {
      const updatedTimers = [...timers];
      updatedTimers[prevIndex] = timer;
      setTimers(updatedTimers);
      return prevIndex - 1;
    });

    fetchData();
    setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);

    const currentQuestion = questionData.questions[currentQuestionIndex];
    const updatedQuestionStatus = [...questionStatus];
    // Check if the current question is answered
    const calculatorInputValue = value;
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";
    if (!isCurrentQuestionAnswered) {
      // If the current question is not answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
      console.log(currentQuestionIndex);
      console.log(updatedQuestionStatus);

      // You may also show a message or perform other actions to indicate that the question is not answered
      console.log("Question not answered!");
    } else {
      updatedQuestionStatus[currentQuestionIndex] = "answered";
      setQuestionStatus(updatedQuestionStatus);
      // Log a message indicating that the question is answered
      console.log("Question answered!");
    }

    // Set the previous question status to notAnswered
    const previousQuestionIndex = currentQuestionIndex - 1;
    if (previousQuestionIndex >= 0) {
      const updatedQuestionStatus = [...questionStatus];
      if (updatedQuestionStatus[previousQuestionIndex] === "answered") {
        setQuestionStatus(updatedQuestionStatus);
      } else {
        updatedQuestionStatus[previousQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
      }
    }
    // -------------------------------
    const isNATQuestionAnswered =
      currentQuestionType.includes("NATD") ||
      currentQuestionType.includes("NATI");

    // -----------------------------------------
    if (currentQuestionIndex > 0) {
      const prevQuestion = questionData.questions[currentQuestionIndex - 1];
      const prevQuestionId = prevQuestion.question_id;

      // Check if the answer status is available in local storage
      const answerStatus = localStorage.getItem(`answer_${prevQuestionId}`);
      if (
        answerStatus === "true" ||
        (isNATQuestionAnswered && answerStatus === "true")
      ) {
        setShowSolution(false);
        setButtonText("View Solution");
        console.log("NATQuestion Answered");
      } else {
        setShowSolution(false);
        setButtonText("Submit");
      }

      // Retrieve the stored answer from local storage using the question ID
      const value = localStorage.getItem(`calculatorValue_${prevQuestionId}`);
      // Retrieve the stored value from local storage using the question ID
      const storedValue = localStorage.getItem(prevQuestionId);

      // Retrieve the stored value with storage key
      const storedValueWithKey = localStorage.getItem(STORAGE_KEY);

      console.log(
        "Stored Value for question",
        prevQuestionId,
        ":",
        storedValue
      );
      console.log(
        "Stored Value with key",
        STORAGE_KEY,
        ":",
        storedValueWithKey
      );
      console.log(
        `Stored Value of currentQuestionIndex is: ${storedValueWithKey}   ${storedValue}`
      );
      if (value !== null) {
        // Parse the stored answer
        const parsedValue = JSON.parse(value).value;

        // Retrieve the user's response for the previous question
        const prevUserResponse = option.ans !== null ? option.ans : parsedValue;

        // Retrieve the correct answer for the previous question
        const prevCorrectAnswer = calc[currentQuestionIndex - 1]; // Assuming calc is an array of correct answers

        // Compare the user's response with the correct answer
        if (parseFloat(prevUserResponse) === parseFloat(prevCorrectAnswer)) {
          console.log("Correct Answer!");
          // Display "Correct Answer!" message
        } else {
          console.log("Correct Answer is:", prevCorrectAnswer);
          // Display the correct answer
        }
      } else {
        // Clear the input if there is no stored answer
        setValue("");
      }
    }
    if (currentQuestionIndex === questionData.questions.length - 1) {
      setCompleteButtonText("Next");
    }
  };

  const clearResponse = async () => {
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const calculatorInputValue = value;
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
        console.log("Response cleared successfully");
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

  const isNATQuestionAnswered =
    currentQuestionType.includes("NATD") ||
    currentQuestionType.includes("NATI");
  const isQuestionAnswered =
    currentQuestionType.includes("MSQ") ||
    currentQuestionType.includes("MSQN") ||
    currentQuestionType.includes("MCQ4") ||
    currentQuestionType.includes("MCQ5") ||
    currentQuestionType.includes("CTQ");

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

  useEffect(() => {
    setShowSolution(false); // Set showSolution to true when moving to another question
  }, [currentQuestionIndex]);

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

  const handleUpdateOption = (value) => {
    setOption({ ans: value });
  };

  window.addEventListener("beforeunload", function (event) {
    // Get the specific items you want to retain
    let itemsToRetain = [
      "isLoggedIn",
      "student_dashboard_state",
      "userRole",
      "greeting",
      "token",
    ];
    let retainedItems = {};

    // Iterate over the specific items and store them in a temporary object
    itemsToRetain.forEach((item) => {
      let value = localStorage.getItem(item);
      if (value !== null) {
        retainedItems[item] = value;
      }
    });

    // Clear all items from local storage
    localStorage.clear();

    // Set back the specific items if user is logged in
    if (retainedItems["isLoggedIn"] === "true") {
      Object.entries(retainedItems).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }
  });

  return (
    <div className="QuestionPaper_-container">
      <>
        {showPopupallpb ? (
          <div className="popup">
            <button
              onClick={() => {
                handleendthetestrestart(userData.id);
              }}
              style={{
                background: "green",
                color: "white",
                display: "flex",
                gap: "0.2rem",
                alignItems: "center",
              }}
            >
              Restart
              <span>
                <IoReloadCircle
                  style={{
                    fontSize: "1.8rem",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />
              </span>
            </button>
          </div>
        ) : null}
      </>
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

            {/* ---------- quiz question container -------------------- */}
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
                                                onClick={(e) =>
                                                  handleAnswerSelected(
                                                    e,
                                                    currentQuestion.question_id
                                                  )
                                                }
                                                onChange={(e) =>
                                                  onAnswerSelected3(e)
                                                }
                                                placeholder="Enter your answer NATD"
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
                                              />
                                              {selectedQuestionId.map(
                                                (questionId, index) => {
                                                  const storedAnswer =
                                                    localStorage.getItem(
                                                      `answer_${questionId}`
                                                    );
                                                  const {
                                                    correct,
                                                    correctAnswer,
                                                  } = storedAnswer
                                                    ? JSON.parse(storedAnswer)
                                                    : {};

                                                  return (
                                                    <div key={questionId}>
                                                      {showCorrectAnswer &&
                                                        submitted &&
                                                        questionId ===
                                                          currentQuestion.question_id && (
                                                          <>
                                                            {correct !==
                                                              undefined &&
                                                              !correct && (
                                                                <div>
                                                                  <p
                                                                    style={{
                                                                      marginLeft:
                                                                        "10px",
                                                                      fontWeight:
                                                                        "bold",
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                  >
                                                                    Wrong
                                                                    Answer!
                                                                  </p>
                                                                  <p>
                                                                    Correct
                                                                    Answer:{" "}
                                                                    {
                                                                      correctAnswer
                                                                    }
                                                                  </p>
                                                                </div>
                                                              )}
                                                            {correct !==
                                                              undefined &&
                                                              correct && (
                                                                <span
                                                                  style={{
                                                                    marginLeft:
                                                                      "10px",
                                                                    fontWeight:
                                                                      "bolder",
                                                                    color:
                                                                      "green",
                                                                  }}
                                                                >
                                                                  Correct
                                                                  Answer!
                                                                </span>
                                                              )}
                                                          </>
                                                        )}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="DEL"
                                                onClick={(e) => {
                                                  if (option.ans !== null) {
                                                    // If option.ans is not null, clear it
                                                    option.ans = null;
                                                  } else {
                                                    setValue("");
                                                  }
                                                }}
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the DEL button if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable number buttons if submitted
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
                                                //  disabled={option.ans || submitted}
                                                placeholder="Enter your answer NATI"
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
                                              />
                                              {selectedQuestionId.map(
                                                (questionId, index) => {
                                                  const storedAnswer =
                                                    localStorage.getItem(
                                                      `answer_${questionId}`
                                                    );
                                                  const {
                                                    correct,
                                                    correctAnswer,
                                                  } = storedAnswer
                                                    ? JSON.parse(storedAnswer)
                                                    : {};

                                                  return (
                                                    <div key={questionId}>
                                                      {showCorrectAnswer &&
                                                        submitted &&
                                                        questionId ===
                                                          currentQuestion.question_id && (
                                                          <>
                                                            {correct !==
                                                              undefined &&
                                                              !correct && (
                                                                <div>
                                                                  <p
                                                                    style={{
                                                                      marginLeft:
                                                                        "10px",
                                                                      fontWeight:
                                                                        "bold",
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                  >
                                                                    Wrong
                                                                    Answer!
                                                                  </p>
                                                                  <p>
                                                                    Correct
                                                                    Answer:{" "}
                                                                    {
                                                                      correctAnswer
                                                                    }
                                                                  </p>
                                                                </div>
                                                              )}
                                                            {correct !==
                                                              undefined &&
                                                              correct && (
                                                                <span
                                                                  style={{
                                                                    marginLeft:
                                                                      "10px",
                                                                    fontWeight:
                                                                      "bolder",
                                                                    color:
                                                                      "green",
                                                                  }}
                                                                >
                                                                  Correct
                                                                  Answer!
                                                                </span>
                                                              )}
                                                          </>
                                                        )}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="DEL"
                                                onClick={(e) => {
                                                  if (option.ans !== null) {
                                                    // If option.ans is not null, clear it
                                                    option.ans = null;
                                                  } else {
                                                    // If option.ans is null, remove the last character from value
                                                    setValue(
                                                      String(value).slice(0, -1)
                                                    );
                                                  }
                                                }}
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
                                              />
                                              <input
                                                type="button"
                                                value="8"
                                                onClick={(e) =>
                                                  setValue(
                                                    value + e.target.value
                                                  )
                                                }
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="button"
                                                value="4"
                                                onClick={(e) => {
                                                  if (!option.ans) {
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    );
                                                  }
                                                }}
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                                disabled={isQuestionSubmitted(
                                                  currentQuestion.question_id
                                                )} // Disable the input field if submitted
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
                                              disabled={submittedQuestions.includes(
                                                currentQuestion.question_id
                                              )}
                                              // disabled={submitted}
                                            />
                                            <label htmlFor="">
                                              ({option.option_index})
                                            </label>
                                            <img
                                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                              alt={`Option ${option.option_id}`}
                                            />

                                            {submitted && (
                                              <>
                                                {selectedQuestionId.includes(
                                                  currentQuestion.question_id
                                                ) && (
                                                  <>
                                                    {option.option_index ===
                                                      currentQuestion.answer.answer_text.trim() && (
                                                      <span className="correct-answer-mark">
                                                        &#10004;
                                                      </span>
                                                    )}
                                                    {selectedAnswersMap1[
                                                      currentQuestion
                                                        .question_id
                                                    ] === optionIndex &&
                                                      option.option_index !==
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span className="wrong-answer-mark">
                                                          x
                                                        </span>
                                                      )}
                                                  </>
                                                )}
                                              </>
                                            )}
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
                                              disabled={submittedQuestions.includes(
                                                currentQuestion.question_id
                                              )}
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
                                            {submitted && (
                                              <>
                                                {selectedQuestionId.includes(
                                                  currentQuestion.question_id
                                                ) && (
                                                  <>
                                                    {option.option_index ===
                                                      currentQuestion.answer.answer_text.trim() && (
                                                      <span className="correct-answer-mark">
                                                        &#10004;
                                                      </span>
                                                    )}
                                                    {selectedAnswersMap1[
                                                      currentQuestion
                                                        .question_id
                                                    ] === optionIndex &&
                                                      option.option_index !==
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span className="wrong-answer-mark">
                                                          &#10060;
                                                        </span>
                                                      )}{" "}
                                                  </>
                                                )}
                                              </>
                                            )}
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
                                              disabled={submittedQuestions.includes(
                                                questionData.questions[
                                                  currentQuestionIndex
                                                ]?.question_id
                                              )}
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
                                            {selectedQuestionIds.includes(
                                              currentQuestion.question_id
                                            ) && (
                                              <>
                                                {finalTryMap
                                                  .get(
                                                    currentQuestion.question_id
                                                  )
                                                  ?.map((value, index) => (
                                                    <span
                                                      key={`correct_${index}`}
                                                    >
                                                      {value ===
                                                        optionIndex && (
                                                        <span className="correct-answer-mark">
                                                          &#10004;
                                                        </span>
                                                      )}
                                                    </span>
                                                  ))}
                                                {finalTry2Map
                                                  .get(
                                                    currentQuestion.question_id
                                                  )
                                                  ?.map((value, index) => (
                                                    <span
                                                      key={`wrong_${index}`}
                                                    >
                                                      {value ===
                                                        optionIndex && (
                                                        <span className="wrong-answer-mark">
                                                          &#10060;
                                                        </span>
                                                      )}
                                                    </span>
                                                  ))}
                                                {finalTry3Map
                                                  .get(
                                                    currentQuestion.question_id
                                                  )
                                                  ?.map((value, index) => (
                                                    <span
                                                      key={`missing_${index}`}
                                                    >
                                                      {value ===
                                                        optionIndex && (
                                                        <span className="correct-answer-mark">
                                                          MissingCorrectOption:&#10004;
                                                        </span>
                                                      )}
                                                    </span>
                                                  ))}
                                              </>
                                            )}
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
                                              disabled={submittedQuestions.includes(
                                                questionData.questions[
                                                  currentQuestionIndex
                                                ]?.question_id
                                              )}
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
                                            {selectedQuestionIds.includes(
                                              currentQuestion.question_id
                                            ) && (
                                              <>
                                                {finalTryMap
                                                  .get(
                                                    currentQuestion.question_id
                                                  )
                                                  ?.map((value, index) => (
                                                    <span
                                                      key={`correct_${index}`}
                                                    >
                                                      {value ===
                                                        optionIndex && (
                                                        <span className="correct-answer-mark">
                                                          &#10004;
                                                        </span>
                                                      )}
                                                    </span>
                                                  ))}
                                                {finalTry2Map
                                                  .get(
                                                    currentQuestion.question_id
                                                  )
                                                  ?.map((value, index) => (
                                                    <span
                                                      key={`wrong_${index}`}
                                                    >
                                                      {value ===
                                                        optionIndex && (
                                                        <span className="wrong-answer-mark">
                                                          &#10060;
                                                        </span>
                                                      )}
                                                    </span>
                                                  ))}
                                                {finalTry3Map
                                                  .get(
                                                    currentQuestion.question_id
                                                  )
                                                  ?.map((value, index) => (
                                                    <span
                                                      key={`missing_${index}`}
                                                    >
                                                      {value ===
                                                        optionIndex && (
                                                        <span className="correct-answer-mark">
                                                          MissingCorrectOption:&#10004;
                                                        </span>
                                                      )}
                                                    </span>
                                                  ))}
                                              </>
                                            )}
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
                                              disabled={submittedQuestions.includes(
                                                currentQuestion.question_id
                                              )}
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
                                            {submitted && (
                                              <>
                                                {selectedQuestionId.includes(
                                                  currentQuestion.question_id
                                                ) && (
                                                  <>
                                                    {option.option_index ===
                                                      currentQuestion.answer.answer_text.trim() && (
                                                      <span
                                                        id="correct_mark"
                                                        className="correct-answer-mark"
                                                      >
                                                        &#10004;
                                                      </span>
                                                    )}
                                                    {selectedAnswersMap1[
                                                      currentQuestion
                                                        .question_id
                                                    ] === optionIndex &&
                                                      option.option_index !==
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span
                                                          id="wrong_mark"
                                                          className="wrong-answer-mark"
                                                        >
                                                          &#10060;
                                                        </span>
                                                      )}{" "}
                                                  </>
                                                )}
                                              </>
                                            )}
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
                                              disabled={submittedQuestions.includes(
                                                currentQuestion.question_id
                                              )}
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
                                            {submitted && (
                                              <>
                                                {selectedQuestionId.includes(
                                                  currentQuestion.question_id
                                                ) && (
                                                  <>
                                                    {option.option_index ===
                                                      currentQuestion.answer.answer_text.trim() && (
                                                      <span className="correct-answer-mark">
                                                        &#10004;
                                                      </span>
                                                    )}
                                                    {selectedAnswersMap1[
                                                      currentQuestion
                                                        .question_id
                                                    ] === optionIndex &&
                                                      option.option_index !==
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span className="wrong-answer-mark">
                                                          &#10060;
                                                        </span>
                                                      )}
                                                  </>
                                                )}
                                              </>
                                            )}
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
                      <Tooltip title="Click here to Submit answer" arrow>
                        <button
                          className="Quiz_Save_MarkforReview"
                          onClick={() => {
                            handleQType(
                              currentQuestionType,
                              questionData.questions[currentQuestionIndex]
                                .question_id
                            );
                          }}
                          disabled={showSolution && buttonText === "Submit"}
                        >
                          {/* Check if it's a NATD or NATI question */}
                          {(currentQuestionType.includes("NATD") ||
                            currentQuestionType.includes("NATI")) &&
                            // If NATD or NATI question
                            (isNATQuestionAnswered ? (
                              // If answered, show "View Solution" button
                              <div className="view_sol_btn">{buttonText}</div>
                            ) : (
                              <div className="view_sol_btn">buttonText</div>
                            ))}

                          {(currentQuestionType.includes("MCQ4") ||
                            currentQuestionType.includes("MCQ5") ||
                            currentQuestionType.includes("MSQ") ||
                            currentQuestionType.includes("MSQN")) && (
                            // If MCQ4, MCQ5, MSQ, or MSQN question
                            <div className="view_sol_btn">
                              {isQuestionAnswered ? buttonText : buttonText}
                            </div>
                          )}
                        </button>
                      </Tooltip>

                      <Tooltip title="Click here to  End the Test" arrow>
                        <button
                          className="Quiz_Save_MarkforReview"
                          onClick={() => {
                            handleendthetest(userData.id);
                          }}
                          disabled={showSolution && buttonText === "Submit"}
                        >
                          End Test
                        </button>
                      </Tooltip>
                    </div>

                    <div className="quiz_Next_back">
                      <Tooltip title="Click here to go Back" arrow>
                        <button
                          className="previous-btn"
                          onClick={handlePreviousClick}
                          disabled={currentQuestionIndex === 0}
                        >
                          <i className="fa-solid fa-angles-left"></i> Back
                        </button>
                      </Tooltip>
                      <Tooltip title="Click here to go Next" arrow>
                        <button onClick={onNextQuestion}>
                          Next<i class="fa-solid fa-angles-right"></i>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </>
              )}
            </div>

            {showSolution && (
              <div className="solution-card ">
                <div>
                  <h2>Solution:</h2>
                  {currentQuestion.solution &&
                    currentQuestion.solution.solutionImgName && (
                      <div className="solution_div">
                        <img
                          src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${currentQuestion.solution.solutionImgName}`}
                          alt={`solutionImage ${currentQuestion.solution.solution_id}`}
                        />
                        <button
                          className="card_clse_btnn"
                          onClick={handlecloseSolution}
                        >
                          x
                        </button>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          <div className="quiz_exam_interface_body_right_container">
            {/* --------------- rightSide_bar -------------------- */}
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
                <OQB_ButtonsFunctionality
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
                  seconds={600}
                  onUpdateOption={handleUpdateOption}
                  option={option}
                  setButtonText={setButtonText}
                  activeIndex={activeIndex}
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
              <Tooltip title="Yes" arrow>
                <>
                  <Link
                    className="es_btn"
                    to={`/TestResultsPage/${testCreationTableId}/${userData.id}`}
                    onClick={handleYes}
                  >
                    Yes
                  </Link>
                </>
              </Tooltip>
              <Tooltip title="No" arrow>
                <button className="es_btn" onClick={handleNo}>
                  NO
                </button>
              </Tooltip>
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

export default Practice_QuestionBank_QuizPage;
