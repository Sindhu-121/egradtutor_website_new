import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import Footer from "../../Footer/Footer";
import defaultImage from '../../../../assets/defaultImage.png';
import AboutUsEdit from "./AboutUsEdit";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import { Link } from "react-router-dom";
import capImg from '../../../../styles/AboutUsCapImg.png'
import ExamPageHeader from "../../ExamHomePage/ExamHomepageHeader/ExamPageHeader";
import '../../../../styles/AboutUs/Theme1AboutUs.css';
import '../../../../styles/AboutUs/Theme2AboutUs.css';
import Our_Vision_Img from '../../../../styles/Our_Mission_img.a4171ae2dd49cdc24875.png';
import { IoHome } from "react-icons/io5";
const AboutUs = ({ isEditMode }) => {
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
    <>
      {themeColor === 'Theme-2' &&
        <div className={`AboutUs_Main_Container ${themeDetails.AboutUsMainContainer}`}>
          <ExamPageHeader />

          <div className={`AboutUsContentMainContainer ${themeDetails.AboutUsContentMainContainer}`}>
            <div className={`${themeDetails.themeAUSection1}`}>
              <div className={`${themeDetails.themeAboutUsImgWithTextDiv}`}>
                <div className={`${themeDetails.themeAUHeadingContainer}`}>
                  <h1>About Us</h1>
                </div>
                <div>
                  <img src={capImg} alt="error while getting about us cap img" />
                </div>
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
              </div>
            </div>
            <div className={`AboutUsContentSubContainer ${themeDetails.AboutUsContentSubContainer}`}>



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
      }
      {themeColor === 'Theme-1' && <div className={`AboutUs_Main_Container ${themeDetails.themeAboutUsMainContainer}`}>
        <ExamPageHeader />

        <div className={`AboutUsContentMainContainer ${themeDetails.AboutUsContentMainContainer}`}>
          <div className={`${themeDetails.themeAUSection1}`}>
            <div className={`${themeDetails.themeAboutUsImgWithTextDiv}`}>
              <div className={`${themeDetails.themeAUHeadingContainer}`}>
                <h1>About Us</h1>
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
              </div>
              <div className={`${themeDetails.themeAboutusFlexDiv}`}>
                <div className={`${themeDetails.themeAboutusFlexDivForImg}`}>
                  <img src={capImg} alt="error while getting about us cap img" />
                </div>
              </div>
            </div>
          </div>
          <div className={`AboutUsContentSubContainer ${themeDetails.AboutUsContentSubContainer}`}>
            <div className={`AboutUs_VisionContent_Container ${themeDetails.AboutUsVisionContentContainer}`} >
              {isEditMode && (
                <div className={`our_vision ${themeDetails.AboutOurVisioin}`}>
                  <button onClick={() => setShowAboutUsForm(!showAboutUsForm)}>
                    {showAboutUsForm ? "Close AboutUs Form" : "Add AboutUs"}
                  </button>
                  {showAboutUsForm && <AboutUsEdit type="aboutUs" />}
                </div>
              )}

              {aboutUsData.map((aboutUs) => (
                <div key={aboutUs.about_us_id} className={`AboutUsImgVisionDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`} >
                  <div className={`v-m-ission_imgs  ${themeDetails.VMissionImgs}`}>
                    <img src={Our_Vision_Img} />
                  </div>
                  <div className={`v-m-ission_imgs  ${themeDetails.VMissionContainer}`}>
                    <h2>{aboutUs.Title}</h2>
                    <p>{aboutUs.Description}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>




        <Footer />
      </div>}

      {themeColor === 'Theme-default' &&

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
            <span>
              <Link to={`/`}><IoHome />Home</Link>
            </span>
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
                    <img src={capImg} alt="" />
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
                    <img src={Our_Vision_Img} alt="" />
                    <h2>{aboutUs.Title}</h2>
                    <p>{aboutUs.Description}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>




          <Footer />
        </div>
      }


    </>
  );
};

export default AboutUs;