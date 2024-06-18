import React, { useContext, useEffect, useState } from 'react'
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import defaultImage from '../../../../assets/defaultImage.png';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import { IoHome } from "react-icons/io5";
import { useParams, Link } from 'react-router-dom'

const ExamPageHeader = () => {
  const { EntranceExams_Id } = useParams();
  const [entranceExam, setEntranceExam] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchEntranceExam = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/ExamPages/feachingentrance_exams/${EntranceExams_Id}`
        );
        console.log("Entrance Exam Data:", response.data);
        setEntranceExam(response.data);
      } catch (error) {
        console.error("Error fetching entrance exam:", error);
      }
    };
    fetchEntranceExam();
  }, [EntranceExams_Id]);

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

  const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")


  return (
    <div className={`Ug_examsPage_Main_Container ${themeDetails.themeExamPageHeaderMainContainer}`}>
      <div className={`Ug_examsPage_Container ${themeDetails.themeExamPageHeaderContainer}`}>
        {image ? (
          <img src={image} alt="Current" />
        ) : (
          <img src={defaultImage} alt="Default" />
        )}
      </div>
      <Link to="/BranchHomePage"><IoHome />Home</Link>
      {entranceExam.length > 0 &&
        entranceExam.map((exam) => (
          <div key={exam.EntranceExams_Id} className={`exampage_heading ${themeDetails.themeExamPageHeaderHeading}`}>
            <p>{exam.EntranceExams_name} Exam</p>
          </div>
        ))}
    </div>
  )
}

export default ExamPageHeader