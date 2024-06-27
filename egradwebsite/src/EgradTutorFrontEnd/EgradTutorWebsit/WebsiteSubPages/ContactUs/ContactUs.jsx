import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import Footer from "../../Footer/Footer";
import defaultImage from '../../../../assets/defaultImage.png';
import { Contact_Map_Data } from './Contact_map_data';
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import '../../../../styles/UGHomePage/UgHomePage_Default_Theme.css';
import ExamPageHeader from "../../ExamHomePage/ExamHomepageHeader/ExamPageHeader";
// Header
import '../../../../styles/ContactUs/Theme2ContactUs.css'
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import '../../../../styles/ContactUs/Theme1ContactUs.css'

const ContactUs = () => {
  const [categories, setCategories] = useState([]);
  const themeFromContext = useContext(ThemeContext);


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

  const [formData, setFormData] = useState({
    Category_Id: '',
    Category_Name: '',
    First_Name: '',
    Last_Name: '',
    Email_Address: '',
    Message: ''
  });

  const handleChange = (e) => {
    // If the event target is the category select dropdown
    if (e.target.name === 'Category_Id') {
      // Get the selected option from the event target's options property
      const selectedOption = e.target.options[e.target.selectedIndex];
      // Extract Category_Id and Category_Name from the selected option's attributes
      const categoryId = selectedOption.value;
      const categoryName = selectedOption.getAttribute('data-categoryname');
      // Update the state with the selected Category_Id and Category_Name
      setFormData({
        ...formData,
        Category_Id: categoryId,
        Category_Name: categoryName
      });
    } else {
      // For other input fields, update the state as usual
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/ContactUs/addEnquiry`, formData);
      if (response.status === 201) {
        alert('Enquiry added successfully!');
        console.log('Enquiry ID:', response.data.enquiryId);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to add enquiry. Please try again later.');
    }
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ContactUs/contact-categories`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Assuming the category data is in the first array
          const categoryData = response.data[0];
          setCategories(categoryData);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle error as needed
      }
    };

    fetchCategories();
  }, []);
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")

  return (
    <>
      {themeColor === 'Theme-2' &&
        <div className={`ContactUsMainContainer ${themeDetails.themeContactUsMainContainer}`}>
          <ExamPageHeader />
          <div className={`ContactUsContentDataContainer ${themeDetails.themeCUParentContainer}`}>
            <div className="t2FormAndContactContainer">
              <div className={`${themeDetails.themeFormNdCardPC}`}>
                <div className={`${themeDetails.themeFormNdCardSubContainer}`}>
                  <div className={`ContactUsContentContainer ${themeDetails.themeCUMapContainer}`}>
                    {landingFooterData.map(item => (
                      <div key={item.Content_id} className={`ContactUsDataContainer `}>
                        {item.Content_id === 1 ? (
                          <h2>{item.content_name}</h2>
                        ) : (
                          <p>{item.content_name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={`ContactUsFormContainer ${themeDetails.themeCUFormContainer}`}>
                    <form onSubmit={handleSubmit} className={`ContactUsFormData ${themeDetails.themeCUForm}`}>
                      <label htmlFor="firstName"></label>
                      <input type="text" id="firstName" name="First_Name" value={formData.First_Name} onChange={handleChange} placeholder="First Name" className={`ContactUsFormFirstName `} required />
                      <label htmlFor="lastName"></label>
                      <input type="text" id="lastName" name="Last_Name" value={formData.Last_Name} onChange={handleChange} placeholder="Last Name" className={`ContactUsFormLasttName`} required />
                      <label htmlFor="email"></label>
                      <input type="email" id="email" name="Email_Address" value={formData.Email_Address} placeholder="Email Address" onChange={handleChange} className={`ContactUsFormemail `} required />
                      <label htmlFor="category"></label>
                      <select id="category" name="Category_Id" value={formData.Category_Id} onChange={handleChange} className={`ContactUsFormCategory`} required>
                        <option value="">Select a category...</option>
                        {categories.map(category => (
                          <option key={category.Category_Id} value={category.Category_Id} data-categoryname={category.Category_Name}>{category.Category_Name}</option>
                        ))}
                      </select>
                      <label htmlFor="message"></label>
                      <textarea id="message" name="Message" value={formData.Message} onChange={handleChange} placeholder="Message" className={`ContactUsForMessage `} required></textarea>
                      <div className={`${themeDetails.themeCUSubmitButtonDiv}`}>
                        <button type="submit">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/*  iframe tag */}
            <div className={`ContactUsMapContainer ${themeDetails.themeCUsMapContainer}`}>{Contact_Map_Data.map((Contact_data, index) => (
              <div className={`ContactUsMapData ${themeDetails.themeCUMapDiv}`} key={index}>
                <iframe src={Contact_data.map} frameBorder="0"></iframe>
              </div>
            ))}
            </div>
          </div>
          <Footer />
        </div>
      }

      {themeColor === 'Theme-1' &&
        <div className={`${themeDetails.themeContactusMainsContainer}`}>
          <ExamPageHeader />
          <div className={`ContactUsMainContainer ${themeDetails.themeContactUsSubbMainContainer}`}>
            <div className={`ContactUsContentDataContainer ${themeDetails.themeContactUsContentsDataContainer}`}>
              <h1>CONTACT US</h1>
              <div className={`ContactUsMapContainer ${themeDetails.themeContactsUsMapContainer}`}>{Contact_Map_Data.map((Contact_data, index) => (
                <div className={`ContactUsMapData ${themeDetails.themeContactUsMapData}`} key={index}>
                  <iframe src={Contact_data.map} frameBorder="0"></iframe>
                </div>
              ))}
              </div>


              <div className={` ${themeDetails.themeContactUsFormAndAdressContainer}`}>
                <div className={`ContactUsContentContainer ${themeDetails.themeContactUsContentContainer}`}>
                  {landingFooterData.map(item => (
                    <div key={item.Content_id} className={`ContactUsDataContainer ${themeDetails.themeContactUsDataContainer}`}>
                      {item.Content_id === 1 ? (
                        <h2>ADDRESS</h2>
                      ) : (
                        <p>{item.content_name}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className={`ContactUsFormContainer ${themeDetails.themeContactUsFormContainer}`}>
                  <form onSubmit={handleSubmit} className={`ContactUsFormData ${themeDetails.themeContactUsFormData}`}>
                    <label htmlFor="firstName"></label>
                    <input type="text" id="firstName" name="First_Name" value={formData.First_Name} onChange={handleChange} placeholder="    First Name" className={`ContactUsFormFirstName ${themeDetails.themeContactUsFormsFirstName}`} required /><br />

                    <label htmlFor="lastName"></label>
                    <input type="text" id="lastName" name="Last_Name" value={formData.Last_Name} onChange={handleChange} placeholder="   Last Name" className={`ContactUsFormLasttName ${themeDetails.themeContactUsFormsLasttName}`} required /><br />

                    <label htmlFor="email"></label>
                    <input type="email" id="email" name="Email_Address" value={formData.Email_Address} placeholder="   Email Address" onChange={handleChange} className={`ContactUsFormemail ${themeDetails.themeContactsUsFormemail}`} required /><br />

                    <label htmlFor="category"></label>
                    <select id="category" name="Category_Id" value={formData.Category_Id} onChange={handleChange} className={`ContactUsFormCategory ${themeDetails.themeContactUsFormCategory}`} required>
                      <option value="">Select a category...</option>
                      {categories.map(category => (
                        <option key={category.Category_Id} value={category.Category_Id} data-categoryname={category.Category_Name}>{category.Category_Name}</option>
                      ))}
                    </select>

                    <label htmlFor="message"></label>
                    <textarea id="message" name="Message" value={formData.Message} onChange={handleChange} placeholder="   Message" className={`ContactUsForMessage ${themeDetails.ContactUsForMessage}`} required></textarea><br />

                    <button type="submit">Submit</button>
                  </form>

                </div>
              </div>

            </div>
            <Footer />
          </div>
        </div>
      }
      {themeColor === 'Theme-default' &&
        <div className={`ContactUsMainContainer ${themeDetails.themeContactUsMainContainer}`}>


          <div className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`} >
            {image ? (
              <img src={image} alt="Current" />
            ) : (
              <img src={defaultImage} alt="Default" />
            )}

            <span>
              <Link to={`/`}><IoHome />Home</Link>
            </span>
          </div>
          <h1>CONTACT US</h1>
          <div className={`ContactUsContentDataContainer ${themeDetails.ContactUsContentDataContainer}`}>


            <div className={`ContactUsMapContainer ${themeDetails.ContactUsMapContainer}`}>{Contact_Map_Data.map((Contact_data, index) => (
              <div className={`ContactUsMapData ${themeDetails.ContactUsMapData}`} key={index}>
                <iframe src={Contact_data.map} frameBorder="0"></iframe>
              </div>
            ))}
            </div>

            <div className={`ContactUsContentContainer ${themeDetails.ContactUsContentContainer}`}>
              {landingFooterData.map(item => (
                <div key={item.Content_id} className={`ContactUsDataContainer ${themeDetails.ContactUsDataContainer}`}>
                  {item.Content_id === 1 ? (
                    <h2>ADDRESS</h2>
                  ) : (
                    <p>{item.content_name}</p>
                  )}
                </div>
              ))}
            </div>


            <div className={`ContactUsFormContainer ${themeDetails.ContactUsFormContainer}`}>
              <form onSubmit={handleSubmit} className={`ContactUsFormData ${themeDetails.ContactUsFormData}`}>
                <label htmlFor="firstName"></label>
                <input type="text" id="firstName" name="First_Name" value={formData.First_Name} onChange={handleChange} placeholder="First Name" className={`ContactUsFormFirstName ${themeDetails.ContactUsFormFirstName}`} required /><br />

                <label htmlFor="lastName"></label>
                <input type="text" id="lastName" name="Last_Name" value={formData.Last_Name} onChange={handleChange} placeholder="Last Name" className={`ContactUsFormLasttName ${themeDetails.ContactUsFormLasttName}`} required /><br />

                <label htmlFor="email"></label>
                <input type="email" id="email" name="Email_Address" value={formData.Email_Address} placeholder="Email Address" onChange={handleChange} className={`ContactUsFormemail ${themeDetails.ContactUsFormemail}`} required /><br />

                <label htmlFor="category"></label>
                <select id="category" name="Category_Id" value={formData.Category_Id} onChange={handleChange} className={`ContactUsFormCategory ${themeDetails.ContactUsFormCategory}`} required>
                  <option value="">Select a category...</option>
                  {categories.map(category => (
                    <option key={category.Category_Id} value={category.Category_Id} data-categoryname={category.Category_Name}>{category.Category_Name}</option>
                  ))}
                </select>

                <label htmlFor="message"></label>
                <textarea id="message" name="Message" value={formData.Message} onChange={handleChange} placeholder="Message" className={`ContactUsForMessage ${themeDetails.ContactUsForMessage}`} required></textarea><br />

                <button type="submit">Submit</button>
              </form>

            </div>


          </div>
          <Footer />
        </div>}



    </>

  )
}

export default ContactUs