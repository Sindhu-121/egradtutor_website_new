import React, { useState, useEffect } from "react";
import { Link, Navigate,useParams } from "react-router-dom";
// import { NavData } from "../components/ug_homepage/components/Header/NavData";
import "./Login.css";
import axios from "axios";
import { MdAlternateEmail } from "react-icons/md";
import defaultImage from '../assets/defaultImage.png'; 
import { FaLock } from "react-icons/fa";
import BASE_URL from "../apiConfig";
const AdminLogin = () => {
  const { EntranceExams_Id } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [image, setImage] = useState(null);

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
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/LoginApis/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "same-origin",
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const { token, user } = responseData;

        if (user.role === "viewer") {
          throw new Error("Invalid credentials");
        }

        localStorage.setItem("token", token); // Store the token in localStorage
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("isLoggedIn", "true");

        // Get the current time
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        // Determine the greeting based on the current hour
        let greeting = "";
        if (currentHour < 12) {
          greeting = "Good Morning,";
        } else if (currentHour < 18) {
          greeting = "Good Afternoon,";
        } else {
          greeting = "Good Evening,";
        }

        // Set the greeting message in localStorage
        localStorage.setItem("greeting", greeting);

        setMessage("Login successful!");
        setEmail("");
        setPassword("");
        window.location.href = "/"; // Redirect to the desired page after successful login
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to login");
      }
    } catch (error) {
      setMessage(error.message || "Error logging in");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        fetchUserData();
      }
    };
    checkLoggedIn();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/LoginApis/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        return <Navigate to="/userlogin" />;
      }

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/userlogin";
  };

  const handleYesClick = () => {
    handleLogout();
  };

  const handleNoClick = () => {
    window.location.href = "/UgadminHome";
  };

  if (isLoggedIn) {
    return (
      <div className="logout">
        <div className="logout-conatiner">
          <p>Are you sure you want to logout ?</p>
          <div>
            <button onClick={handleYesClick}>Yes</button>
            <button onClick={handleNoClick}>No</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="Quiz_main_page_header">
       
              <div className="Quiz_main_page_navbar">
                <div className="Quizzlogo">
                {image ? (
          <img src={image} alt="Current" />
        ) : (
          <img src={defaultImage} alt="Default" />
        )}
                </div>
                <div className="quiz_app_quiz_menu_login_btn_contaioner">
                  <button style={{ background: "none" }}>
                    <Link to={`/ExamHomePage/${EntranceExams_Id}`} className="Quiz__home">
                      Home
                    </Link>
                  </button>
                </div>
              </div>
           
         
        </div>
      </div>

      <div className="ug_logincontainer">
        <div className="ug_logincontainer_box">
          <h2>Admin Login</h2>
          <div className="ug_logincontainer_box_subbox">
            <div className="loginlogo_img">
            {image ? (
          <img src={image} alt="Current" />
        ) : (
          <img src={defaultImage} alt="Default" />
        )}
            </div>
            <div className="login_from_continer">
              <form>
                {message && <p style={{ color: "green" }}>{message}</p>}
                <label>
                  <MdAlternateEmail />
                  <input
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label>
                  <FaLock />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
                <button type="button" onClick={handleLogin}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
