import React, { useState, useEffect } from 'react';
import WhychooseUsEdit from './WhychooseUsEdit'
import BASE_URL from "../../../../apiConfig";
const WhyChooseUs = ({isEditMode}) => {
  const [WhyChooseUsitems, setWhyChooseUsItems] = useState([]);
  const [showWhyChooseUsForm, setShowWhyChooseUsForm] = useState(false);
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
          <li key={WhyChooseUsitem.WhyChooseUsId}>
             <img src={`data:image/png;base64,${WhyChooseUsitem.WhyChooseUsImeage}`} alt={WhyChooseUsitem.WhyChooseUsTitle} />
            <p>{WhyChooseUsitem.WhyChooseUsTitle}  </p>
            <p>{WhyChooseUsitem.WhyChooseUsDiscreption}</p>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default WhyChooseUs