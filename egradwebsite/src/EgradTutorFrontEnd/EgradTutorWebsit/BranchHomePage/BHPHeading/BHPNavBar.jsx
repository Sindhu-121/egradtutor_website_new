import React, { useContext, useEffect, useState } from 'react';
import BHPNavBarEdit from "./BHPNavBarEdit";
import axios from 'axios';
import BASE_URL from '../../../../apiConfig';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import '../BranchHomeStyles/BranchHomePages.css';
import Marquee from "react-fast-marquee";
import { Link as ScrollLink } from 'react-scroll';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowDropright } from "react-icons/io";

const BHPNavBar = ({ isEditMode }) => {
  const [navItems, setNavItems] = useState([]);
  const [marqueeItems, setMarqueeItems] = useState([]);
  const navigate = useNavigate();
  const [showMarqueeData, setShowMarqueeData] = useState(false);
  const [branches, setBranches] = useState([]);


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

  const fetchAllBranches = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/BHPNavBar/branches`);
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const themeFromContext = useContext(ThemeContext);
  const refreshChannel = new BroadcastChannel("refresh_channel");
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload();
    }
  };
  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];

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
    fetchMarqueeItems();
  }, []);

  const renderNavItem = (navItem) => {
    // Check if the link should scroll or redirect
    const isInternalLink = navItem.navItemlink.startsWith('Explore') || navItem.navItemlink.startsWith('Our');

    if (isInternalLink) {
      // Internal link for scrolling
      return (
        <ScrollLink to={navItem.navItemlink} smooth={true} duration={100}>
          {navItem.Nav_Item}
        </ScrollLink>
      );
    } else {
      // External link for navigation
      return (
        <span onClick={() => navigate(navItem.navItemlink)}>
          {navItem.Nav_Item}
        </span>
      );
    }
  };
  const [showAddNavItems, setShowAddNavItems] = useState(false);
  const [showEditNavItems, setShowEditNavItems] = useState(false);
  return (
    <div>
      <div className={`ug_header ${themeDetails.themeUgHeader}`}>
        <div className={`ug_container ${themeDetails.themeUgHContainer}`}>
          <div className={`navItemsContainer ${themeDetails.themeUgNavContainer}`}>
            <ul className={`${themeDetails.themeUgHeaderUl}`}>
              {navItems.map((navItem) => (
                <li key={navItem.id} className={`${themeDetails.themeUgHeaderLi}`}>
                  {renderNavItem(navItem)}
                </li>
              ))}
            </ul>
          </div>
          {isEditMode && (
            <div>
              <button onClick={() => setShowAddNavItems(!showAddNavItems)}>
                {showAddNavItems ? "Close Form" : "Add/Edit NavItems"}
              </button>
              {showAddNavItems && <BHPNavBarEdit type="Add NavItems" />}
              
            </div>
          )}




        </div>
      </div>
      <div className={`marquee_data ${themeDetails.themeMarqData}`}>
        <Marquee behavior="scroll" direction="left" scrollamount="5" scrolldelay="10" loop="infinite" pauseOnHover>
          {marqueeItems.map((item) => (
            <>
              {themeColor === 'Theme-2' ?
                <>
                  <IoMdArrowDropright style={{ fontSize: "30px", margin: 0 }} />
                  <span style={{ color: 'red', fontWeight: 500 }} key={item.Marquee_Id}>{item.Marquee_data}</span>
                </>
                :
                <span key={item.Marquee_Id}>{item.Marquee_data}</span>}
            </>
          ))}
        </Marquee>

      </div>

      {isEditMode && (

        <div>
          <button onClick={() => setShowMarqueeData(!showMarqueeData)}>
            {showMarqueeData ? 'Close' : 'Update Marquee Data'}
          </button>
          {showMarqueeData && <BHPNavBarEdit type="Update_Marquee_tag" />}
        </div>
      )}
      {isEditMode && (
        <div>
          <BHPNavBarEdit />
        </div>
      )}

    </div>
  );
}

export default BHPNavBar;
