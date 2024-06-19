import React, { useState, useEffect, useContext } from 'react'
import OurCoursesEdit from './OurCoursesEdit'
import axios from 'axios';
import BASE_URL from '../../../../apiConfig';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import { FaArrowRight } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
const OueCourses = () => {
  const [courseFeatures, setCourseFeatures] = useState([]);
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
  useEffect(() => {
    fetchCourseFeatures();
  }, []);
  const fetchCourseFeatures = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/OueCourses/course_features_with_images/1`
      );

      // Map over each feature and create image URLs
      const featuresWithImages = response.data.map((feature) => {
        if (feature.image) {
          // Set image URL if available
          return {
            ...feature,
            image: feature.image,
          };
        } else {
          return feature;
        }
      });

      // Set the features with image URLs
      setCourseFeatures(featuresWithImages);
    } catch (error) {
      console.error("Error fetching course features:", error);
      // setError(error.message);
    }
  };
  return (
    <div className={`${themeDetails.themeOurCoursesContainer}`}>
      <div className={`${themeDetails.themeCoursesHeadding}`}>
        <h2>OurCourses</h2>
        <div className={`${themeDetails.themeCoursesSubContainer}`}>
          {/* <h3 >Course Features:</h3> */}
          <ul className={`${themeDetails.themeCoursesUl}`} >
            {courseFeatures.map((feature, index) => (
              <li key={index} className={`${themeDetails.themeCourseLi}`}>
                <div className={`${themeDetails.themeCourseName}`}>
                  <strong className={`${themeDetails.themePortalName}`}>{feature.Portale_Name}</strong>
                </div>
                {/* for buttons of exams names */}
                <div className={`${themeDetails.themeFeaturesSecondContainer}`}>
                  {/* Render image if available */}
                  {feature.image && (
                      <div className={`${themeDetails.themeFeatureImgC}`}>
                        <img src={feature.image} alt={`${feature.Portale_Name}`} />
                      </div>
                    )}
                  <div className={`${themeDetails.themeFeaturesContainer}`}>
                    {feature.Features.map((item, index) => (
                      <div className={`${themeDetails.themeArrowWithFeatures}`}>
                        <div className='arrow'><TiTick /></div> <li key={index} className={`${themeDetails.themeFeatures}`}> {item}</li>
                      </div>
                    ))}
                  </div>
                  {/*  for  features */}
                  {/* <div className={`${themeDetails.themeFeaturesToBeRow}`}> */}
                    {/* <div className={`${themeDetails.themeFeaturesContainer}`}>
                    {feature.Features.map((item, index) => (
                      <div key={index} className={`${themeDetails.themeFeatures}`}>{item}</div>
                    ))}
                  </div> */}
                    
                    <div className={`${themeDetails.themeExamsNames}`}>
                      {feature.EntranceExams_name.map((item, index) => (
                        <button key={index}>{item}</button>
                      ))}
                    </div>
                  {/* </div> */}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <OurCoursesEdit />
      </div>
    </div>
  )
}

export default OueCourses