import React, { useContext, useEffect, useState } from 'react'
import BHPNavBarEdit from "./BHPNavBarEdit"
import axios from 'axios';
import BASE_URL from '../../../../apiConfig';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import '../BranchHomeStyles/BranchHomePages.css'
import Marquee from "react-fast-marquee";


const BHPNavBar = () => {
  const [navItems, setNavItems] = useState([]);
  const [marqueeItems, setMarqueeItems] = useState([]);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/BHPNavBar/homepageNavItems`
        );
        if (response.data.status === "Success") {
          setNavItems(response.data.navItems);
          console.log("Nav items:", response.data.navItems);
        } else {
          console.error("Failed to fetch nav items");
        }
      } catch (error) {
        console.error("Error fetching nav items:", error);
      }
    };

    fetchNavItems();
  }, []);

  const themeFromContext = useContext(ThemeContext);
  const refreshChannel = new BroadcastChannel("refresh_channel");
  // Listen for messages from other pages
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload(); // Reload the page
    }
  };
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
  const fetchMarqueeItems = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/BHPNavBar/homepage_marqueedisply/1`
      );
      setMarqueeItems(response.data);
    } catch (error) {
      console.error("Error fetching marquee items:", error);
    }
  };
  useEffect(() => {
    // fetchBranchData();
    fetchMarqueeItems();
    // fetchAllBranches();
  }, []);
  return (
    <div>
      {/* home,contactus navbar(second navbar) */}
      <div className={`ug_header ${themeDetails.themeUgHeader}`}>
        <div className={`ug_container ${themeDetails.themeUgHContainer}`}>
          <div className={`navItemsContainer ${themeDetails.themeUgNavContainer}`}>
            <ul className={`${themeDetails.themeUgHeaderUl}`}>
              {navItems.map((navItem) => (
                <li key={navItem.id} className={`${themeDetails.themeUgHeaderLi}`}>{navItem.Nav_Item}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>
      <div className={`marquee_data ${themeDetails.themeMarqData}`}>
          <Marquee  behavior="scroll" direction="left" scrollamount="5" scrolldelay="10" loop="infinite" pauseOnHover
          >
            {marqueeItems.map((item) => (
              <span key={item.Marquee_Id}>{item.Marquee_data}</span>
            ))}
          </Marquee>
        </div>
      <BHPNavBarEdit />
    </div>
  )
}

export default BHPNavBar