import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import ExploreExamEdit from './ExploreExamEdit'
import { Link,useParams } from "react-router-dom";
const ExploreExam = () => {
  const { Branch_Id } = useParams();
  const [fetchedImage, setFetchedImage] = useState(null);
  const [portalesData, setPortalesData] = useState([]);
  const [branch, setBranch] = useState(null);
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
        <ExploreExamEdit/>
        <div>
              <div>
                <div>
                  <div>
                    {branch &&
                      branch.EntranceExams.map((exam, index) => (
                        <div>
                          <ul key={index}>
                            <li>
                              <Link
                                style={{ backgroundColor: "red" }}
                                to={`/ExamHomePage/${exam.EntranceExams_Id}`}
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
              </div>
            </div>
    </div>
  )
}

export default ExploreExam