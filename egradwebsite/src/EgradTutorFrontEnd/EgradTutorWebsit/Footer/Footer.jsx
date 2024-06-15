import React, { useState, useEffect, useContext} from "react";
import PricingandRefundPolicy from "../WebsiteSubPages/PricingAndRefundPolicyPage/PricingandRefundPolicy";
import PrivacyPolicy from "../WebsiteSubPages/PrivacyPolicyPage/PrivacyPolicy";
import TermsAndCondetions from "../WebsiteSubPages/TermsAndConditionsPage/TermsAndCondetions";
import FAQ from "../WebsiteSubPages/FAQPage/FAQ";

// import './Footer.css'
import { Link } from "react-router-dom";
import axios from "axios";
import { LiaEditSolid } from "react-icons/lia";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
 import BASE_URL from "../../../../src/apiConfig.js";
// import { FooterData } from "../../components/ug_homepage/components/Footer/FooterData";
import { IoMdAddCircleOutline } from "react-icons/io";


import JSONClasses from '../JSONForCSS/JSONClasses.js'
import { ThemeContext } from '../../../ThemesFolder/ThemeContext/Context.js'
import '../../../styles/Default_landingPage_styles.css'
import '../../../styles/Theme1_landingPage_styles.css'
import '../../../styles/Theme2_landingPage_styles.css'

// import PricingandRefundPolicy from "../WebsiteSubPages/PricingAndRefundPolicyPage/PricingandRefundPolicy";
// import PrivacyPolicy from "../WebsiteSubPages/PrivacyPolicyPage/PrivacyPolicy";
// import TermsAndCondetions from "../WebsiteSubPages/TermsAndConditionsPage/TermsAndCondetions";
// import FAQ from "../WebsiteSubPages/FAQPage/FAQ";
// import ContactUs from "../WebsiteSubPages/ContactUsPage/ContactUs";

const Footer = ({ id, enableEditcontainer }) => {
  const [theme, setTheme] = useState("theme1");
  const [newData, setNewData] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [dataOne, setDataOne] = useState([]);
  const [dataTwo, setDataTwo] = useState([]);
  const [FooterData, setFooterData] = useState([]);
  const [dataThree, setDataThree] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [contactUsPopup, setContactUsPopup] = useState(false);
  const [copyRightContent, setCopyRightContent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemIdOne, setEditedItemIdOne] = useState(null);
  const [editItemIdThree, setEditItemIdThree] = useState(null);
  const [editedItemIdThree, setEditedItemIdThree] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const [editFooterItemId, setEditFooterItemId] = useState(null);
  const [editedLinkItem, setEditedLinkItem] = useState("");
  const [editedLinkRoutingData, setEditedLinkRoutingData] = useState("");
  const [socialIcons, setSocialIcons] = useState([]);
  const [footerLinkData, setFooterLinkData] = useState([]);
  const [editFooterItemRoutingData, setEditFooterItemRoutingData] =
    useState("");
  const [editFooterItem, setEditFooterItem] = useState("");
  const [showPreviousLinksData, setShowPreviousLinksData] = useState(false);
  const [footerpopupconatiner, setFooterpopupconatiner] = useState(false);
  // for edit enableEditcontainer is useEffect form landingpage
  useEffect(() => {
    if (enableEditcontainer) {
      // Call any function or perform any action you want when enableEditcontainer changes
      console.log("Edit container is enabled in FooterMain_Page");
    }
  }, [enableEditcontainer]);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const [showForm, setShowForm] = useState(false);
  const displayLinksData = () => {
    setShowPreviousLinksData(true);
    setFooterpopupconatiner(true);
  };
  const handleDeleteFooterItem = async (Link_Id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/Admin/footerLinksDeleteData/${Link_Id}`
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEditFooterItemClick = (Link_Id, Link_Item, Link_Routing_Data) => {
    setEditFooterItemId(Link_Id);
    setEditedLinkItem(Link_Item);
    setEditedLinkRoutingData(Link_Routing_Data);
  };

  const handleCancelFooterItem = () => {
    setEditFooterItemId(null);
    setEditedLinkItem("");
    setEditedLinkRoutingData("");
  };

  const handleChangeLinkItem = (e) => {
    setEditedLinkItem(e.target.value);
  };

  const handleChangeLinkRoutingData = (e) => {
    setEditedLinkRoutingData(e.target.value);
  };

  const [showFooterLinksData, setShowFooterLinksData] = useState(false);
  const [formData, setFormData] = useState({
    Link_Item: "",
    Link_Routing_Data: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitFooterLinks = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/FooterPage/footerLinks`,
        formData
      );
      console.log("Response:", response.data);
      // Add any additional actions after successful submission
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const toggleForm = () => {
    setShowFooterLinksData(!showFooterLinksData);
    setFooterpopupconatiner(true);
  };

  const handleSaveFooterItem = async (Link_Id) => {
    try {
      const updateData = {
        Link_Id,
        ...(editedLinkItem && { Link_Item: editedLinkItem }),
        ...(editedLinkRoutingData && {
          Link_Routing_Data: editedLinkRoutingData,
        }),
      };

      const response = await axios.put(
        `${BASE_URL}/FooterPage/footerLinks/${Link_Id}`,
        updateData
      );
      console.log("Response:", response.data);

      // Reset edit state
      setEditFooterItemId(null);
      setEditedLinkItem("");
      setEditedLinkRoutingData("");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  

  useEffect(() => {
    // Function to fetch data from the server
    const fetchData = async () => {
      try {
        // Make a GET request to fetch data from the server
        const response = await axios.get(`${BASE_URL}/FooterPage/footerLinks`);
        // Set the fetched data to the state
        setFooterLinkData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once when the component mounts

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetch(`${BASE_URL}/FooterPage/social-icons`)
      .then((response) => response.json())
      .then((data) => {
        // Update state with the retrieved data
        setSocialIcons(data.socialIcons);
      })
      .catch((error) => console.error("Error fetching social icons:", error));
  }, []); // Empty dependency array means this effect runs only once when component mounts

  const [iconLink, setIconLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the backend API
      const response = await axios.post(`${BASE_URL}/FooterPage/social-icons`, {
        iconLink,
      });
      if (response.status === 201) {
        // Handle successful response
        console.log("Social media link uploaded successfully");
        // Optionally, you can reset the form fields
        setIconLink("");
      }
    } catch (error) {
      // Handle errors
      console.error("Error uploading social media link:", error);
    }
  };

  const handleEditClickIcons = () => {
    setShowForm(true);
  };

  const handleEditClickPopupThree = (content_id, content_name) => {
    setEditItemIdThree(content_id);
    setEditedItemThree({ content_name });
    setIsPopupOpen(true);
    setEditedValue(content_name); // Set the initial value of the input field
  };

  const handleSave = () => {
    // Implement logic to save the edited value
    handleEditSaveThree(editItemIdThree, editedValue); // Assuming handleEditSaveThree updates the dataThree state
    setIsPopupOpen(false); // Close the popup
  };

  const handleCancel = () => {
    // Reset state and close the popup
    setEditItemIdThree(null);
    setEditedItemThree(null);
    setIsPopupOpen(false);
    setEditedValue("");
    setShowFooterLinksData(false);
    setFooterpopupconatiner(false)
  };

  const handleInputChange = (e) => {
    // Update the edited value as the user types
    setEditedValue(e.target.value);
  };

  const handleExistingValueChangeThree = (e) => {
    const newValue = e.target.value;
    setEditedItemThree((prevState) => ({
      ...prevState,
      cntent_name: newValue,
    }));
  };

  const [editedText, setEditedText] = useState("");

  // const [editedItem, setEditedItem] = useState(null);

  const [additionalData, setAdditionalData] = useState("");

  const [editedItem, setEditedItem] = useState({
    content_name: "", // Initialize with an empty string
  });
  const [editedItemThree, setEditedItemThree] = useState({
    content_name: "",
  });

  const [editedItemOne, setEditedItemOne] = useState({
    content: "",
  });
  // Function to handle changes in the existing value
  const handleExistingValueChange = (e) => {
    setEditedItem({ ...editedItem, content_name: e.target.value });
  };

  const handleExistingValueChangeOne = (e) => {
    const newValue = e.target.value;
    setEditedItemOne({ content: newValue });
  };

  // Function to handle changes in additional data
  const handleAdditionalDataChange = (e) => {
    setAdditionalData(e.target.value);
  };

  const handleEditClick = () => {
    setPopupVisible(true);
    setFooterpopupconatiner(true);
  };

  const handleEditClickPopupOne = (content_id, content) => {
    setEditedItemIdOne(content_id);
    setEditedItemOne({ content: content });
  };

  const handleEditClickPopup = (id) => {
    setEditItemId(id);
    // Find the item associated with the editItemId and store it in state
    const itemToEdit = dataTwo.find((item) => item.Content_id === id);
    setEditedItem(itemToEdit);
  };

  const handleEditSave = async (content_id, editedContent, setDataTwo) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/FooterPage/landingfooterContentDataOneUpdate/${content_id}`,
        { content_name: editedContent }
      );

      console.log("Data updated successfully:", response.data);

      setDataTwo((prevData) =>
        prevData.map((item) =>
          item.Content_id === content_id
            ? {
              ...item,
              content_name: editedContent,
            }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEditSaveOne = async (content_id, editedContent, setDataOne) => {
    console.log(content_id);
    console.log(editedContent);
    try {
      const response = await axios.put(
        `${BASE_URL}/FooterPage/landingfooterContentDataTwoUpdate/${content_id}`,
        { content_name: editedContent } // Ensure the correct field name is sent to the backend
      );

      console.log("Data updated successfully:", response.data);

      setDataOne((prevData) =>
        prevData.map((item) =>
          item.content_id === content_id
            ? {
              ...item,
              content: editedContent,
            }
            : item
        )
      );

      setEditedItemIdOne(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEditSaveThree = async (
    content_id,
    editedContent,
    setDataThree
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/FooterPage/landingfooterContentDataThreeUpdate/${content_id}`,
        { content_name: editedContent }
      );

      console.log("Data updated successfully:", response.data);

      setDataThree((prevData) =>
        prevData.map((item) =>
          item.content_id === content_id
            ? {
              ...item,
              content_name: editedContent,
            }
            : item
        )
      );

      setEditItemIdThree(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }; const handleCloseClickeditlinks = () => {
    setShowPreviousLinksData(false);

    setFooterpopupconatiner(false);

  };
  // handleCloseClickeditlinks;
  const handleCloseClick = () => {
    setPopupVisible(false);
    setContactUsPopup(false);
    setCopyRightContent(false);
    setEditItemId(false);
    setShowForm(false);
    setFooterpopupconatiner(false)
  };
  const handleEditContact_Us = () => {
    setContactUsPopup(true);
    setFooterpopupconatiner(true);
  };
  const handleEditCopyRightContent = () => {
    setFooterpopupconatiner(true)
    setCopyRightContent(true);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/FooterPage/landingfooterContentDataOne`)
      .then((res) => {
        setDataOne(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data from landing_page_one:", error);
      });
  }, []);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/FooterPage/landingfooterContentDataTwo`
        );
        setDataTwo(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_page_two:", error);
      }
    };

    fetchFooterData();
  }, []);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/FooterPage/landingfooterContentDataThree`
        );
        setDataThree(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_copyright:", error);
      }
    };

    fetchFooterData();
  }, []);
  const handleDeleteItemOne = async (content_id) => {
    try {
      console.log("Deleting item with ID:", content_id);
      const response = await axios.delete(
        `${BASE_URL}/FooterPage/landingfooterContentDataOne/${content_id}`
      );

      console.log("Success:", response.data);
      console.log("Item deleted");

      setDataOne((prevData) =>
        prevData.filter((dataItem) => dataItem.Content_id !== content_id)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleDeleteItemTwo = async (content_id) => {
    try {
      console.log("Deleting item with ID:", content_id);
      await axios.delete(
        `${BASE_URL}/FooterPage/landingfooterContentDataTwo/${content_id}`
      );
      console.log("Item deleted");
      setDataTwo((prevData) =>
        prevData.filter((dataItem) => dataItem.content_id !== content_id)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDeleteItemThree = async (content_id) => {
    try {
      console.log("Deleting item with ID:", content_id);
      const response = await axios.delete(
        `${BASE_URL}/FooterPage/landingfooterContentDataThree/${content_id}`
      );

      console.log("Success:", response.data);
      console.log("Item deleted");

      setDataThree((prevData) =>
        prevData.filter((dataItem) => dataItem.Content_id !== content_id)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };


  const themeFromContext = useContext(ThemeContext);

  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
  return (
    <div>
       <div>
      {/* =======================all the pop ups================================== */}
      {footerpopupconatiner ? (
        <>
          <div className="footereditinglandingpart">
            {popupVisible && (
              <div className="new_landingfooter_conatinerfristpopup">
                fristpopup
                {dataOne.map((item) => (
                  <li key={item.content_id}>
                    {item.content}
                    <div className="new_landingfooter_conatinerfristpopupbtncontiner">
                      <button
                        onClick={() =>
                          handleEditClickPopupOne(item.content_id, item.content)
                        }
                      >
                        <CiEdit />
                      </button>

                      <button
                        onClick={() => handleDeleteItemOne(item.content_id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </li>
                ))}
                {editItemIdOne && editedItemOne && (
                  <div className="new_landingfooter_conatinerfristpopupsubpart">
                    <h3>Edit</h3>
                    <input
                      type="text"
                      value={editedItemOne.content}
                      onChange={handleExistingValueChangeOne}
                    />
                    <div className="new_landingfooter_conatinerfristpopupbtncontiner">
                      <button
                        onClick={() =>
                          handleEditSaveOne(
                            editItemIdOne,
                            editedItemOne.content,
                            setDataOne
                          )
                        }
                      >
                        Save
                      </button>
                      <button onClick={() => setEditedItemIdOne(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleCloseClick}
                  className="new_landingfooter_conatinerfristpopupsubpartclose"
                >
                  Close
                </button>
              </div>
            )}

            <div>
              {showFooterLinksData && (
                <div className="new_landingfooter_conatinersecondpopup">
                  <h3>Add Footer Links</h3>
                  <form onSubmit={handleSubmitFooterLinks}>
                    <li>
                      <label>Link Name:</label>
                      <input
                        type="text"
                        name="Link_Item"
                        value={formData.Link_Item}
                        onChange={handleChange}
                        required
                      />
                    </li>
                    <li>
                      <label>Routing Path Data:</label>
                      <input
                        type="text"
                        name="Link_Routing_Data"
                        value={formData.Link_Routing_Data}
                        onChange={handleChange}
                        required
                      />
                    </li>
                    <div className="new_landingfooter_conatinerfristpopupbtncontiner">
                      <button type="submit">Submit</button>
                      <button onClick={handleCancel}>Close</button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              {showPreviousLinksData && (
                <div className="new_landingfooter_conatinersecondpopup_links">
                  <ul>
                    {footerLinkData.map((item) => (
                      <li key={item.Link_Id}>
                        {editFooterItemId === item.Link_Id ? (
                          <>
                            <div className="edittwoinputinlinkscontiner">
                              <input
                                type="text"
                                value={editedLinkItem}
                                onChange={handleChangeLinkItem}
                                required
                              />
                              <input
                                type="text"
                                value={editedLinkRoutingData}
                                onChange={handleChangeLinkRoutingData}
                                required
                              />
                              <div className="edittwoinputinlinksbtncontiner">
                                <button
                                  onClick={() =>
                                    handleSaveFooterItem(item.Link_Id)
                                  }
                                >
                                  Save
                                </button>
                                <button onClick={handleCancelFooterItem}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <Link
                              to={item.Link_Routing_Data}
                              style={{ color: "black" }}
                            >
                              {item.Link_Item}
                            </Link>
                            <div className="new_landingfooter_conatinersecondpopup_linksbtncontiner">
                              <button
                                onClick={() =>
                                  handleEditFooterItemClick(
                                    item.Link_Id,
                                    item.Link_Item,
                                    item.Link_Routing_Data
                                  )
                                }
                              >
                                <CiEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteFooterItem(item.Link_Id)
                                }
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="new_landingfooter_conatinersecondpopup_close"
                    onClick={handleCloseClickeditlinks}
                  >
                    close
                  </button>
                </div>
              )}
            </div>



            <div>
              {contactUsPopup && (
                <div className="new_landingfooter_conatinerthridpopup">
                  {dataTwo.map((item) => (
                    <li key={item.Content_id} className="black-text">
                      {item.content_name}{" "}
                      <div className="new_landingfooter_conatinerthridpopupbtncontiner">
                        <button>
                          <CiEdit
                            onClick={() =>
                              handleEditClickPopup(item.Content_id)
                            }
                          />{" "}
                        </button>
                        <button>
                          <MdDelete
                            onClick={() => handleDeleteItemTwo(item.Content_id)}
                          />
                        </button>
                      </div>
                    </li>
                  ))}

                  {editItemId && editedItem && (
                    <div className="new_landingfooter_conatinerthridpopupsub">
                      <h3>Edit</h3>
                      <li>
                        <input
                          type="text"
                          value={editedItem.content_name}
                          onChange={handleExistingValueChange}
                        />
                      </li>
                      <div className="new_landingfooter_conatinerthridpopupbtncontiner">
                        <button
                          onClick={() =>
                            handleEditSave(
                              editItemId,
                              editedItem.content_name,
                              setDataTwo
                            )
                          }
                        >
                          Save
                        </button>
                        <button onClick={() => setEditItemId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    className="new_landingfooter_conatinerthridpopup_close"
                    onClick={handleCloseClick}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {copyRightContent && (
              <div className="new_landingfooter_copyrightpopup">
                {dataThree.map((item) => (
                  <li key={item.content_id} className="black-text">
                    {item.content_name}{" "}
                    <div className="new_landingfooter_copyrightpopupbtncontainer">
                      <button>
                        <CiEdit
                          onClick={() =>
                            handleEditClickPopupThree(
                              item.content_id,
                              item.content_name
                            )
                          }
                        />
                      </button>
                      <button>
                        {" "}
                        <MdDelete
                          onClick={() => handleDeleteItemThree(item.content_id)}
                        />
                      </button>
                    </div>
                  </li>
                ))}
                {isPopupOpen && (
                  <div className="new_landingfooter_copyrightpopupsub">
                    <input
                      type="text"
                      value={editedValue}
                      onChange={handleInputChange}
                    />
                    <div className="new_landingfooter_copyrightpopupsubbtnconatiner">
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleCloseClick}
                  className="new_landingfooter_copyrightpopupclose"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* {popupVisible && (
        <div
          className="popup"
          style={{
            backgroundColor: "white",
            height: "auto",
            width: "600px",
          }}
        >
          {dataOne.map((item) => (
            <li key={item.content_id} className="black-text">
              {item.content}
              <CiEdit
                onClick={() =>
                  handleEditClickPopupOne(item.content_id, item.content)
                }
              />
              fdglkjfd
              <MdDelete onClick={() => handleDeleteItemOne(item.content_id)} />
            </li>
          ))}

          {editItemIdOne && editedItemOne && (
            <div className="popup">
              <input
                type="text"
                value={editedItemOne.content}
                onChange={handleExistingValueChangeOne}
              />
              <button
                onClick={() =>
                  handleEditSaveOne(
                    editItemIdOne,
                    editedItemOne.content,
                    setDataOne
                  )
                }
              >
                Save Changes
              </button>
              <button onClick={() => setEditedItemIdOne(null)}>Cancel</button>
            </div>
          )}

          <button onClick={handleCloseClick}>Close</button>
        </div>
      )} */}
      {/* =======================all the pop ups================================== */}
      <div className={`new_landingfooter ${themeDetails.ThemeFooterMainContainer}`}>
        <div className={`${themeDetails.ThemeFooterSubContainer}`}>
          <div className={`new_landingfooter_conatinerfristpart ${themeDetails.ThemeFooterSubContainerFirstPart}`}>
            <div className={`new_landingfooter_conatinersubfristpart1 ${themeDetails.ThemeFooterSubContainerSecondtPart}`}>

              {/* // for edit enableEditcontainer is in ternary oprator start  */}
              {enableEditcontainer ? (
                <>
                  <button onClick={handleEditClick} className="editbtn">
                    Edit
                    <LiaEditSolid />
                  </button>
                </>
              ) : null}
              {/* // for edit enableEditcontainer is in ternary oprator end  */}




              <div className={`${themeDetails.ThemeFooterSubContainerFirstPartEGATEData}`}>

                {dataOne.map((item, index) =>
                  // Render <h3> tag for the first item, and <p> tags for the rest
                  index === 0 ? (
                    <div key={item.Content_id}>
                      <h2 className="new_landingfooter_conatinerfristpart_item">
                        {item.content}
                      </h2>
                    </div>
                  ) : (
                    <p
                      className="new_landingfooter_conatinerfristpart_item"
                      key={item.Content_id}
                    >
                      {item.content}
                    </p>
                  )
                )}
              </div>

            </div>
            <div className="new_landingfooter_conatinersubfristpart2">
              {enableEditcontainer ? (
                <div className="new_landingfooter_conatinersubfristpart2addeditbtn">
                  <button className="addtn" onClick={toggleForm}>
                    <IoMdAddCircleOutline /> Add
                  </button>
                  <button className="editbtn" onClick={displayLinksData}>
                    <LiaEditSolid /> Edit
                  </button>
                </div>
              ) : null}

              <div className={`${themeDetails.ThemeFooterSubContainerFirstPartLinksData}`}>
                <ul>
                  {footerLinkData.map((item) => (
                    <li key={item.Link_Id}>
                      <Link to={item.Link_Routing_Data}>{item.Link_Item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="new_landingfooter_conatinersecondpart">
            {enableEditcontainer ? (
              <>
                <button onClick={handleEditContact_Us} className="editbtn">
                  <LiaEditSolid />
                  Edit
                </button>
              </>
            ) : null}


            <div className={`${themeDetails.ThemeFooterSubContainerSecondtPartContactUsData}`}>

              {dataTwo.map((item, index) =>
                index === 0 ? (
                  <div key={item.Content_id}>
                    <h2 className="new_landingfooter_conatinersecondpart_item">
                      {item.content_name}
                    </h2>
                  </div>
                ) : (
                  <p
                    className="new_landingfooter_conatinersecondpart_item"
                    key={item.Content_id}
                  >
                    {item.content_name}
                  </p>
                )
              )}
            </div>


          </div>
        </div>
        <hr className={`${themeDetails.ThemeFooterHorizantalLine}`} />
        {" "}
        <div className={`${themeDetails.ThemeFooterSubContainerCopywriteData}`} >
          <ul>
            {dataThree.map((item) => (
              <li key={item.Content_id}>{item.content_name}</li>
            ))}

            {enableEditcontainer ? (
              <>
                <button
                  className="editbtn"
                  onClick={handleEditCopyRightContent}
                >
                  <LiaEditSolid />
                  Edit
                </button>
              </>
            ) : null}
          </ul>

          {showForm && (
            <div
              className="popup"
              style={{
                backgroundColor: "white",
                height: "auto",
                width: "600px",
              }}
            >
              <h2>Upload Social Media Link</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="iconLink">Social Media Link:</label>
                  <input
                    type="text"
                    id="iconLink"
                    value={iconLink}
                    onChange={(e) => setIconLink(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Upload</button>
                <button onClick={handleCloseClick}>close</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
      {/* <PrivacyPolicy />
      <PricingandRefundPolicy />
      <TermsAndCondetions />
      <FAQ />
      <ContactUs/> */}
    </div>
  );
};

export default Footer;
