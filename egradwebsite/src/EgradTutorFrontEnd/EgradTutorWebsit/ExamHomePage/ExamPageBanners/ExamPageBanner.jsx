import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import ExamPageBannerEdit from './ExamPageBannerEdit'
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
const ExamPageBanner = () => {
  const { EntranceExams_Id } = useParams();
  const [banners, setBanners] = useState([]);

  const [message, setMessage] = useState(false);
  const [showBannerEdit, setShowBannerEdit] = useState(false);
  const [startBannerIndex, setStartBannerIndex] = useState(0);

  const handleAddBannerClick = () => {
    setShowBannerEdit(prevShowBannerEdit => !prevShowBannerEdit);
  };


  useEffect(() => {
    fetchBanners(EntranceExams_Id);
  }, []);

  const fetchBanners = async (EntranceExams_Id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/Webbanners/fetchbanners/${EntranceExams_Id}`
      );
      setBanners(response.data);
    } catch (error) {
      setMessage("Error fetching banners");
      console.error("Error fetching banners:", error);
    }
  };

  return (
    <div>  
        <button className="add-clicked" onClick={handleAddBannerClick}>
    {showBannerEdit ? 'Close Banner' : 'Add Banner'}
  </button>
  {showBannerEdit && <ExamPageBannerEdit type="addBanner" />}
       <Carousel
            autoPlay
            infiniteLoop
            showArrows={false}
            interval={4600}
            showThumbs={false}
            // showIndicators={false}
            showStatus={false}
          >
            {banners
              .filter((banner) => banner.banner_status === "active") // Filter banners by status
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
              .slice(startBannerIndex, startBannerIndex + 4)
              .map((banner) => (
                <div key={banner.EntranceExams_Id}>
                  <img
                    src={`data:image/svg+xml;base64,${banner.banner}`}
                    alt={`Banner ${banner.EntranceExams_Id}`}
                    style={{
                      width: "120rem",
                      height: "30rem",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
          </Carousel>
      
    </div>
  )
}

export default ExamPageBanner