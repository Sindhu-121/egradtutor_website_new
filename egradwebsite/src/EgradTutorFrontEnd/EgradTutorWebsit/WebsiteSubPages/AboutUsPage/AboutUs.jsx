import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import Footer from "../../Footer/Footer";
import defaultImage from '../../../../assets/defaultImage.png';
import AboutUsEdit from "./AboutUsEdit";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import { Link } from "react-router-dom";
const AboutUs = ({isEditMode}) => {
  const [aboutUsData, setAboutUsData] = useState([]);
  const [aboutEgradData, setAboutEgradData] = useState([]);
  const [image, setImage] = useState(null);
  const [showAboutUsForm, setShowAboutUsForm] = useState(false);
  const [showAboutEgradForm, setShowAboutEgradForm] = useState(false);
  const themeFromContext = useContext(ThemeContext);
 
 
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
    fetchAboutUsData();
    fetchAboutEgradData();
    fetchImage();
  }, []);
 
  const fetchAboutUsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_us`);
      setAboutUsData(response.data);
    } catch (error) {
      console.error("Error fetching About Us data:", error);
    }
  };
 
  const fetchAboutEgradData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_egt`);
      setAboutEgradData(response.data);
      console.log("About eGRAD Tutor data fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching About eGRAD Tutor data:", error);
    }
  };
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
 
 
  return (
    <div className={`AboutUs_Main_Container ${themeDetails.AboutUsMainContainer}`}>
 
  
<div className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`}>
      {image ? (
          <Link to="/">
          <img
            src={image}
            alt="Current"
          /></Link>
        ) : (
          <img src={defaultImage} alt="Default" />
        )}
      </div>
     
 
  <div className={`AboutUsContentMainContainer ${themeDetails.AboutUsContentMainContainer}`}>
  <h1>About Us</h1>
   
 <div className={`AboutUsContentSubContainer ${themeDetails.AboutUsContentSubContainer}`}>
      <div className={`AboutUs1stContentContainer ${themeDetails.AboutUs1stContentContainer}`} >
      {isEditMode && (
          <div>
            <button onClick={() => setShowAboutEgradForm(!showAboutEgradForm)}>
          {showAboutEgradForm ? "Close AboutEGT Form" : "Add AboutEGT"}
        </button>
        {showAboutEgradForm && <AboutUsEdit type="aboutEgrad" />}
          </div>
        )}
       
        {aboutEgradData.map((aboutEgrad) => (
          <div key={aboutEgrad.about_egt_id} className={`AboutUsImgDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`} >
            <p>{aboutEgrad.about_egt}</p>
          </div>
        ))}
      </div>


      <div className={`AboutUs_VisionContent_Container ${themeDetails.AboutUsVisionContentContainer}`} >
      {isEditMode && (
          <div>
            <button onClick={() => setShowAboutUsForm(!showAboutUsForm)}>
          {showAboutUsForm ? "Close AboutUs Form" : "Add AboutUs"}
        </button>
        {showAboutUsForm && <AboutUsEdit type="aboutUs" />}
          </div>
        )}
       
        {aboutUsData.map((aboutUs) => (
          <div key={aboutUs.about_us_id} className={`AboutUsImgVisionDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`} >
            <h2>{aboutUs.Title}</h2>
            <p>{aboutUs.Description}</p>
          </div>
        ))}
      </div>

      </div>
 
      </div>
 
   
 
 
      <Footer />
    </div>
  );
};
 
export default AboutUs;