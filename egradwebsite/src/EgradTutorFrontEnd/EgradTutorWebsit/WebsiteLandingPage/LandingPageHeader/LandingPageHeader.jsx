import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig.js";
import axios from "axios";

import JSONClasses from "../../JSONForCSS/JSONClasses";
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context.js'

import LandingPageHeaderEdit from './LandingPageHeaderEdit'

import '../../../../styles/Default_landingPage_styles.css'
import '../../../../styles/Theme1_landingPage_styles.css'
import '../../../../styles/Theme2_landingPage_styles.css'
import '../../../../styles/LandingPage_main.css'

const LandingPageHeader = () => {
  const [image, setImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [enableEdit, setEnableEdit] = useState("Enable Edit");
  const [welcomeDataList, setWelcomeDataList] = useState([]);
  const [enableEditcontainer, setEnableEditcontainer] = useState(false);
  const themeFromContext = useContext(ThemeContext);
  console.log(themeFromContext, "this is the theme from the context")


  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Main_Header/welcome`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWelcomeDataList([data]);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);



  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${BASE_URL}/Main_Header/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(`Image uploaded/updated with ID: ${response.data.id}`);
      fetchImage();
      setShowForm(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Main_Header/image`, {
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

  const handleenableEdit = () => {
    if (enableEdit === "Enable Edit") {
      setEnableEdit("Disable Edit");
      setEnableEditcontainer(true);
    } else {
      setEnableEdit("Enable Edit");
      setEnableEditcontainer(false);
    }
  };



  const userRole = localStorage.getItem("userRole");

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
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        // Navigate("/uglogin");
        return;
      }

      if (response.ok) {
        // Token is valid, continue processing user data
        const userData = await response.json();
        setUserData(userData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")

  return (
    <div className="Newlandingpage">
      <div className={`Newlandingpage_logocontainer ${themeDetails.themeHeaderColor}`}>
        <div className={`Newlandingpage_logosubcontainer ${themeDetails.themeSubContainer}`}>
          <div className={`logo_Img_container ${themeDetails.themeLogoImgC}`}>
            {image ? (
              <img src={image} className={`${themeDetails.themeLogoImg}`} alt="Current" />
            ) : (
              <p>No image available</p>
            )}

            <div className={`logoImgContainer ${themeDetails.logoC}`}>
              {/* {enableEditcontainer ? (
                <>
                  <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Hide" : "logo info"}
                  </button>
                  {showForm && (
                    <div>
                      <h2>Upload Image</h2>
                      <input type="file" onChange={handleImageChange} />
                      <button onClick={handleUpload}>Submit</button>
                    </div>
                  )}
                </>
              ) : null} */}
            </div>
          </div>
          {/* // copy after return to rendor on screen when admin in logged in start */}
          {isLoggedIn === true ? (
            <>
              {(userRole === "admin" ||
                userRole === "ugotsadmin" ||
                userRole === "ugadmin") && (
                  <>
                    <button
                      onClick={handleenableEdit}
                      className={
                        enableEdit === "Disable Edit" ? "disabled-edit" : ""
                      }
                    >
                      {enableEdit}
                    </button>
                  </>
                )}
            </>
          ) : null}
          {/* // copy after return to rendor on screen when admin in logged in end */}

        </div>
      </div>



      <LandingPageHeaderEdit />
    </div>
  )
}

export default LandingPageHeader