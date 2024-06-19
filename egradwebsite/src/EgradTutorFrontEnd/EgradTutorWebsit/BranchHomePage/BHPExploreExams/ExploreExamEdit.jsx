import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { useParams } from "react-router-dom";

const ExploreExamEdit = ({ type }) => {
  const { Branch_Id } = useParams();
  const [selectedPortales, setSelectedPortales] = useState([]);
  const [portalesData, setPortalesData] = useState([]);
  const [branch, setBranch] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [image, setImage] = useState(null);


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPortaleIds = portalesData
      .filter((portale) => selectedPortales.includes(portale.Portale_Name))
      .map((portale) => portale.Portale_Id);

    const uncheckedPortaleIds = portalesData
      .filter((portale) => !selectedPortales.includes(portale.Portale_Name))
      .map((portale) => portale.Portale_Id);

    const selectedExamId = branch?.EntranceExams.find(
      (exam) => exam.EntranceExams_name === selectedExam
    )?.EntranceExams_Id;

    const formData = new FormData();
    formData.append("EntranceExams_Id", selectedExamId);
    formData.append("Portale_Id", JSON.stringify(selectedPortaleIds));
    formData.append("UncheckedPortaleIds", JSON.stringify(uncheckedPortaleIds));
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${BASE_URL}/UgHomePage/our_courses`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data sent successfully");
      } else {
        console.error("Failed to send data to API");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handlePortalChange = (e) => {
    const portalName = e.target.value;
    if (selectedPortales.includes(portalName)) {
      setSelectedPortales(
        selectedPortales.filter((portal) => portal !== portalName)
      );
    } else {
      setSelectedPortales([...selectedPortales, portalName]);
    }
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
  };
  useEffect(() => {
    fetchBranchData();
  }, [Branch_Id]);
  return (
    <div>
        {type === "ExploreExam" && (
          <div>
          <h2>Portales</h2>
          <ul>
            {branch && (
              <div>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="examSelect">
                      Select Entrance Exam:
                    </label>
                    <select
                      id="examSelect"
                      value={selectedExam}
                      onChange={handleExamChange}
                    >
                      <option value="">--Select Exam--</option>
                      {branch.EntranceExams.map((exam) => (
                        <option
                          key={exam.EntranceExams_Id}
                          value={exam.EntranceExams_name}
                        >
                          {exam.EntranceExams_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Choose Portales:</label>
                    {portalesData.map((portale) => (
                      <div key={portale.Portale_Id}>
                        <input
                          type="checkbox"
                          id={`portal-${portale.Portale_Id}`}
                          value={portale.Portale_Name}
                          onChange={handlePortalChange}
                          checked={selectedPortales.includes(
                            portale.Portale_Name
                          )}
                        />
                        <label htmlFor={`portal-${portale.Portale_Id}`}>
                          {portale.Portale_Name}
                        </label>
                      </div>
                    ))}
                  </div>
      
                  <input type="file" onChange={handleImageChange} />
      
                  <button type="submit">Submit</button>
                </form>
              </div>
            )}
          </ul>
        </div>
        )}
       
  
  </div>
  )
}

export default ExploreExamEdit