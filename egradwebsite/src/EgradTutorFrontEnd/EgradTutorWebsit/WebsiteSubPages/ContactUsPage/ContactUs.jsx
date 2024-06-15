import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import ContactUsEdit from "./ContactUsEdit";
import defaultImage from "../../../../assets/defaultImage.png";
import Footer from "../../Footer/Footer";
import { Contact_Map_Data } from "./Contact_map_data";

const ContactUs = () => {
  const [landingFooterData, setLandingFooterData] = useState([]);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

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

  const fetchContactUsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ContactUs/ContactUs`);
      setLandingFooterData(response.data);
      console.log("Retrieved data from landing_page_two table:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state
    }
  };

  useEffect(() => {
    fetchImage();
    fetchContactUsData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/ContactUs/contact-categories`
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Assuming the category data is in the first array
          const categoryData = response.data[0];
          setCategories(categoryData);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Handle error as needed
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    Category_Id: "",
    Category_Name: "",
    First_Name: "",
    Last_Name: "",
    Email_Address: "",
    Message: "",
  });

  const handleChange = (e) => {
    // If the event target is the category select dropdown
    if (e.target.name === "Category_Id") {
      // Get the selected option from the event target's options property
      const selectedOption = e.target.options[e.target.selectedIndex];
      // Extract Category_Id and Category_Name from the selected option's attributes
      const categoryId = selectedOption.value;
      const categoryName = selectedOption.getAttribute("data-categoryname");
      // Update the state with the selected Category_Id and Category_Name
      setFormData({
        ...formData,
        Category_Id: categoryId,
        Category_Name: categoryName,
      });
    } else {
      // For other input fields, update the state as usual
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/ContactUs/addEnquiry`,
        formData
      );
      if (response.status === 201) {
        alert("Enquiry added successfully!");
        console.log("Enquiry ID:", response.data.enquiryId);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to add enquiry. Please try again later.");
    }
  };
  return (
    
    <div>
      <ContactUsEdit />
      <div>
        {image ? (
          <img src={image} alt="Current" />
        ) : (
          <img src={defaultImage} alt="Default" /> // Display default image
        )}
      </div>
      <div>
        {Contact_Map_Data.map((Contact_data, index) => (
          <div className="map" key={index}>
            <iframe src={Contact_data.map} frameBorder="0"></iframe>
          </div>
        ))}
      </div>
      <div>
        {landingFooterData.map((item) => (
          <div key={item.Content_id}>
            {item.Content_id === 1 ? (
              <h2>{item.content_name}</h2>
            ) : (
              <p>{item.content_name}</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2>Add Enquiry</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="First_Name"
            value={formData.First_Name}
            onChange={handleChange}
            required
          />
          <br />
          <br />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="Last_Name"
            value={formData.Last_Name}
            onChange={handleChange}
            required
          />
          <br />
          <br />

          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="Email_Address"
            value={formData.Email_Address}
            onChange={handleChange}
            required
            style={{
              width: "20%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <br />
          <br />

          <label htmlFor="category">Select Category:</label>
          <select
            id="category"
            name="Category_Id"
            value={formData.Category_Id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category...</option>
            {categories.map((category) => (
              <option
                key={category.Category_Id}
                value={category.Category_Id}
                data-categoryname={category.Category_Name}
                style={{ color: "black" }}
              >
                {category.Category_Name}
              </option>
            ))}
          </select>

          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="Message"
            value={formData.Message}
            onChange={handleChange}
            required
            style={{
              width: "20%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          ></textarea>
          <br />
          <br />

          <button type="submit">Submit</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
