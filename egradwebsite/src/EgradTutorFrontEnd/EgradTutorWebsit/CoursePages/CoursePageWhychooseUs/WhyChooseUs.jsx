import React, { useState, useEffect } from 'react';
import WhychooseUsEdit from './WhychooseUsEdit'
import BASE_URL from "../../../../apiConfig";
import '../../../../styles/WhyChooseUsStyles/Theme2WCU.css'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../CourseTabButtonComponents/WhyChooseUsComponent'
const WhyChooseUs = ({ isEditMode }) => {
  const [WhyChooseUsitems, setWhyChooseUsItems] = useState([]);
  const [showWhyChooseUsForm, setShowWhyChooseUsForm] = useState(false);
  const[showTabButtonForm,setShowTabButtonForm]=useState(false);

  const [courseTabTitlesData, setCourseTabTitlesData] = useState([]);
  const [courseTabButtonNames, setCourseTabButtonNames] = useState([]);
  const [selectedTabContent, setSelectedTabContent] = useState("")
  useEffect(() => {
    // Fetch saved data from the backend when the component mounts
    const fetchWhyChooseUsData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`);
        const data = await response.json();
        setWhyChooseUsItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchWhyChooseUsData();
  }, []);
  const [portales, setPortales] = useState([])
  useEffect(() => {
    fetchPortales();
    fetchCourseTabTitles();
    getCourseTabButtonNames();
  }, []);

  const fetchPortales = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ExploreExam/portales`);
      setPortales(response.data);
    } catch (error) {
      console.error("Error fetching portales:", error);
    }
  };
  // fetching the courses tab titles
  const fetchCourseTabTitles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courseTab/getCourseTabNames`)
      setCourseTabTitlesData(response.data);
      console.log(courseTabTitlesData)
    } catch (error) {
      console.log(error, "error happened while getting the course tab names in front end");
    }
  }

  // getCourseTabButtonNames
  const getCourseTabButtonNames = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courseTab/getCourseTabButtonDetails`)
      setCourseTabButtonNames(response.data);
      console.log(courseTabButtonNames)
    } catch (error) {
      console.log(error, "error while getting course tab names");
    }
  }
  const handleTabCClick = (totalTabButtonObj) => {
    console.log(totalTabButtonObj)
    setSelectedTabContent(totalTabButtonObj)
  }
// for default tab displaying
useEffect(()=>{
  if(courseTabButtonNames.length>0){
    const firstTab=courseTabButtonNames[0];
    console.log(firstTab,"This is the first tab")
    setSelectedTabContent(firstTab)
  }
},[courseTabButtonNames])

  return (
    <div>
      {isEditMode && (
        <div>
          <button onClick={() => setShowWhyChooseUsForm(!showWhyChooseUsForm)}>
            {showWhyChooseUsForm ? "Close" : "Add WhyChooseUs"}
          </button>
          {showWhyChooseUsForm && <WhychooseUsEdit type="WhyChooseUs" />}
        </div>
      )}
      <ul>
        {WhyChooseUsitems.map((WhyChooseUsitem) => (
          <li key={WhyChooseUsitem.WhyChooseUsId} className='whyChooseUsLi'>
            <div className='whyChooseUsImg'>
              <img src={`data:image/png;base64,${WhyChooseUsitem.WhyChooseUsImeage}`} alt={WhyChooseUsitem.WhyChooseUsTitle} />
            </div>
            <p>{WhyChooseUsitem.WhyChooseUsTitle}  </p>
            <p>{WhyChooseUsitem.WhyChooseUsDiscreption}</p>
          </li>
        ))}
      </ul>
      {isEditMode &&(
        <div>
          <button onClick={()=>setShowTabButtonForm(!showTabButtonForm)}>
            {showTabButtonForm?"Close":"AddTabsForPortals"}
          </button>
          {showTabButtonForm && <WhychooseUsEdit type="tabButtonForm"/>}
        </div>
      )}
      <ul style={{ display: "flex" }}>
        {courseTabButtonNames.map((tabButtons) => (
          <>
            <li key={tabButtons.courseTabId} >
              <div >
                <button onClick={() => handleTabCClick(tabButtons)}>{tabButtons.course_tab_title}</button>
              </div>
            </li>
          </>
        ))}
      </ul>
      {selectedTabContent && (
        <div>
          <div className='tabImageDiv' >
            <img src={`data:image/png;base64,${selectedTabContent.course_tab_image}`} alt="the tab not displayed" />
          </div>
          {selectedTabContent.course_tab_text}
          </div>
      )}

    </div>

  )
}

export default WhyChooseUs