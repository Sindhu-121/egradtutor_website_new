

import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../../apiConfig";
// import FooterMain_Page from "../Footer_Admin/FooterMain_Page";
import FAQEdit from "./FAQEdit";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [image, setImage] = useState(null);
  const [showFaqForm, setShowFaqForm] = useState(false);

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






  return (
    <div>
      <div>
        {image ? <img src={image} alt="Current" /> : <p>No image available</p>}
      </div>
      <div>
        <h1>FREQUENTLY ASKED QUESTIONS</h1>

   
        <button onClick={() => setShowFaqForm(!showFaqForm)}>
          {showFaqForm ? "Close FAQ Form" : "Add FAQ"}
        </button>
        {/* <button onClick={openAddForm} className="add-clicked"><FaRegPenToSquare /></button> */}

        <div>
        {showFaqForm && <FAQEdit type="aboutFaq" />}
          {faqs.map((faq) => (
            <div key={faq.faq_id}>
              <div>
                <div>
                  <h3 id="faq_title" onClick={() => toggleAnswer(faq.faq_id)}>
                    {faq.faq_questions}
                  </h3>
                  <p
                    id={`faq_ans_${faq.faq_id}`}
                    className={`faq_ans ${
                      openFaqId === faq.faq_id ? "show" : ""
                    }`}
                  >
                    {faq.faq_answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* <FooterMain_Page /> */}
      </div>
    </div>
  );
};

export default FAQ;
