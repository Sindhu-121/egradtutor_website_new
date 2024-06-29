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
  const [courseTabTitlesData, setCourseTabTitlesData] = useState([]);
  const [courseTabButtonNames, setCourseTabButtonNames] = useState([]);
  const [selectedTabContent, setSelectedTabContent] = useState("")
  const { Branch_Id } = useParams();
  const [tabsData, setTabsData] = useState({
    coursePortaleId: "",
    courseTabId: "",
    // courseTabTitle: "",
    courseTabDescription: "",
    courseTabImage: null

  })
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


  const handleChangeTabData = (e) => {
    console.log(tabsData);
    setTabsData(prevState => {
      const newState = { ...prevState, [e.target.name]: e.target.value };
      console.log(newState);
      return newState;
    });
  }
  const handleTabImageChange = (e) => {
    const file = e.target.files[0]
    setTabsData(prevState => {
      const newState = { ...prevState, [e.target.name]: file }
      console.log(newState);
      return newState;

    })
  }
  const handleTabDataSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('coursePortaleId', tabsData.coursePortaleId);
    formData.append('courseTabId', tabsData.courseTabId);
    formData.append('courseTabDescription', tabsData.courseTabDescription);
    formData.append('courseTabImage', tabsData.courseTabImage);

    try {
      const response = await axios.post(`${BASE_URL}/courseTab/courseTabFormData`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200 && response.data.msg === "sent successfully") {
        alert("Info posted successfully");
      } else {
        alert("Failed to post info. Please try again.");
      }
    } catch (error) {
      console.log(error, "happened while posting the tabs data");
    }
  };
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
      {/* code for the dynamic data */}
      <form action="" onSubmit={handleTabDataSubmit}>
        <div>
          <label htmlFor="">Select a Portale: </label>
          <select name='coursePortaleId' onChange={handleChangeTabData} value={tabsData.coursePortaleId}>
            <option disabled value=''>Select a Portale</option>
            {portales.map((portale) => (
              <option key={portale.Portale_Id} value={portale.Portale_Id}>
                {portale.Portale_Name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {tabsData.coursePortaleId && (
            <div>
              <label htmlFor="">Select tab :</label>
              <select name="courseTabId" id="" onChange={handleChangeTabData} value={tabsData.courseTabId}>
                <option disabled value=''>Select a tab name</option>
                {courseTabTitlesData.map((tabName) => (
                  <option value={tabName.course_tab_id} >{tabName.course_tab_title}</option>
                ))}
              </select>

            </div>
          )}
          {tabsData.courseTabId && (
            <div>
              <label htmlFor="">Enter Course Tab Description : </label>
              <input type="text" name='courseTabDescription' onChange={handleChangeTabData} value={tabsData.courseTabDescription} placeholder='enter course tab description' />
            </div>
          )}
          {tabsData.courseTabDescription && (
            <div>
              <label htmlFor="">Choose a Image for tab :</label>
              <input type="file" name='courseTabImage' onChange={handleTabImageChange} />
            </div>
          )}
          {tabsData.courseTabImage && (
            <button type='submit' >Submit</button>
          )}

        </div>
      </form>
      {/* this is the portal tabs code */}
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
          <div className='tabImageDiv'>
            <img src={`data:image/png;base64,${selectedTabContent.course_tab_image}`} alt="the tab not displayed" />
          </div>
          {selectedTabContent.course_tab_text}
          </div>
      )}

    </div>

  )
}

export default WhyChooseUs