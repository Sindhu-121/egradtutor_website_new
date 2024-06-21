import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import ExploreExamEdit from './ExploreExamEdit'
import { Link, useParams } from "react-router-dom";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
const ExploreExam = () => {
  const { Branch_Id } = useParams();
  const [fetchedImage, setFetchedImage] = useState(null);
  const [portalesData, setPortalesData] = useState([]);
  const [branch, setBranch] = useState(null);
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
 
  return (
    <div>
      <ExploreExamEdit />
      <div className={`${themeDetails.themeEEParentContainer}`} >
        <div className={`${themeDetails.themeEESubContainer}`}>
          <div className={`${themeDetails.themeEntranceExamsContainer}`}>
            <div className={`${themeDetails.themeExploreExamContainer}`}>
              {branch &&
                branch.EntranceExams.map((exam, index) => (
                  <div className={`${themeDetails.themeEEInMap}`}>
                    <ul key={index} className={`${themeDetails.themeEEUl}`}>
                      <li className={`${themeDetails.themeEELi}`}>
                        <Link className={`${themeDetails.themeEELink}`}
                          to={`/ExamHomePage/${exam.EntranceExams_Id}`}
                        >
                          {exam.EntranceExams_name}
                        </Link>
                      </li>
                      <div className={`${themeDetails.themePortalNames}`}>
                        {exam.Portale_Names &&
                          exam.Portale_Names.map((portaleName, index) => (
                              <li key={index} className={`${themeDetails.themeEEPortalLi}`}>{portaleName}</li>
                          ))}
                      </div>
                    </ul>
                  </div>
                ))}
            </div>
          </div>
          <div>
            {fetchedImage && (
              <div className={`${themeDetails.themeEEBGImage}`}>
                <img src={fetchedImage} alt="Fetched from database" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default ExploreExam