
import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
// import ContactUsEdit from "./ContactUsEdit";
import defaultImage from "../../../../assets/defaultImage.png";
import Footer from "../../Footer/Footer";
import { Contact_Map_Data } from "./Contact_map_data";
import ContactUsEdit from './ContactUsEdit'


const ContactUs = () => {
  return (

    
    <div>
      {/* <ContactUsEdit /> */}
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
  )
}

export default ContactUs