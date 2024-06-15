import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import ContactUsEdit from './ContactUsEdit'


const ContactUsFooter = () => {
  const [landingFooterData, setLandingFooterData] = useState([]);


  

  const fetchContactUsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ContactUs/ContactUs`);
      setLandingFooterData(response.data);
      console.log("Retrieved data from landing_page_two table:", response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state
    }
  };
 
  useEffect(() => {
    fetchContactUsData();
  }, []);
  
  return (
    <div> 
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
    </div>
  )
}

export default ContactUsFooter