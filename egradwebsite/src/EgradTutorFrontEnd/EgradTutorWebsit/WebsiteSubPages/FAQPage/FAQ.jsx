

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BASE_URL from "../../../../apiConfig";
// import FooterMain_Page from "../Footer_Admin/FooterMain_Page";
import FAQEdit from "./FAQEdit";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import defaultImage from '../../../../assets/defaultImage.png';
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import '../../../../styles/Faqs/Default_FAQS.css';
import Footer from "../../Footer/Footer";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [image, setImage] = useState(null);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const themeFromContext = useContext(ThemeContext);

  

  useEffect(() => {
    fetchFaqs();
    fetchAnswers();
    fetchImage();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Faq/faqs`);
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Faq/answers`);
      setAnswers(response.data);
    } catch (error) {
      console.error("Error fetching answers", error);
    }
  };


  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleAnswer = (faq_id) => {
    setOpenFaqId((prevId) => (prevId === faq_id ? null : faq_id));
  };
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

  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")

  return (
    <div  className={`FaqMainContainer ${themeDetails.FaqMainContainer}`}>
      <div className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`}>
        {image ? (
          <Link to="/">
            <img
              src={image}
              alt="Current"
            /></Link>
        ) : (
          <img src={defaultImage} alt="Default" />
        )}

        <span>
          <Link to={`/`}><IoHome />Home</Link>
        </span>
      </div>
      <div className={`FaqSubContainer ${themeDetails.FaqSubContainer}`}>
        <h1>FREQUENTLY ASKED QUESTIONS</h1>


        <button onClick={() => setShowFaqForm(!showFaqForm)}>
          {showFaqForm ? "Close FAQ Form" : "Add FAQ"}
        </button>
        {/* <button onClick={openAddForm} className="add-clicked"><FaRegPenToSquare /></button> */}

        <div  className={`FaqDataContainer ${themeDetails.FaqDataContainer}`}>
          {showFaqForm && <FAQEdit type="aboutFaq" />}
          {faqs.map((faq) => (
        <div key={faq.faq_id} className={`FaqData ${themeDetails.FaqData}`}>
          <h3 id="faq_title" onClick={() => toggleAnswer(faq.faq_id)}>
            {faq.faq_questions}
          </h3>
          <p
            id={`faq_ans_${faq.faq_id}`}
            className={`faq_ans ${openFaqId === faq.faq_id ? "show" : ""}`}
          >
            {faq.faq_answer}
          </p>
        </div>
      ))}
        </div>
      </div>

      <div>
   
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
