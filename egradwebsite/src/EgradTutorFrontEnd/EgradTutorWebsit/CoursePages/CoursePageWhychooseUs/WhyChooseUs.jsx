import React, { useState, useEffect } from 'react';
import WhychooseUsEdit from './WhychooseUsEdit'
import BASE_URL from "../../../../apiConfig";
import '../../../../styles/WhyChooseUsStyles/Theme2WCU.css'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
const WhyChooseUs = ({ isEditMode }) => {
  const [WhyChooseUsitems, setWhyChooseUsItems] = useState([]);
  const [showWhyChooseUsForm, setShowWhyChooseUsForm] = useState(false);
  const { Branch_Id } = useParams();
  const [tabsData, setTabsData] = useState({
    coursePortaleName: "",
    courseTabName: "",
    courseTabComponent: "",

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
const fetchCourseTabTitles=async()=>{
  try {
    const response=await axios.get(`${BASE_URL}/courseTab/getCourseTabNames`)
  } catch (error) {
    
  }
}

  const handleChangeTabData = (e) => {
    setTabsData({
      coursePortaleName: e.target.value,
      courseTabName: e.target.value,
      courseTabComponent: e.target.value,

    })
    console.log(tabsData);
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
      <form action="">
        <div>
          <label htmlFor="">Select a Portale: </label>
          <select onChange={handleChangeTabData} value={tabsData.coursePortaleName}>
            {portales.map((portale) => (
              <option key={portale.Portale_Id} value={portale.Portale_Name}>
                {portale.Portale_Name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {tabsData && (
            <div>
              <label htmlFor="">Select tab :</label>

            </div>
          )}

        </div>
      </form>

    </div>
  )
}

export default WhyChooseUs