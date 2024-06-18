import React, { useContext, useState,useEffect } from 'react'
import BHBannersEdit from "./BHBannersEdit"
import BASE_URL from '../../../../apiConfig';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
const BHBanners = () => {
  const [branch, setBranch] = useState(null);
  const [fetchedImage, setFetchedImage] = useState(null);

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

  const fetchBranchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/UgHomePage/examdata/1`
      );
      const responsePortales = await axios.get(
        `${BASE_URL}/UgHomePage/portales`
      );
      const data = response.data;
      const portalesData = responsePortales.data;

      const foundBranch = data.find(
        (branch) => branch.Branch_Id === parseInt(1)
      );
      setBranch(foundBranch);
      // setPortalesData(portalesData);
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  };
  useEffect(() => {
    fetchBranchData();
  }, []);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/UgHomePage/image/1`, {
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(response.data);
        setFetchedImage(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);
  return (
    <div>
        {/* <div className={`Ug_explore_exams_Container ${themeDetails.themeUgExploreExamsContainer}`}>
                <div className="">
                  <div className={`"Ug_explore_exams_Section ${themeDetails.themeUgExploreExamsSection}`}>
                    {branch.EntranceExams &&
                      branch.EntranceExams.map((exam, index) => (
                        <div className={`Ug_explore_exams_Content ${themeDetails.themeUgExploreExamsContent}`}>
                          <ul key={index}>
                            <li>
                              <Link
                                style={{ backgroundColor: "red" }}
                                to={`/ExamPages_main/${exam.EntranceExams_Id}`}
                              >
                                {exam.EntranceExams_name}
                              </Link>
                            </li>

                            {exam.Portale_Names &&
                              exam.Portale_Names.map((portaleName, index) => (
                                <li key={index}>{portaleName}</li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  {fetchedImage && (
                    <div>
                      <img src={fetchedImage} alt="Fetched from database" />
                    </div>
                  )}
                </div>
              </div> */}
      <BHBannersEdit/>
    </div>
  )
}

export default BHBanners