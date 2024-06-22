import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import BASE_URL from "../../../../apiConfig";
import { useParams, Link } from 'react-router-dom'
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses.js";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context.js";
import { FaArrowRight } from "react-icons/fa6";
import '../../../../styles/UGHomePage/ugHomePageTheme1.css'
import girl_img from'../../../../styles/Girl.png'
const ExamCourse = () => {
  const { EntranceExams_Id } = useParams();
  const [portaldata, setPortalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ExampagePortals/examPortal/${EntranceExams_Id}`);
        setPortalData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [EntranceExams_Id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];
  return (
    <div className={`exam_courses_container ${themeDetails.themeExamCoursesContainer}`}>
     
      <div className={`exam_courses_sub_container ${themeDetails.themeExamCoursesSubContainer}`}>
      {/* <h1 className={`exam_courses_name_heading ${themeDetails.themeExamCoursesNameHeading}`}></h1> */}
      <ul>
        {portaldata.map(item => (
          <div className={`portal_names ${themeDetails.themePortalNames}`}>
           
            <li key={item.Portale_Id}>
              <h2 alt="image">{item.Portale_Name}</h2>
              {themeColor==="Theme-1" ?
              <hr/>:null
            }
              {/* <img src={girl_img }/> */}
              <div className={` ${themeDetails.themeExamPortalImgDivInCard}`}>
              <img src={girl_img } alt='img not uploaded'/>
              </div>
              <div className={`exam_portal_btn ${themeDetails.themeExamPortalBtn}`}>
              <Link>{item.button}Explore<FaArrowRight /></Link>
              </div>
           
            </li>
          </div>
        ))}
      </ul>
      </div>
    </div>
  )
}

export default ExamCourse