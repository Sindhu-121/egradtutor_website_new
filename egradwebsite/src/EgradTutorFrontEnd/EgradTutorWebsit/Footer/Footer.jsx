import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import { Link, useParams } from "react-router-dom";

const Footer = () => {
  const [dataOne, setDataOne] = useState([]);
  const [dataTwo, setDataTwo] = useState([]);
  const [dataThree, setDataThree] = useState([]);
  const [footerLinkData, setFooterLinkData] = useState([]);

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

  return (
    <div>
      <div>
        {dataOne.map((item, index) =>
          // Render <h3> tag for the first item, and <p> tags for the rest
          index === 0 ? (
            <div key={item.Content_id}>
              <h2 className="new_landingfooter_conatinerfristpart_item">
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

      <div>
        <ul>
          {footerLinkData.map((item) => (
            <li key={item.Link_Id}>
              <Link to={item.Link_Routing_Data}>{item.Link_Item}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {dataTwo.map((item, index) =>
          index === 0 ? (
            <div key={item.Content_id}>
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

      <div>
        {dataThree.map((item) => (
          <li key={item.Content_id}>{item.content_name}</li>
        ))}
      </div>
    </div>
  )
}
export default Footer;