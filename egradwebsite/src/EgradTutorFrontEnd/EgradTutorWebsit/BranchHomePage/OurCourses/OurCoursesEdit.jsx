import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { useParams } from "react-router-dom";
const OurCoursesEdit = ({ type }) => {
  const { Branch_Id } = useParams();
  const [featureInputs, setFeatureInputs] = useState(["", "", "", "", ""]);
  const [portalesData, setPortalesData] = useState([]);
  const [selectedFeaturePortal, setSelectedFeaturePortal] = useState("");
  const [image, setImage] = useState(null);
  const [existingFeatures, setExistingFeatures] = useState([]);
  const [branch, setBranch] = useState(null);
  
  useEffect(() => {
    fetchBranchData();
  }, [Branch_Id]);

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

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Features", JSON.stringify(featureInputs));
    formData.append("Portale_Id", selectedFeaturePortal);
    formData.append("Branch_Id", Branch_Id);
    if (image) {
      formData.append("image", image);
    }

    try {
      const existingFeatureIds = existingFeatures.map(
        (feature) => feature.Features_Id
      );
      if (existingFeatureIds.length > 0) {
        // Update existing features
        for (let i = 0; i < featureInputs.length; i++) {
          const featureId = existingFeatureIds[i];
          const featureData = {
            Features: featureInputs[i],
            Features_Id: featureId,
          };
          await axios.put(
            `${BASE_URL}/OurCourseedit/course_features`,
            featureData
          );
        }
      } else {
        // Add new features
        await axios.post(`${BASE_URL}/OurCourseedit/course_features`, formData);
      }

      alert("Feature data saved successfully!");
      setFeatureInputs(["", "", "", "", ""]);
    } catch (error) {
      console.error("Error saving feature data:", error);
    }
  };

  const handleFeaturePortalChange = async (e) => {
    const selectedPortal = e.target.value;
    setSelectedFeaturePortal(selectedPortal);

    if (selectedPortal) {
      try {
        const response = await axios.get(
          `${BASE_URL}/OurCourseedit/course_features/${selectedPortal}/${Branch_Id}`
        );
        if (response.data && response.data.length > 0) {
          setExistingFeatures(response.data);
          const features = response.data.map((feature) => feature.Features);
          setFeatureInputs(features);
        } else {
          setExistingFeatures([]);
          setFeatureInputs(["", "", "", "", ""]);
        }
      } catch (error) {
        console.error("Error fetching feature data:", error);
      }
    } else {
      setExistingFeatures([]);
      setFeatureInputs(["", "", "", "", ""]);
    }
  };
  const handleFeatureInputChange = (index, value) => {
    const newFeatureInputs = [...featureInputs];
    newFeatureInputs[index] = value;
    setFeatureInputs(newFeatureInputs);
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  return (
    <div>  
 {type === "AddFeatures" && (
<form onSubmit={handleFeatureSubmit}>
<label>Select Portal:</label>
<select
  value={selectedFeaturePortal}
  onChange={handleFeaturePortalChange}
>
  <option value="">--Select Portal--</option>
  {portalesData.map((portale) => (
    <option key={portale.Portale_Id} value={portale.Portale_Id}>
      {portale.Portale_Name}
    </option>
  ))}
</select>
{featureInputs.map((feature, index) => (
  <div key={index}>
    <input
      type="text"
      value={feature}
      onChange={(e) =>
        handleFeatureInputChange(index, e.target.value)
      }
      placeholder={`Feature ${index + 1}`}
    />
  </div>
))}

<input type="file" onChange={handleImageChange} />
<button type="submit">Submit</button>
</form>
 )}
     
  </div>
  )
}

export default OurCoursesEdit