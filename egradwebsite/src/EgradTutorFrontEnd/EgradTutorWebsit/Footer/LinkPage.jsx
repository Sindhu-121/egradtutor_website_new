import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../../../apiConfig";
import styles from './LinkPage.module.css'; // Import CSS module
import { Link } from 'react-router-dom'
import defaultImage from '../../../assets/defaultImage.png';
import { IoHome } from "react-icons/io5";
import JSONClasses from '../../../ThemesFolder/JSONForCSS/JSONClasses';
import { ThemeContext } from '../../../ThemesFolder/ThemeContext/Context';
import '../../../styles/UGHomePage/UgHomePage_Default_Theme.css';
import '../../../styles/Theme1LinksPage.css';

const LinkPage = () => {
  const { Link_Id } = useParams();
  const { EntranceExams_Id } = useParams();
  const [footerDocumentData, setFooterDocumentData] = useState('');
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [entranceExam, setEntranceExam] = useState([]);
  const themeFromContext = useContext(ThemeContext);


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


  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")


  return (
    <>

      <div className={`LinksPagesMainContainer ${themeDetails.LinksPagesMainContainer}`}>
        <div className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`} >
          <>
            {image ? (
              <Link to="/" >
                <img
                  src={image}

                  alt="Current"
                /></Link>
            ) : (
              <img src={defaultImage} alt="Default" />
            )}
          </>


          <span >
            <Link to={`/`}><IoHome />Home</Link>
          </span>
        </div>
        {/* <h2>Link Page Content</h2> */}
        {error && <div>Error: {error}</div>}
        <div className={styles['footer-content']}>
          {/* Render footerDocumentData */}
          {footerDocumentData ? (
            <div dangerouslySetInnerHTML={{ __html: footerDocumentData }} className={`LinksDataContainer ${themeDetails.LinksDataContainer}`} />
          ) : (
            <p>No footer document data found.</p>
          )}
        </div>

      </div>

      {themeColor === "theme-1" &&
        <>
          <div className={`LinksPagesMainContainer ${themeDetails.LinksPagesMainContainer}`}>
            <div className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`} >
              <>
                {image ? (
                  <Link to="/" >
                    <img
                      src={image}

                      alt="Current"
                    /></Link>
                ) : (
                  <img src={defaultImage} alt="Default" />
                )}
              </>


              <span >
                <Link to={`/`}><IoHome />Home</Link>
              </span>
            </div>
            {/* <h2>Link Page Content</h2> */}
            {error && <div>Error: {error}</div>}

            <div className={styles['footer-content']}>
              {/* Render footerDocumentData */}
              {footerDocumentData ? (
                <div dangerouslySetInnerHTML={{ __html: footerDocumentData }} className={`LinksDataContainer ${themeDetails.LinksDataContainer}`} />
              ) : (
                <p>No footer document data found.</p>
              )}
            </div>
          </div>

        </>
      }

      {themeColor === "theme-2" &&
        <>
          <div className={`LinksPagesMainContainer ${themeDetails.LinksPagesMainContainer}`}>
            <div className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`} >
              <>
                {image ? (
                  <Link to="/" >
                    <img
                      src={image}

                      alt="Current"
                    /></Link>
                ) : (
                  <img src={defaultImage} alt="Default" />
                )}
              </>


              <span >
                <Link to={`/`}><IoHome />Home</Link>
              </span>
            </div>
            {/* <h2>Link Page Content</h2> */}
            {error && <div>Error: {error}</div>}

            <div className={styles['footer-content']}>
              {/* Render footerDocumentData */}
              {footerDocumentData ? (
                <div dangerouslySetInnerHTML={{ __html: footerDocumentData }} className={`LinksDataContainer ${themeDetails.LinksDataContainer}`} />
              ) : (
                <p>No footer document data found.</p>
              )}
            </div>
          </div>

        </>
      }
    </>
  );
};

export default LinkPage;