import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig.js";
import axios from "axios";
import defaultImage from "../../../../assets/defaultImage.png";
import JSONClasses from "../../JSONForCSS/JSONClasses";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context.js";

import LandingPageHeaderEdit from "./LandingPageHeaderEdit";

import "../../../../styles/Default_landingPage_styles.css";
import "../../../../styles/Theme1_landingPage_styles.css";
import "../../../../styles/Theme2_landingPage_styles.css";
import "../../../../styles/LandingPage_main.css";

const LandingPageHeader = () => {
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [welcomeimage, setWelcomeImage] = useState(null);
  const [welcomeDataList, setWelcomeDataList] = useState([]);
  const [showwelcomeForm, setShowWelcomeForm] = useState(false);
  const [fetchError, setFetchError] = useState(false); // State to handle fetch errors

  const themeFromContext = useContext(ThemeContext);

  // Fetching the logo
  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/LandingPageHeader/image`, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // Fetching the welcome data
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageHeader/welcome`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWelcomeDataList([data]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(true); // Set fetch error state to true
    }
  };

  // Fetching welcome image
  const fetchWelcomeImage = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/LandingPageHeader/welcomeimage`,
        {
          responseType: "arraybuffer",
        }
      );
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setWelcomeImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchImage();
    fetchData();
    fetchWelcomeImage();
  }, []);

  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];

  return (
    <div className="Newlandingpage">
      <div>
        {/* Adding Logo button */}
        <div>
          <button onClick={() => setShowImage(!showImage)}>
            {showImage ? "Close" : "Add Logo"}
          </button>
          {showImage && <LandingPageHeaderEdit type="addLogo" />}
        </div>
        {/* Logo image fetching */}
        <div
          className={`Newlandingpage_logocontainer ${themeDetails.themeHeaderColor}`}
        >
          <div
            className={`Newlandingpage_logosubcontainer ${themeDetails.themeSubContainer}`}
          >
            <div className={`logo_Img_container ${themeDetails.themeLogoImgC}`}>
              {image ? (
                <img
                  src={image}
                  className={`${themeDetails.themeLogoImg}`}
                  alt="Current"
                />
              ) : (
                <img src={defaultImage} alt="Default" />
              )}
              <div className={`logoImgContainer ${themeDetails.logoC}`}></div>
            </div>
          </div>
        </div>
        {/* Logo image fetching End */}
      </div>
      <div>
        {/* Adding Welcome info button */}
        <div>
          <button onClick={() => setShowWelcomeForm(!showwelcomeForm)}>
            {showwelcomeForm ? "Close" : "Add Welcome info"}
          </button>
          {showwelcomeForm && <LandingPageHeaderEdit type="WelcomeForm" />}
        </div>
        {/* Welcome image and data fetching */}
        <div
          className={`landing_content_div_container ${themeDetails.themeLandingParentContainer}`}
        >
          <div className={`landing_img_div ${themeDetails.themeLCapImgDiv}`}>
            {welcomeimage ? (
              <img src={welcomeimage} alt="welcomeCurrent" />
            ) : (
              <img src={defaultImage} alt="Default" />
            )}
          </div>
          <div
            className={`landing_heading_div_container ${themeDetails.themeCapTextContainer}`}
          >
            <div className={`${themeDetails.themeTextContainer}`}>
              {fetchError ? (
                <div>
                  <h1>Error fetching welcome data.</h1>
                  <p>Please try again later.</p>
                </div>
              ) : welcomeDataList.length > 0 ? (
                welcomeDataList.map((welcomeData) => (
                  <div key={welcomeData.welcome_id}>
                    <h1>{welcomeData.welcome_text}</h1>
                    <p>{welcomeData.welcome_longtext}</p>
                  </div>
                ))
              ) : (
                <div>
                  <h1>No welcome data available.</h1>
                  <p>Please add welcome information.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Welcome image and data fetching end */}
      </div>
    </div>
  );
};

export default LandingPageHeader;
