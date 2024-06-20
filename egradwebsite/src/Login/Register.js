import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
// ------------------ icons -----------------------
import { MdAlternateEmail } from "react-icons/md";
import { FaLock, FaUserAlt, FaImage } from "react-icons/fa";
import BASE_URL from "../apiConfig";
import defaultImage from '../assets/defaultImage.png'; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [smessage, setSMessage] = useState("");
  const [image, setImage] = useState(null);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  const isUsernameValid = (username) => {
    return username.length >= 3;
  };

const handleRegister = async (e) => {
  e.preventDefault();
  


  if (!isEmailValid(email)) {
    setMessage("Please enter a valid email address.");
    return;
  }

  if (!isUsernameValid(username)) {
    setMessage("Username should be at least 3 characters long.");
    return;
  }

  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  if (profileImage) {
    formData.append("profileImage", profileImage, profileImage.name); // Append the image file with its name
  }

 try {
   const response = await axios.post(
     `${BASE_URL}/LoginApis/register`,
     formData,
     {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     }
   );

   console.log("123");
   console.log(formData);

   if (response.status === 201) {
     // Check for successful registration status
     setSMessage("User registered successfully. Login details sent to email.");
     setMessage("");
     setUsername("");
     setEmail("");
     setPassword("");
     setProfileImage(null);
     window.location.href = "/userlogin";
   }
 } catch (error) {
   setMessage(error.response?.data?.error || "Error registering user");
   console.error("Error:", error);
 }
};

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
useEffect(() => {  fetchImage();
}, []);
  return (
    <>
      <div>
        <div>
          <div className="Quiz_main_page_header">
            
                <>
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
                        <Link
                          to="/Exam_portal_home_page"
                          className="Quiz__home"
                        >
                          Home
                        </Link>
                      </button>
                      <div>
                        <a class="ugQUIz_login_btn" href="/uglogin">
                          Login
                        </a>
                      </div>
                    </div>
                  </div>
                </>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="ug_logincontainer">
        <div className="ug_logincontainer_box">
          <h2>Register</h2>
          <div className="login_from_continer">
            <form onSubmit={handleRegister}>
              <label>
                <FaUserAlt />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </label>

              <label>
                <MdAlternateEmail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </label>
              {/* Input for profile image */}
              <label>
                <FaImage />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </label>

              {message && <p style={{ color: "red" }}>{message}</p>}
              {smessage && <p style={{ color: "green" }}>{smessage}</p>}

              <button type="submit">Register</button>
            </form>
            <p>
              Already have an account? <Link to="/uglogin">Login here</Link>
            </p>
          </div>
        </div>

        {/* <UploadexcelsheetStudents /> */}
      </div>
    </>
  );
};

export default Register;