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
 
  const themeFromContext = useContext(ThemeContext);
  console.log(themeFromContext, "this is the theme from the context")
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
            </div>
          </div>
        </div>
      </div>
      <LandingPageHeaderEdit />
    </div>
  )
}

export default LandingPageHeader