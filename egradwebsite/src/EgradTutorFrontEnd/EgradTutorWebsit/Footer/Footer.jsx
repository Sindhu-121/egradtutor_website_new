import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import { Link, useParams } from "react-router-dom";
import FooterEdit from "./FooterEdit";
import JSONClasses from "../../../ThemesFolder/JSONForCSS/JSONClasses";
import { ThemeContext } from "../../../ThemesFolder/ThemeContext/Context";
import "../../../styles/Default_landingPage_styles.css";
const Footer = () => {
  const [dataOne, setDataOne] = useState([]);
  const [dataTwo, setDataTwo] = useState([]);
  const [dataThree, setDataThree] = useState([]);
  const [footerLinkData, setFooterLinkData] = useState([]);
  const [FirstPopupVisible, setFirstPopupVisible] = useState(false);
  const [showFooterLinksData, setShowFooterLinksData] = useState(false);
  const [showPreviousLinksData, setShowPreviousLinksData] = useState(false);
  const [isContactUsSectionVisible, setIsContactUsSectionVisible] = useState(false);
  const [isCopyRightSectionVisible, setIsCopyRightSectionVisible] = useState(false);
  const [addeGRADTutorContent, setAddeGRADTutorContent] = useState(false);
  const [addContactUsContent, setAddContactUsContent] = useState(false);
  const themeFromContext = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/Footer/landingfooterContentDataOne`)
      .then((res) => {
        setDataOne(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data from landing_page_one:", error);
      });
  }, []);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Footer/landingfooterContentDataTwo`
        );
        setDataTwo(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_page_two:", error);
      }
    };

    fetchFooterData();
  }, []);

  useEffect(() => {
    const fetchFooterCopyWriteData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Footer/landingfooterContentDataThree`
        );
        setDataThree(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_copyright:", error);
      }
    };

    fetchFooterCopyWriteData();
  }, []);

  useEffect(() => {
    fetchFooterLinks();
  }, []);

  const fetchFooterLinks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Footer/footerLinks`);
      setFooterLinkData(response.data);
    } catch (error) {
      console.error("Error fetching footer links:", error);
    }
  };

  useEffect(() => {
    const fetchFooterCopyWriteData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/FooterPage/landingfooterContentDataThree`
        );
        setDataThree(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_copyright:", error);
      }
    };

    fetchFooterCopyWriteData();
  }, []);

  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")


  return (
    <div className={`Footer_Main_Container ${themeDetails.themeFooterMainContainer}`}>
      <div className={`Footer_Sub_Container ${themeDetails.themeFooterSubContainer}`}>

        <div className={`Footer_Content_Main_Container ${themeDetails.themeFooterContentMainContainer}`}>

          <div className={`Footer_FirstContent__Container ${themeDetails.themeFooterFirstContentContainer}`}>

            <div className={`Footer_eGRADTtutor__Content ${themeDetails.themeFootereGRADTtutoContent}`}>
              <button onClick={() => setAddeGRADTutorContent(!addeGRADTutorContent)}>
                {addeGRADTutorContent ? 'Hide eGRADTtor Form' : 'Add GRADTtorData'}
              </button>
              {addeGRADTutorContent && <FooterEdit type="Add eGRADTutor" />}

              <button onClick={() => setFirstPopupVisible(!FirstPopupVisible)}>
                {FirstPopupVisible ? 'Hide eGRADTtor Form' : 'EditeGRADTtorData'}
              </button>
              {FirstPopupVisible && <FooterEdit type="eGRADTutor" />}

              {dataOne.map((item, index) =>
                index === 0 ? (
                  <div key={item.Content_id} className={`Footer_FirstContent ${themeDetails.themeFooterFirstContent}`}>
                    <h2 id="Footer_Heading">
                      {item.content}
                    </h2>
                  </div>
                ) : (
                  <p
                    className="new_landingfooter_conatinerfristpart_item"
                    key={item.Content_id}
                  >
                    {item.content}
                  </p>
                )
              )}
            </div>
            <div className={`Footer_Links_Content ${themeDetails.themeFooterLinksContent}`}>
              <button onClick={() => setShowFooterLinksData(!showFooterLinksData)}>
                {showFooterLinksData ? 'Hide Add Link' : 'Add Link'}
              </button>
              {showFooterLinksData && <FooterEdit type="Add_Footer_Links" />}

              <button onClick={() => setShowPreviousLinksData(!showPreviousLinksData)}>
                {showPreviousLinksData ? 'Hide Edit Links' : 'Edit Links'}
              </button>
              {showPreviousLinksData && <FooterEdit type="Update_Footer_Links" />}
              <ul>
              {footerLinkData.map((item) => (
                
                <li key={item.Link_Id}>
                  <Link to={item.Link_Routing_Data}>{item.Link_Item}</Link>
                </li>
              ))}
              </ul>
            </div>
          </div>
          <div className={`Footer_Contact_Us_Content ${themeDetails.themeFooterContactUsContent}`}>
            <button onClick={() => setAddContactUsContent(!addContactUsContent)} className="editbtn">

              {addContactUsContent ? 'Hide ContactUs' : 'Add ContactUs Data'}
            </button>
            {addContactUsContent && <FooterEdit type="Add ContactUs" />}

            <button onClick={() => setIsContactUsSectionVisible(!isContactUsSectionVisible)} className="editbtn">

              {isContactUsSectionVisible ? 'Hide ContactUs' : 'Edit ContactUs Data'}
            </button>
            {isContactUsSectionVisible && <FooterEdit type="ContactUs" />}
            {dataTwo.map((item, index) =>
              index === 0 ? (
                <div key={item.Content_id} className={`Footer_ContactData ${themeDetails.themeFooterContactData}`}>
                  <h2 className="new_landingfooter_conatinersecondpart_item">
                    {item.content_name}
                  </h2>
                </div>
              ) : (
                <p
                  className="new_landingfooter_conatinersecondpart_item"
                  key={item.Content_id}
                >
                  {item.content_name}
                </p>
              )
            )}
          </div>

        </div>

        <div className={`Footer_Copywrite_Content_Container ${themeDetails.themeFooterCopywriteContentContainer}`}>
          <button onClick={() => setIsCopyRightSectionVisible(!isCopyRightSectionVisible)} className="editbtn">
            {isCopyRightSectionVisible ? 'Hide copywrite form' : 'Edit copywrite'}
          </button>
          {isCopyRightSectionVisible && <FooterEdit type="CopyWriteTable" />}
          {dataThree.map((item) => (
            <li key={item.Content_id}>{item.content_name}</li>
          ))}
        </div>



      </div>
    </div>
  )
}
export default Footer;