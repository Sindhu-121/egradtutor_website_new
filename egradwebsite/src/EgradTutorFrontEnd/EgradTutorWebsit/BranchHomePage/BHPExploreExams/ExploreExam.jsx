import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import ExploreExamEdit from './ExploreExamEdit'
import { Link, useParams } from "react-router-dom";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import '../BranchHomeStyles/BranchHomePages.css'
const ExploreExam = () => {
  const { Branch_Id } = useParams();
  const [fetchedImage, setFetchedImage] = useState(null);
  const [portalesData, setPortalesData] = useState([]);
  const [branch, setBranch] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  useEffect(() => {
    fetchBranchData();
    fetchImage();
  }, []);
  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ExploreExam/image/1`, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setFetchedImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  const fetchBranchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/ExploreExam/examdata/${Branch_Id}`
      );
      const responsePortales = await axios.get(
        `${BASE_URL}/ExploreExam/portales`
      );
      const data = response.data;
      const portalesData = responsePortales.data;
 
      const foundBranch = data.find(
        (branch) => branch.Branch_Id === parseInt(Branch_Id)
      );
      setBranch(foundBranch);
      setPortalesData(portalesData);
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  };
 
 
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
  return (
    <div className={`NewExploreExams_Main_Container ${themeDetails.themeExploreExamsMainContainer}`}>
      <h2 id="EXPLORE_Exam_Heading">EXPLORE EXAMS</h2>
      <div className={`NewExploreExams_Sub_Container ${themeDetails.themeExploreExamsSubContainer}`}>
 
 
        <div className={`NewExploreExams_ExamCard_MainContainer ${themeDetails.themeNewExploreExams_ExamCard_MainContainer}`}>
        <div className={`NewExploreExams_ExamCard_Container ${themeDetails.themeNewExploreExams_ExamCard_Container}`}>
            {branch &&
              branch.EntranceExams.map((exam, index) => (
                <div className={`NewExploreExams_ExamName_Container ${themeDetails.themeNewExploreExams_ExamName_Container}`}>
 
                  <div className={`NewExploreExams_EachCard_Container ${themeDetails.themeNewExploreExams_EachCard_Container}`}>
                  <ul key={index}>
                    <li>
                      <Link
                        to={`/ExamPages_main/${exam.EntranceExams_Id}`}
                      >
                        {exam.EntranceExams_name}
                      </Link>
                    </li>
                    <div className={`NewExploreExams_PortalNames_Container ${themeDetails.themeNewExploreExams_PortalNames_Container}`} >
                      {exam.Portale_Names &&
                        exam.Portale_Names.map((portaleName, index) => (
                          <li key={index}>{portaleName}</li>
                        ))}
                    </div>
 
                  </ul>
                  </div>
                </div>
              ))}
          </div>
 
 
          <div className={`NewExploreExams_Image ${themeDetails.themeNewExploreExams_Image}`}>
            {fetchedImage && (
              <img src={fetchedImage} alt="Fetched from database" />
            )}
 
          </div>
 
 
 
        </div>
      </div>
      <ExploreExamEdit />
    </div>
  )
}
 
export default ExploreExam