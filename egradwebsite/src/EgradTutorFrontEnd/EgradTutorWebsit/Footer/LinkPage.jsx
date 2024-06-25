import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../../../apiConfig";
import styles from './LinkPage.module.css'; // Import CSS module

const LinkPage = () => {
  const { Link_Id } = useParams();
  const [footerDocumentData, setFooterDocumentData] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Footer/footerLinks/${Link_Id}`);
        console.log('Response from server:', response.data);
        if (response.data.length > 0) {
          setFooterDocumentData(response.data[0].footer_document_data);
        } else {
          setError('No data found');
        }
      } catch (error) {
        console.error('Error fetching footer links:', error);
        setError('Error fetching data from the server');
      }
    };

    if (Link_Id) {
      fetchFooterLinks();
    }
  }, [Link_Id]);

  return (
    <div>
      {/* <h2>Link Page Content</h2> */}
      {error && <div>Error: {error}</div>}
      <div className={styles['footer-content']}>
        {/* Render footerDocumentData */}
        {footerDocumentData ? (
          <div dangerouslySetInnerHTML={{ __html: footerDocumentData }} />
        ) : (
          <p>No footer document data found.</p>
        )}
      </div>
    </div>
  );
};

export default LinkPage;