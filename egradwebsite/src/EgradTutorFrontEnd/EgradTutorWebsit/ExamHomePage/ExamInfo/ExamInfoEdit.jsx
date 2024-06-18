import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
const ExamInfoEdit = ({type}) => {
  const { EntranceExams_Id } = useParams();
  const [existingInfo, setExistingInfo] = useState(false);
  const [newInfo, setNewInfo] = useState({
    Info_broucher: "",
    Official_Webpage: "",
    Conducting_Authority: "",
    Exam_Pattern: "",
    Eligibility: "",
    Syllabus: "",
    Important_Dates: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const handleInputChange = (e, field) => {
    setNewInfo({
      ...newInfo,
      [field]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {
      const dataToSend = {
        EntranceExams_Id,
        data: { ...newInfo },
      };

      if (existingInfo) {
        await axios.put(`${BASE_URL}/ExamPages/update_exam_info`, dataToSend);
        alert("Information updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/ExamPages/insert_exam_info`, dataToSend);
        alert("Information inserted successfully!");
      }
      setIsEditing(false); // Hide input fields after submission
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };
  return (
    <div>
        {type === "aboutUs" && (
             <div className="about_egt_popup">
             <div className="about_egt_form">
               <div className="popup_div">
                 <p>Information Brochure</p>
                 <input
                   type="text"
                   value={newInfo.Info_broucher}
                   onChange={(e) => handleInputChange(e, "Info_broucher")}
                   placeholder="Enter Info Brochure"
                 />
                 <p>Official Webpage</p>
                 <input
                   type="text"
                   value={newInfo.Official_Webpage}
                   onChange={(e) => handleInputChange(e, "Official_Webpage")}
                   placeholder="Enter Official Webpage"
                 />
               </div>
               <div className="popup_div">
                 {" "}
                 <p>Conducting Authority</p>
                 <input
                   type="text"
                   value={newInfo.Conducting_Authority}
                   onChange={(e) => handleInputChange(e, "Conducting_Authority")}
                   placeholder="Enter Conducting Authority"
                 />
                 <p>Syllabus</p>
                 <input
                   type="text"
                   value={newInfo.Syllabus}
                   onChange={(e) => handleInputChange(e, "Syllabus")}
                   placeholder="Enter Syllabus"
                 />
               </div>
 
               <p>Exam Pattern</p>
               <textarea
                 rows={10}
                 coloms={50}
                 value={newInfo.Exam_Pattern || ""}
                 onChange={(e) => handleInputChange(e, "Exam_Pattern")}
                 placeholder="Enter Exam Pattern"
               />
               <p>Eligibility</p>
               <textarea
                 rows={10}
                 coloms={20}
                 value={newInfo.Eligibility}
                 onChange={(e) => handleInputChange(e, "Eligibility")}
                 placeholder="Enter Eligibility"
               />
 
               <p>Important Dates</p>
               <textarea
                 rows={10}
                 coloms={20}
                 value={newInfo.Important_Dates}
                 onChange={(e) => handleInputChange(e, "Important_Dates")}
                 placeholder="Enter Important Dates"
               />
 
               <button onClick={handleSubmit}>Submit</button>
             </div>
           </div>
        )}
    </div>
  )
}

export default ExamInfoEdit