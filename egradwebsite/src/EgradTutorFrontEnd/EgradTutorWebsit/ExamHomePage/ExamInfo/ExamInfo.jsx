import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig";
import { useParams } from "react-router-dom";
import axios from "axios";
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import '../../../../styles/UGHomePage/ugHomePageTheme1.css'
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import ExamInfoEdit from './ExamInfoEdit'
import { IoMdClose } from "react-icons/io";
import { FaRegPenToSquare } from "react-icons/fa6";
import '../../../../styles/ExamPage/DefaultThemeExamPage.css'
// import { BsInfoSquareFill } from "react-icons/bs";
import { LuInfo } from "react-icons/lu";
import { GoGlobe } from "react-icons/go";
const ExamInfo = () => {
  const { EntranceExams_Id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [newInfo, setNewInfo] = useState({
    Info_broucher: "",
    Official_Webpage: "",
    Conducting_Authority: "",
    Exam_Pattern: "",
    Eligibility: "",
    Syllabus: "",
    Important_Dates: "",
  });

  const [visibleSection, setVisibleSection] = useState(null);

  useEffect(() => {
    const fetchSpecificExamInformation = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/ExamInfo/exam_info/${EntranceExams_Id}`
        );
        console.log("Specific Exam Info:", response.data);
        if (response.data && response.data.length > 0) {
          const fetchedSpecificInfo = response.data;
          const updatedInfo = fetchedSpecificInfo.reduce(
            (acc, info) => {
              if (info.Info_broucher !== null)
                acc.Info_broucher = info.Info_broucher;
              if (info.Official_Webpage !== null)
                acc.Official_Webpage = info.Official_Webpage;
              if (info.Conducting_Authority !== null)
                acc.Conducting_Authority = info.Conducting_Authority;
              if (info.Exam_Pattern !== null)
                acc.Exam_Pattern = info.Exam_Pattern;
              if (info.Eligibility !== null) acc.Eligibility = info.Eligibility;
              if (info.Syllabus !== null) acc.Syllabus = info.Syllabus;
              if (info.Important_Dates !== null)
                acc.Important_Dates = info.Important_Dates;
              return acc;
            },
            {
              Info_broucher: "",
              Official_Webpage: "",
              Conducting_Authority: "",
              Exam_Pattern: "",
              Eligibility: "",
              Syllabus: "",
              Important_Dates: "",
            }
          );
          setNewInfo(updatedInfo);
        } else {
          console.log("No specific exam info found.");
        }
      } catch (error) {
        console.error("Error fetching specific exam information:", error);
      }
    };
    fetchSpecificExamInformation();
  }, [EntranceExams_Id]);

  const toggleVisibility = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };
  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle editing state
  };
  const getIcon = (section) => {
    return visibleSection === section ? "-" : "+";
  };


  const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")

  return (
    <div className={`exam_info_main_container ${themeDetails.themeExamInfoMainContainer}`}>
      <div className={`exams_info_btn_container ${themeDetails.themeExamInfoBtnsContainer}`}>
        <button
          onClick={handleEditClick}
          className={isEditing ? "hide-clicked" : "add-clicked"}
        >
          {isEditing ? <IoMdClose /> : <FaRegPenToSquare />}
        </button>

        {isEditing && <ExamInfoEdit type="aboutUs" />}
        <div className={`exam_info_sub_container ${themeDetails.themeExamInfoSubContainer}`}>
          {themeColor === 'Theme-2'
            ?
            <div className={`exam_info_btns ${themeDetails.themeExamInfoBtns}`}>
              <div className={`exam_info_divs ${themeDetails.themeExamInfoDivs}`}>
                <div id="info_title" className="infoButton ">
                  <div className="infoButtonSpan"><LuInfo /> </div>
                  <div className="t2ButtonDiv"><p> Information Brochure</p></div>
                </div>
              </div>

              <div className={`exam_info_divs ${themeDetails.themeExamInfoDivs}`}>
                <div id="info_title" className='infoButton'>
                  <div className='infoButtonSpan'><GoGlobe /></div>
                  <div className="t2ButtonDiv"> <p> Official Webpage</p></div></div>
              </div>
            </div>
            :
            <div className={`exam_info_btns ${themeDetails.themeExamInfoBtns}`}>

              <div className={`exam_info_divs ${themeDetails.themeExamInfoDivs}`}>
                <h3 id="info_title"> Information Brochure</h3>
              </div>

              <div className={`exam_info_divs ${themeDetails.themeExamInfoDivs}`}>
                <h3 id="info_title">Official Webpage</h3>
              </div>
            </div>

          }

          <div className={`exam_info_toggle_visiable_links ${themeDetails.themeExamInfoToggles}`}>
            <div className={`toggles ${themeDetails.themeToggles}`}>
              <h3
                id="info_title"
                onClick={() => toggleVisibility("Conducting_Authority")}
              >
                Conducting Authority{" "}
                <span>{getIcon("Conducting_Authority")}</span>
              </h3>
              <div>

              </div>
              {visibleSection === "Conducting_Authority" && (
                <p id="more_info">{newInfo.Conducting_Authority}</p>
              )}
            </div>

            <div className={`toggles ${themeDetails.themeToggles}`}>
              <h3
                id="info_title"
                onClick={() => toggleVisibility("Exam_Pattern")}
              >
                Exam Pattern <span>{getIcon("Exam_Pattern")}</span>
              </h3>

              {visibleSection === "Exam_Pattern" && (
                <p id="more_info">{newInfo.Exam_Pattern}</p>
              )}
            </div>

            <div className={`toggles ${themeDetails.themeToggles}`}>
              <h3 id="info_title" onClick={() => toggleVisibility("Eligibility")}>
                Eligibility <span>{getIcon("Eligibility")}</span>
              </h3>

              {visibleSection === "Eligibility" && (
                <p id="more_info">{newInfo.Eligibility}</p>
              )}
            </div>

            <div className={`toggles ${themeDetails.themeToggles}`}>
              <h3 id="info_title" onClick={() => toggleVisibility("Syllabus")}>
                Syllabus <span>{getIcon("Syllabus")}</span>
              </h3>

              {visibleSection === "Syllabus" && (
                <p id="more_info">{newInfo.Syllabus}</p>
              )}
            </div>

            <div className={`toggles ${themeDetails.themeToggles}`}>
              <h3
                id="info_title"
                onClick={() => toggleVisibility("Important_Dates")}
              >
                Important Dates <span>{getIcon("Important_Dates")}</span>
              </h3>

              {visibleSection === "Important_Dates" && (
                <p id="more_info">{newInfo.Important_Dates}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamInfo