import React, { useContext, useState, useEffect } from 'react'
import LandingPageExamdataEdit from './LandingPageExamdataEdit'
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import BASE_URL from '../../../../apiConfig';
import axios from 'axios';
import '../styles/Theme2_landingPage_styles.css'
const LandingPageExamdata = () => {
  const [image, setImage] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  console.log(themeFromContext, "this is the theme from the context")
  const [welcomeDataList, setWelcomeDataList] = useState([]);
  const [welcomeimage, setWelcomeImage] = useState(null);

  const [enableEdit, setEnableEdit] = useState("Enable Edit");
  const [enableEditcontainer, setEnableEditcontainer] = useState(false);
  // In the page that needs to be refreshed
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
  //  fetch welcome image
  const fetchWelcomeImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Main_Header/welcomeimage`, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setWelcomeImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  // fetching the welcome data
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

  // fetching the main header logo image
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

  useEffect(() => {
    fetchWelcomeImage();
  }, []);

  // fetching the 
  return (
    <div>
      LandingPageExamdata
      {/* have to add exam data......... */}
      <div className={`landing_content_div_container ${themeDetails.themeLandingParentContainer}`}>
        <div>
          {/* // copy after return to rendor on screen when admin in logged in start in ternary oprator start */}
          {/* {enableEditcontainer ? (
            <>
              <button onClick={() => setShowWelcomeForm(!showwelcomeForm)}>
                {showwelcomeForm ? "Hide" : "Add About Us"}
              </button>
              {showwelcomeForm && (
                <div>
                  <h2>Upload Image</h2>
                  <input type="file" onChange={handlewelcomeImageChange} />
                  <button onClick={handleWelcomeUpload}>Submit</button>

                  <h2>Add/Edit Welcome Text</h2>
                  <input
                    type="text"
                    placeholder="Welcome Text"
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                  />
                  <textarea
                    placeholder="Welcome Long Text"
                    value={welcomeLongText}
                    onChange={(e) => setWelcomeLongText(e.target.value)}
                  />
                  <button onClick={handleWelcomeSubmit}>
                    {editingId ? "Update" : "Submit"}
                  </button>
                </div>
              )}{" "}
            </>
          ) : null} */}
          {/* // copy after return to rendor on screen when admin in logged in start in ternary oprator end */}
        </div>

        {/* ======================welcome image with welcome text at UI starts here======================================= */}
        <div className={`landing_content_div_container ${themeDetails.themeLandingParentContainer}`}>
          <div className={`landing_img_div ${themeDetails.themeLCapImgDiv}`}>
            {image ? (
              <img src={welcomeimage} alt="welcomeCurrent" />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <div className={`landing_heading_div_container ${themeDetails.themeCapTextContainer}`}>
            <div className={`${themeDetails.themeTextContainer}`}>

              {welcomeDataList.map((welcomeData) => (
                <div key={welcomeData.welcome_id}>
                  <h1>{welcomeData.welcome_text}</h1>
                  <p>{welcomeData.welcome_longtext}</p>
                  {/* {enableEditcontainer ? (
                  <>
                    <button onClick={() => handleEdit(welcomeData)}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(welcomeData.welcome_id)}
                    >
                      Delete
                    </button>{" "}
                  </>
                ) : null} */}
                  {/* Add delete button */}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* =========================welcome image with welcome text at UI ends here======================================= */}
        {/* =======================Exam cards starts here============================== */}
              
        {/* =======================Exam cards ends here============================== */}

      </div>
      <LandingPageExamdataEdit />
    </div>
  )
}

export default LandingPageExamdata