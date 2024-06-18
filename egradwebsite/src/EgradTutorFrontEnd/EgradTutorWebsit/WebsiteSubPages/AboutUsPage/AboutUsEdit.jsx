import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
const AboutUsEdit = ({ type }) => {
  const [showForm, setShowForm] = useState(true);
  const [showAboutUsForm, setShowAboutUsForm] = useState(false);
  const [showAboutEgtForm, setShowAboutEgtForm] = useState(false);
  const [aboutUsTitle, setAboutUsTitle] = useState("");
  const [aboutUsDescription, setAboutUsDescription] = useState("");
  const [editAboutUsId, setEditAboutUsId] = useState(null);
  const [aboutegrad, setAboutegrad] = useState("");
  const [aboutEgradData, setAboutEgradData] = useState([]);
  const [aboutUsData, setAboutUsData] = useState([]);

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    let dataToSend;
    let url;
    let successMessage;

    if (type === "aboutUs") {
      dataToSend = {
        Title: aboutUsTitle,
        Description: aboutUsDescription,
      };

      if (editAboutUsId) {
        url = `${BASE_URL}/AboutUsEdit/about_us/${editAboutUsId}`;
        successMessage = "About Us data updated successfully!";
      } else {
        url = `${BASE_URL}/AboutUsEdit/about_us`;
        successMessage = "About Us data saved successfully!";
      }
    } else if (type === "aboutegrad") {
      dataToSend = {
        aboutegrad: aboutegrad,
      };
      url = `${BASE_URL}/AboutUsEdit/about_egt`;
      successMessage = "About eGRAD Tutor data saved successfully!";
    }

    try {
      if (type === "aboutUs" && editAboutUsId) {
        await axios.put(url, dataToSend);
        setEditAboutUsId(null);
      } else {
        await axios.post(url, dataToSend);
      }
      alert(successMessage);

      // Reset form fields
      if (type === "aboutUs") {
        setAboutUsTitle("");
        setAboutUsDescription("");
        setShowAboutUsForm(false);
      } else if (type === "aboutegrad") {
        setAboutegrad("");
        setShowAboutEgtForm(false);
      }
    } catch (error) {
      console.error(
        `Error saving ${
          type === "aboutUs" ? "About Us" : "About eGRAD Tutor"
        } data:`,
        error
      );
    }
  };

  const handleEditAboutegrad = (aboutEgrad) => {
    setEditAboutUsId(aboutEgrad.about_egt_id);
    setAboutegrad(aboutEgrad.about_egt);
    setShowAboutEgtForm(true);
  };

  const handleEditAboutUs = (aboutUs) => {
    setEditAboutUsId(aboutUs.about_us_id);
    setAboutUsTitle(aboutUs.Title);
    setAboutUsDescription(aboutUs.Description);
    setShowAboutUsForm(true);
  };

  const handleDeleteAboutegrad = async (about_egt_id) => {
    try {
      await axios.delete(`${BASE_URL}/AboutUsEdit/about_egt`);
      alert("About eGRAD Tutor data deleted successfully!");
      fetchAboutEgradData();
    } catch (error) {
      console.error("Error deleting About eGRAD Tutor data:", error);
    }
  };

  const handleDeleteAboutUs = async (about_us_id) => {
    try {
      await axios.delete(`${BASE_URL}/AboutUsEdit/about_us/${about_us_id}`);
      alert("About Us data deleted successfully!");
      fetchAboutUsData();
    } catch (error) {
      console.error("Error deleting About Us data:", error);
    }
  };
  const fetchAboutEgradData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_egt`);
      setAboutEgradData(response.data);
      console.log(
        "About eGRAD Tutor data fetched successfully:",
        response.data
      );
    } catch (error) {
      console.error("Error fetching About eGRAD Tutor data:", error);
    }
  };

  const fetchAboutUsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_us`);
      setAboutUsData(response.data);
    } catch (error) {
      console.error("Error fetching About Us data:", error);
    }
  };

  useEffect(() => {
    fetchAboutUsData();
    fetchAboutEgradData();
  }, []);

  useEffect(() => {
    if (type === "aboutUs") {
      fetchAboutUsData();
    } else if (type === "aboutEgrad") {
      fetchAboutEgradData();
    }
  }, [type]);

  return (
    <div>
      {type === "aboutUs" && (
        <div className="about_egt_popup">
          <div className="about_egt_form">
            <form onSubmit={(e) => handleSubmit(e, "aboutUs")}>
              <label htmlFor="aboutUsTitle">Title:</label>
              <input
                id="aboutUsTitle"
                value={aboutUsTitle}
                onChange={(e) => setAboutUsTitle(e.target.value)}
              />
              <label htmlFor="aboutUsDescription">Description:</label>
              <textarea
                id="aboutUsDescription"
                value={aboutUsDescription}
                onChange={(e) => setAboutUsDescription(e.target.value)}
                placeholder="Description"
                rows={10}
                cols={20}
              />
              <button type="submit">Save About Us</button>
            </form>
          </div>
          {aboutUsData.map((aboutUs) => (
            <div key={aboutUs.about_us_id}>
              <h2>{aboutUs.Title}</h2>
              <p>{aboutUs.Description}</p>

              <div>
                <button
                  onClick={() => handleEditAboutUs(aboutUs)}
                  className="popup_edit_btn"
                >
                  {" "}
                  <BiSolidEditAlt />
                </button>
                <button
                  onClick={() => handleDeleteAboutUs(aboutUs.about_us_id)}
                  className="popup_delete_btn"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "aboutEgrad" && (
        <div className="about_egt_popup">
          <div className="about_egt_form">
            <form onSubmit={(e) => handleSubmit(e, "aboutegrad")}>
              <label htmlFor="aboutegradtutor">About eGRAD Tutor</label>
              <textarea
                id="aboutegradtutor"
                value={aboutegrad}
                onChange={(e) => setAboutegrad(e.target.value)}
                placeholder="About eGRAD Tutor"
                rows={10}
                cols={20}
              />
              <button type="submit">Save About eGRAD Tutor</button>
            </form>
          </div>
          {aboutEgradData.map((aboutEgrad) => (
            <div key={aboutEgrad.about_egt_id}>
              <p>{aboutEgrad.about_egt}</p>

              <button
                onClick={() => handleEditAboutegrad(aboutEgrad)}
                className="popup_edit_btn"
              >
                <BiSolidEditAlt />
              </button>
              <button
                onClick={() => handleDeleteAboutegrad(aboutEgrad.about_egt_id)}
                className="popup_delete_btn"
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutUsEdit;
