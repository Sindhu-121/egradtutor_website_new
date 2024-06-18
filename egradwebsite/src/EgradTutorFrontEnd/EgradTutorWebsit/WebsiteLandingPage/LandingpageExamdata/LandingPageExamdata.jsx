import React, { useContext, useState, useEffect } from 'react'
import LandingPageExamdataEdit from './LandingPageExamdataEdit'
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import BASE_URL from '../../../../apiConfig';
import axios from 'axios';
import '../../../../styles/Theme2_landingPage_styles.css'
import { Link } from 'react-router-dom';
import '../../../../styles/LandingPage_main.css'
import '../../../../styles/Theme2_landingPage_styles.css'
import ugImg from '../../../../styles/Girl.png'



const LandingPageExamdata = ({enableEditFromP}) => {
  const [image, setImage] = useState(null);
  const [branches, setBranches] = useState([]);
  console.log(enableEditFromP,"this is the value that passed from landingPage");
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

  // fetching the branches
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Landingpage/branches`);
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  return (
    <div className='Newlandingpage' >
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
        <div className={`Newlandingpage_branchescontainer ${themeDetails.themeBranchesContainer}`}>
          <div className={`Newlandingpage_branchessubcontainer ${themeDetails.themeBranchesSubContainer}`}>
            {branches.map((branch) => (
              <div
                className={`Newlandingpage_branch_box ${themeDetails.themeBranchBox}`}
                key={branch.Branch_Id}
              >
                <button className={`${themeDetails.themeUgAndPgButtons}`} >
                  <Link to={{ pathname: `/Homepage/${branch.Branch_Id}` }}>
                    {branch.Branch_Name}{" "}
                  </Link>
                  {/* <MdOutlineTouchApp /> */}
                </button>

                <div className={`Newlandingpage_exams_button_box ${themeDetails.themeExamButtonsBox}`}>
                  <div className={`NewlandingPage_exams_image ${themeDetails.themeExamImageBox}`}>
                    <img src={ugImg} alt="" />
                  </div>
                  <div className={`${themeDetails.themeLanding_branch_box_btns}`}>
                    <ul >
                      {branch.EntranceExams.slice(0, 4).map((exam) => (
                        <li key={exam.EntranceExams_Id} className={`${themeDetails.themeLanding_branch_box_li_buttons}`}>
                          <Link to={`/ExamPages_main/${exam.EntranceExams_Id}`}>
                            {exam.EntranceExams_name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* {enableEditcontainer ? (
                <>
                  <div className="Newlandingpage_branch_boxedit_conatiner">
                    <div className="Newlandingpage_branch_boxedit_buttonconatiner">
                      <button onClick={() => handleEditClick(branch)}>
                        <LiaEditSolid />
                        Edit
                      </button>

                      <button onClick={() => OpenAddExamForm(branch.Branch_Id)}>
                        <IoMdAddCircleOutline />
                        Add
                      </button>
                    </div>
                  </div>
                </>
              ) : null} */}
              </div>
            ))}
          </div>
        </div>
        {/* =======================Exam cards ends here============================== */}

      {/* <LandingPageExamdataEdit enableEdit="true" /> */}
      <LandingPageExamdataEdit />
    </div>
  )
}

export default LandingPageExamdata