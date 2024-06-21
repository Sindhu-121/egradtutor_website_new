

import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../../apiConfig";
// import FooterMain_Page from "../Footer_Admin/FooterMain_Page";
import { FaRegPenToSquare } from "react-icons/fa6";
// import "./style/Faq.css";
import { IoMdClose } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
const FAQEdit = ({type}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqId, setFaqId] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editFaqId, setEditFaqId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
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

  const openAddForm = () => {
    setModalMode("add");
    setFormVisible(true);
    setQuestion("");
    setAnswer("");
  };

  const openEditForm = (id) => {
    const faqToEdit = faqs.find((faq) => faq.faq_id === id);
    if (faqToEdit) {
      setQuestion(faqToEdit.faq_questions);
      setAnswer(faqToEdit.faq_answer);
      setEditFaqId(id);
      setEditMode(true);
      setModalMode("edit");
      setFormVisible(true);
      // setShowFaqForm(true);
    }
  };

  const closeForm = () => {
    setEditMode(false);
    setFormVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) {
      alert("Please enter both a question and an answer.");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/FaqEdit/faq`, {
        faq_question: question,
        faq_answer: answer,
      });
      alert("Question and answer added successfully");
      setFaqId(response.data.insertId);
      setAnswerId(null);
      setQuestion("");
      setAnswer("");
      fetchFaqs();
      fetchAnswers();
      // setFormVisible(false);
      setShowFaqForm(false)
    } catch (error) {
      console.error("Error adding question and answer", error);
    }
  };

  const handleUpdate = async (id) => {
    if (!question || !answer) {
      alert("Please enter both a question and an answer.");
      return;
    }
    try {
      const response = await axios.put(`${BASE_URL}/FaqEdit/faq/${id}`, {
        faq_question: question,
        faq_answer: answer,
      });
      alert("FAQ item updated successfully");
      setEditMode(false);
      setFaqId(null);
      setQuestion("");
      setAnswer("");
      fetchFaqs();
      fetchAnswers();
      setFormVisible(false);
    } catch (error) {
      console.error("Error updating FAQ item", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/FaqEdit/faq/${id}`);
      if (response.status !== 200) {
        throw new Error("Error deleting FAQ item");
      }
      setFaqs(faqs.filter((item) => item.faq_id !== id));
    } catch (error) {
      console.error("Error deleting FAQ item", error);
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

        {formVisible && (
          <div className="about_egt_popup">
            <h2>{modalMode === "add" ? <FaRegPenToSquare /> : <FaRegPenToSquare />}</h2>
            <button type="button" onClick={closeForm} className="hide-clicked">
                <IoMdClose />
                </button>
            <div className="about_egt_form">
            <form
              onSubmit={
                modalMode === "add"
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleUpdate(editFaqId);
                    }
              }
            >
              
              <div>
                <h3>
                  {modalMode === "add" ? "Enter Question" : "Update Question"}
                </h3>
                
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    modalMode === "add" ? "Enter question" : "Update question"
                  }
                  className="form-control"
                ></textarea>
              </div>
              <div>
                <h3>
                  {modalMode === "add" ? "Enter Answer" : "Update Answer"}
                </h3>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={
                    modalMode === "add" ? "Enter answer" : "Update answer"
                  }
                  className="form-control"
                ></textarea>
              </div>

              <div>
                <button type="submit">
                  {modalMode === "add" ? "Add" : "Update"}
                </button>
               
              </div>
            </form></div>
          </div>
        )}

        <button onClick={openAddForm} className="add-clicked"><FaRegPenToSquare /></button>

        <div>
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
                <button onClick={() => openEditForm(faq.faq_id)} className="popup_edit_btn"><BiSolidEditAlt /></button>
                <button onClick={() => handleDelete(faq.faq_id)} className="popup_delete_btn"><MdDelete /></button>
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

export default FAQEdit;
