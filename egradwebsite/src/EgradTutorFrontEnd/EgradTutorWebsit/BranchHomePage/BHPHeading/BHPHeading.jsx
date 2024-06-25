import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import axios from 'axios';
import BASE_URL from '../../../../apiConfig';
import '../../../../styles/UGHomePage/ugHomePageTheme1.css'
import '../../../../styles/UGHomePage/ugHomePageTheme2.css'
import { RxHamburgerMenu } from "react-icons/rx";
import '../../../../styles/UGHomePage/UgHomePage_Default_Theme.css'
import defaultImage from "../../../../assets/defaultImage.png";
const BHPHeading = () => {
  const [image, setImage] = useState(null);

  // setting an image
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

  const themeFromContext = useContext(ThemeContext);
  const refreshChannel = new BroadcastChannel("refresh_channel");
  // Listen for messages from other pages
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload(); // Reload the page
    }
  };
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
  // fetching for navitems

const[showLinks,setShowLinks]=useState(false)

  return (
    <div className={`Ug_Home_Page_First_Container${themeDetails.themeUgHomePageFirstContainer}`}>
      {/* {header with logooo} */}
      <div className={`Ug_Home_Container  ${themeDetails.themeUgHomeContainer}`}>
        <div className={`Ug_HeaderSection ${themeDetails.themeUgHeaderSec}`}>
          <div className={`"Ug_header_Container main-nav ${themeDetails.themeUgHeaderContainer}`} >
            <div className={`Ug_header_logoIMG ${themeDetails.themeUgHeaderLogoImg}`}>
            {image ? (
                <Link to="/">
                <img
                  src={image}
                  className={`${themeDetails.themeLogoImg}`}
                  alt="Current"
                /></Link>
              ) : (
                <img src={defaultImage} alt="Default" />
              )}
            </div>
            <div className={`${showLinks?"menu-link mobileMenuLink":"menu-link"} ${themeDetails.themeUgDivLinksOfHeader}`}>
              <Link
                to="/otsHomePage"
                target="_blank"

              >
                Online Test Series
              </Link>
              <Link
                to="/orvlHomePage"
                target="_blank"

              >
                Online Recorded Video Lectures
              </Link>
              <Link
                to="/oqbHomePage"
                target="_blank"

              >
                Online Question Bank
              </Link>
              
            </div>
            <div className="hamburgerMenu" onClick={()=>{setShowLinks(!showLinks);console.log(showLinks,"this is from onclick of hMenu")}}> <RxHamburgerMenu />
              </div>
          </div>
          <div />

        </div>
      </div>


    </div>
  )
}

export default BHPHeading