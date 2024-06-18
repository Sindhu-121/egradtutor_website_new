import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import axios from 'axios';
import BASE_URL from '../../../../apiConfig';
import '../../../../styles/UGHomePage/ugHomePageTheme2.css'
const BHPHeading = () => {
  const [image, setImage] = useState(null);
  // setting an image
  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Main_Header/image`, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:",error);
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
  return (
    <div>
   <div className={`Ug_Home_Container ${themeDetails.themeUgHomeContainer}`}>
   <div className={`Ug_HeaderSection ${themeDetails.themeUgHeaderSec}`}>
     <div className={`"Ug_header_Container ${themeDetails.themeUgHeaderContainer}`} >
       <div className={`Ug_header_logoIMG ${themeDetails.themeUgHeaderLogoImg}`}>
         {image ? (
           <img src={image} alt="Current" />
         ) : (
           <p>No image available</p>
         )}
       </div>
       <div className={`${themeDetails.themeUgDivLinksOfHeader}`}>
         <Link
           to="/otsHomePage"
           target="_blank"

         >
           OTS
         </Link>
         <Link
           to="/orvlHomePage"
           target="_blank"

         >
           ORVL
         </Link>
         <Link
           to="/oqbHomePage"
           target="_blank"

         >
           OQB
         </Link>
       </div>
     </div>
     <div/>
     
     </div></div>
     </div>
  )
}

export default BHPHeading