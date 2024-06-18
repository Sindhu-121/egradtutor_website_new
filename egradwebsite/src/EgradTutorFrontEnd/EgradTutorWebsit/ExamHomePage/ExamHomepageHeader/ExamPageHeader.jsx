import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import defaultImage from '../../../../assets/defaultImage.png'; 
import { IoHome } from "react-icons/io5";
import { Link } from 'react-router-dom'

const ExamPageHeader = () => {
  const [image, setImage] = useState(null);

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/MainHearder/image`, {
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



  
  return (
    <div> <div>
    {image ? (
      <img src={image} alt="Current" />
    ) : (
      <img src={defaultImage} alt="Default" />
    )}
  </div>
  <Link to="/BranchHomePage"><IoHome />Home</Link>
  
  </div>
  )
}

export default ExamPageHeader