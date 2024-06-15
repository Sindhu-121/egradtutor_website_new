import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../../apiConfig";
import defaultImage from '../../../../assets/defaultImage.png'; 
import FAQEdit from './FAQEdit'
import Footer from "../../Footer/Footer";

const FAQ = () => {
  const [image, setImage] = useState(null);

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
  return (
    <div> 
      <div>
    {image ? (
      <img src={image} alt="Current" />
    ) : (
      <img src={defaultImage} alt="Default" /> // Display default image
    )}
  </div>
        <FAQEdit/>


        <Footer/>
    </div>
  )
}

export default FAQ