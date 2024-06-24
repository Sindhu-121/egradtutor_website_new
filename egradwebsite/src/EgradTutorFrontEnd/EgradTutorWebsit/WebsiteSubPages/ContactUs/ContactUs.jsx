import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import Footer from "../../Footer/Footer";
import defaultImage from '../../../../assets/defaultImage.png'; 
import { Contact_Map_Data } from './Contact_map_data';
const ContactUs = () => {
    const [image, setImage] = useState(null);
    const [landingFooterData, setLandingFooterData] = useState([]);
    const fetchImage = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/Logo/image`, {
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
        const fetchData = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/ContactUs/ContentData`);
            setLandingFooterData(response.data);
            console.log("Retrieved data from landing_page_two table:", response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error state
          }
        };
    
        fetchData();
      }, []); 
    
  return (
    <div>  
          <div>
    {image ? (
      <img src={image} alt="Current" />
    ) : (
      <img src={defaultImage} alt="Default" />
    )}
  </div>
  <div>{Contact_Map_Data.map((Contact_data, index) => (
  <div className="map" key={index}>
    <iframe src={Contact_data.map} frameBorder="0"></iframe>
  </div>
))}
</div>
  <div>
    {landingFooterData.map(item => (
      <div key={item.Content_id}>
        {item.Content_id === 1 ? (
          <h2>{item.content_name}</h2>
        ) : (
          <p>{item.content_name}</p>
        )}
      </div>
    ))}
  </div>
  
  <Footer />
  </div>
  )
}

export default ContactUs