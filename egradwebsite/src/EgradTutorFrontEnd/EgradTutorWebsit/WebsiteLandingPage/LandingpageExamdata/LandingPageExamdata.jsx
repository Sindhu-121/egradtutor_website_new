import React, { useContext, useState, useEffect } from 'react';
import LandingPageExamdataEdit from './LandingPageExamdataEdit';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import BASE_URL from '../../../../apiConfig';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import '../../../../styles/LandingPage_main.css'
import '../../../../styles/Theme2_landingPage_styles.css';
import '../../../../styles/Theme1_landingPage_styles.css';
import '../../../../styles/Default_landingPage_styles.css';
import ugImg from '../../../../styles/Girl.png';
import women_img from "../../../../styles/women_image.png";
import { FcGraduationCap } from "react-icons/fc";

const LandingPageExamdata = ({ enableEditFromP }) => {
  const [image, setImage] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];

  // In the page that needs to be refreshed
  const refreshChannel = new BroadcastChannel("refresh_channel");
  // Listen for messages from other pages
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload(); // Reload the page
    }
  };

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

  // fetching the branches
  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageExamData/branches`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBranches(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setError("Error fetching branches");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (branches.length === 0) {
    return <div>No data available. Please add data.</div>;
  }

  return (
    <>
    {themeColor==='Theme-1' ? 
      <div className={`${themeDetails.theme1welcomecontainer}`}>
      <div className={`${themeDetails.theme1UGEntranceExamsContainer}`}>
        {/* <div className={`${themeDetails.theme1CourseWithImgbox}`}> */}
        {branches.map((branch) => (
          <div
            className={`Newlandingpage_branch_box ${themeDetails.themeBranchBox}`}
            key={branch.Branch_Id}
          >
            <div className={`${themeDetails.themeInBranchBox}`}>
           
              <button className={`${themeDetails.themeUgAndPgButtons}`}>
                <Link to={{ pathname: `/BranchHomePage/${branch.Branch_Id}` }}>
                <FcGraduationCap style={{"fontSize":"30px"}}/>
                  {branch.Branch_Name}{" "}
                </Link>
              </button>
              <div className={`NewlandingPage_exams_image ${themeDetails.themeExamImageBox}`}>
                {themeColor === 'Theme-1' &&
                  <img src={women_img} alt="" />
                }
              </div>
            </div>


            <div className={`Newlandingpage_exams_button_box ${themeDetails.themeExamButtonsBox}`}>
              <div className={`${themeDetails.themeLanding_branch_box_btns}`}>
                <ul >
                  {branch.EntranceExams.slice(0, 4).map((exam) => (
                    <li key={exam.EntranceExams_Id} className={`${themeDetails.themeLanding_branch_box_li_buttons}`}>
                      <Link to={`/ExamHomePage/${exam.EntranceExams_Id}`}>
                        {exam.EntranceExams_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    :
    <div className='Newlandingpage'>
    <LandingPageExamdataEdit />
    {/* =======================Exam cards starts here============================== */}
    <div className={`Newlandingpage_branchescontainer ${themeDetails.themeBranchesContainer}`}>
      <div className={`Newlandingpage_branchessubcontainer ${themeDetails.themeBranchesSubContainer}`}>
        {branches.map((branch) => (
          <div
            className={`Newlandingpage_branch_box ${themeDetails.themeBranchBox}`}
            key={branch.Branch_Id}
          >
            <button className={`${themeDetails.themeUgAndPgButtons}`}>
              <Link to={{ pathname: `/BranchHomePage/${branch.Branch_Id}` }}>
                {branch.Branch_Name}{" "}
              </Link>
              {/* <MdOutlineTouchApp /> */}
            </button>

            <div className={`Newlandingpage_exams_button_box ${themeDetails.themeExamButtonsBox}`}>
              <div className={`NewlandingPage_exams_image ${themeDetails.themeExamImageBox}`}>
                {themeColor === 'Theme-2' &&
                  <img src={ugImg} alt="" />
                }

              </div>
              <div className={`${themeDetails.themeLanding_branch_box_btns}`}>

                <ul >

                  {branch.EntranceExams.slice(0, 4).map((exam) => (
                    <li key={exam.EntranceExams_Id} className={`${themeDetails.themeLanding_branch_box_li_buttons}`}>
                      <Link to={`/ExamHomePage/${exam.EntranceExams_Id}`}>
                        {exam.EntranceExams_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* =======================Exam cards ends here============================== */}

  </div>
    }
    
    </>
  );
}

export default LandingPageExamdata;
