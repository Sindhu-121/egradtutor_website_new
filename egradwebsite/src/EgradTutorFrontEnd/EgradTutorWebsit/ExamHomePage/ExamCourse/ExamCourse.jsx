import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "../../../../apiConfig";
import { useParams,Link } from 'react-router-dom'
const ExamCourse = () => {
  const { EntranceExams_Id } = useParams();
  const [portaldata, setPortalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ExampagePortals/examPortal/${EntranceExams_Id}`);
        setPortalData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [EntranceExams_Id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div> 
     <ul>
        {portaldata.map(item => (
          <li key={item.Portale_Id}>
            {item.Portale_Name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExamCourse