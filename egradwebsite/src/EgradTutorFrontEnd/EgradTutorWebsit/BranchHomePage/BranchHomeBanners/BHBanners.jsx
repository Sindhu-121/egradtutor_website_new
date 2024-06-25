// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import BASE_URL from "../../../../apiConfig";
// import axios from "axios";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { FaRegPenToSquare } from "react-icons/fa6";
// import { IoMdClose } from "react-icons/io";
// import { MdClose } from "react-icons/md";
// import { Link } from "react-router-dom";
// import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
// import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";


// const BHBanners = () => {
//   const [banners, setBanners] = useState([]);
//   const { Branch_Id, EntranceExams_Id } = useParams();
//   const [selectedBannerId, setSelectedBannerId] = useState(null);
//   const [bannerEditMode, setBannerEditMode] = useState(false);
//   const [selectedBanner, setSelectedBanner] = useState(null);
//   const [bannerOrder, setBannerOrder] = useState(banners.display_order || "");
//   const [updatedBanners, setUpdatedBanners] = useState(banners);
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [isPopupUploadBanner, setIsPopupUploadBanner] = useState(false);
//   const [message, setMessage] = useState(false);
//   const [svgContent, setSVGContent] = useState("");
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
//   const [textSize, setTextSize] = useState(16);
//   const [startBannerIndex, setStartBannerIndex] = useState(0);
//   const svgRef = useRef(null);

//   // Function to toggle the popup visibility
//   const toggleBannerPopup = () => {
//     setIsPopupVisible(!isPopupVisible);
//     setIsPopupUploadBanner(false);
//   };

//   const toggleEditMode = () => {
//     setEditMode(!editMode);
//     setSelectedElement(null);
//   };
//   const toggleEditBannerPopup = () => {
//     setIsPopupVisible(true);
//     setBannerEditMode(false);
//   };
//   // Function to toggle the popup visibility
//   const handleUploadBanner = () => {
//     setIsPopupUploadBanner(true);
//     setIsPopupVisible(false);
//   };

//   const handleCloseUploadFile = () => {
//     setIsPopupVisible(true);
//     setIsPopupUploadBanner(false);
//   };

//   const handleOkButtonClick = () => {
//     setIsPopupVisible(true);
//     setMessage(false);
//     setIsPopupUploadBanner(false);
//   };
//   const handleOrderInputChange = (e) => {
//     setBannerOrder(e.target.value);
//   };

//   const handleOrderUpdate = async (
//     EntranceExams_Id,
//     banner_Id,
//     bannerOrder
//   ) => {
//     console.log(EntranceExams_Id, banner_Id, bannerOrder);

//     try {
//       // Send a PUT request to update the display order in the database

//       await axios.put(
//         `${BASE_URL}/Webbanners/updateBannerOrder/${EntranceExams_Id}/${banner_Id}`,
//         {
//           display_order: bannerOrder,
//         }
//       );

//       alert("Display order updated successfully");
//     } catch (error) {
//       console.error("Error updating display order:", error);

//       // alert('Failed to update display order');
//     }
//   };

//   const handleEnableDisable = (bannerId, entranceExamId, action) => {
//     // Perform API call to update database

//     const updatedBannerStatus = action === "enable" ? "active" : "inactive";

//     // Assuming you're using fetch API or axios for HTTP requests

//     fetch(`${BASE_URL}/Webbanners/updateBannerStatus`, {
//       method: "PUT",

//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         bannerId,

//         entranceExamId,

//         bannerStatus: updatedBannerStatus,
//       }),
//     })
//       .then((response) => response.json())

//       .then((data) => {
//         // Update the local state if the database update was successful

//         if (data.success) {
//           const updatedBannersCopy = [...updatedBanners];

//           const index = updatedBannersCopy.findIndex(
//             (banner) =>
//               banner.banner_Id === bannerId &&
//               banner.EntranceExams_Id === entranceExamId
//           );

//           if (index !== -1) {
//             updatedBannersCopy[index].banner_status = updatedBannerStatus;

//             setUpdatedBanners(updatedBannersCopy);
//           }
//         }
//       })

//       .catch((error) => console.error("Error updating banner status:", error));
//   };

//   useEffect(() => {
//     fetchBanners(Branch_Id);
//   }, []);

//   const fetchBanners = async (Branch_Id) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/Webbanners/fetchingbanners/${Branch_Id}`
//       );
//       setBanners(response.data);
//     } catch (error) {
//       setMessage("Error fetching banners");
//       console.error("Error fetching banners:", error);
//     }
//   };

//   const handleElementClick = (event) => {
//     let target = event.target;
//     console.log("Element clicked:", target.tagName);

//     if (target.tagName === "tspan" && target.parentElement.tagName === "text") {
//       target = target.parentElement;
//     }

//     if (editMode && (target.tagName === "text" || target.tagName === "image")) {
//       setSelectedElement(target);
//       if (target.tagName === "image") {
//         setImageSize({
//           width: parseFloat(target.getAttribute("width")),
//           height: parseFloat(target.getAttribute("height")),
//         });
//         console.log("Image element selected:", target);
//       } else if (target.tagName === "text") {
//         const fontSize = parseFloat(target.getAttribute("font-size")) || 16;
//         setTextSize(fontSize);
//         console.log("Text element selected:", target);
//       }
//     }
//   };

//   const handleImageReplace = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       if (selectedElement) {
//         selectedElement.setAttribute("xlink:href", e.target.result);
//       }
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleTextSizeChange = (event) => {
//     const newSize = parseFloat(event.target.value);
//     console.log("New text size:", newSize);
//     setTextSize(newSize);
//     let targetElement = selectedElement;
//     if (selectedElement.tagName === "tspan") {
//       targetElement = selectedElement.parentElement;
//     }
//     console.log("Target element:", targetElement);
//     if (targetElement) {
//       targetElement.style.fontSize = `${newSize}px`;
//       targetElement.setAttribute("font-size", newSize);
//       console.log("Font size attribute set to:", newSize);
//       console.log("Target element after setting font size:", targetElement);
//     }
//   };

//   const handleSave = async () => {
//     if (!selectedBannerId || !Branch_Id) {
//       setMessage("Please select a banner or poster to edit.");
//       return;
//     }

//     const svgElement = svgRef.current.querySelector("svg");
//     const updatedSVG = new XMLSerializer().serializeToString(svgElement);
//     const updatedSVGBase64 = btoa(updatedSVG);

//     try {
//       const response = await axios.put(
//         `${BASE_URL}/Webbanners/updatebanner/${selectedBannerId}/${Branch_Id}`,
//         {
//           banner: updatedSVGBase64,
//         }
//       );

//       // Ensure the backend responds with a success status
//       if (response.status === 200) {
//         setMessage("Banner updated successfully");
//         // Fetch updated banners after successful update
//         fetchBanners(Branch_Id);
//       } else {
//         setMessage("Error updating banner");
//         console.error("Error updating banner: Unexpected response from server");
//       }
//     } catch (error) {
//       setMessage("Error updating banner");
//       console.error("Error updating banner:", error);
//     }
//   };

//   const handleMouseDown = (event) => {
//     if (selectedElement && selectedElement.tagName === "image") {
//       const startX = event.clientX;
//       const startY = event.clientY;
//       const startWidth = parseFloat(selectedElement.getAttribute("width"));
//       const startHeight = parseFloat(selectedElement.getAttribute("height"));

//       const onMouseMove = (moveEvent) => {
//         const newWidth = startWidth + (moveEvent.clientX - startX);
//         const newHeight = startHeight + (moveEvent.clientY - startY);
//         setImageSize({ width: newWidth, height: newHeight });
//         selectedElement.setAttribute("width", newWidth);
//         selectedElement.setAttribute("height", newHeight);
//       };

//       const onMouseUp = () => {
//         document.removeEventListener("mousemove", onMouseMove);
//         document.removeEventListener("mouseup", onMouseUp);
//       };

//       document.addEventListener("mousemove", onMouseMove);
//       document.addEventListener("mouseup", onMouseUp);
//     }
//   };

//   const renderControls = () => {
//     if (!editMode || !selectedElement) return null;

//     const rect = selectedElement.getBoundingClientRect();
//     return (
//       <div
//         className="controls"
//         style={{
//           //   margin: "2rem",
//           top: "3rem",
//           width: "23rem",
//           position: "relative",
//           left: "16rem",
//           backgroundColor: "rgba(255, 255, 255, 0.8)",
//           border: "1px solid #ccc",
//           padding: "5px",
//           borderRadius: "5px",
//           //   zIndex: 1000,
//           textalign: "center",
//         }}
//       >
//         {selectedElement.tagName === "image" ? (
//           <div>
//             <p>Replace image:</p>
//             <input type="file" accept="image/*" onChange={handleImageReplace} />
//           </div>
//         ) : (
//           <div>
//             <p>Adjust text size:</p>
//             <input
//               type="number"
//               value={textSize}
//               onChange={handleTextSizeChange}
//               style={{
//                 padding: "5px",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//               }}
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   useEffect(() => {
//     if (selectedElement && selectedElement.tagName === "image") {
//       selectedElement.setAttribute("width", imageSize.width);
//       selectedElement.setAttribute("height", imageSize.height);
//     } else if (selectedElement && selectedElement.tagName === "text") {
//       selectedElement.setAttribute("font-size", textSize);
//     }
//   }, [imageSize, textSize, selectedElement]);

//   const handleBannerClick = (bannerContent, bannerId) => {
//     setSVGContent(atob(bannerContent));
//     setSelectedBannerId(bannerId);
//     setEditMode(false);
//     if (svgRef.current) {
//       svgRef.current.classList.add("selected-banner");
//     }
//   };

//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

//   const handleLeftButtonClick = () => {
//     setCurrentBannerIndex((prevIndex) =>
//       prevIndex > 0 ? prevIndex - 1 : banners.length - 1
//     );
//   };

//   const handleRightButtonClick = () => {
//     setCurrentBannerIndex((prevIndex) =>
//       prevIndex < banners.length - 1 ? prevIndex + 1 : 0
//     );
//   };

//   const [file, setFile] = useState(null);
//   //   const [message, setMessage] = useState("");
//   const [designs, setDesigns] = useState([]);
//   const [selectedDesignId, setSelectedDesignId] = useState("");

//   useEffect(() => {
//     fetchDesigns();
//   }, []);

//   const fetchDesigns = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/Webbanners/webdesigns`);
//       setDesigns(response.data);
//     } catch (error) {
//       setMessage("Error fetching designs");
//       console.error("Error fetching designs:", error);
//     }
//   };

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleDesignChange = (event) => {
//     setSelectedDesignId(event.target.value);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a file to upload.");
//       return;
//     }

//     if (!selectedDesignId) {
//       setMessage("Please select a design.");
//       return;
//     }

//     if (!Branch_Id && !EntranceExams_Id) {
//       setMessage("Please select either an entrance exam or a branch.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("banner", file);
//     formData.append("designId", selectedDesignId);

//     // Append either EntranceExams_Id or Branch_Id, or set them to 0 if not provided
//     formData.append("EntranceExams_Id", EntranceExams_Id || 0);
//     formData.append("Branch_Id", Branch_Id || 0);

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/Webbanners/uploadbanner`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setMessage(response.data.message || "Banner uploaded successfully!");
//     } catch (error) {
//       const errorMessage =
//         error.response && error.response.data && error.response.data.message
//           ? error.response.data.message
//           : "Error uploading banner";
//       setMessage(errorMessage);
//       console.error("Error uploading banner:", error);
//     }
//   };

//   const [visibleSection, setVisibleSection] = useState(null);

//   const toggleVisibility = (section) => {
//     setVisibleSection(visibleSection === section ? null : section);
//   };

//   const getIcon = (section) => {
//     return visibleSection === section ? "-" : "+";
//   };

//   const handleEditButtonClick = (banner) => {
//     console.log("Jimin");

//     setSelectedBanner(banner);

//     setBannerEditMode(true);

//     setIsPopupVisible(false);
//   };

//   return (
//     <div>
//       <div className="banner_section">
//         <div>
//           <button onClick={toggleBannerPopup}>Edit</button>

//           {/*--------------- Displaying_banners_start---------------- */}
//           <Carousel
//             autoPlay
//             infiniteLoop
//             showArrows={false}
//             interval={4600}
//             showThumbs={false}
//             // showIndicators={false}
//             showStatus={false}
//           >
//             {banners
//               .filter((banner) => banner.banner_status === "active") // Filter banners by status
//               .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
//               .slice(startBannerIndex, startBannerIndex + 4)
//               .map((banner) => (
//                 <div key={banner.EntranceExams_Id}>
//                   <img
//                     src={`data:image/svg+xml;base64,${banner.banner}`}
//                     alt={`Banner ${banner.EntranceExams_Id}`}
//                     style={{
//                       width: "100%",
//                       height: "25rem",
//                       cursor: "pointer",
//                     }}
//                   />
//                 </div>
//               ))}
//           </Carousel>
//           {/*-------------- Displaying_banners_end-------------------- */}

//           {/*-------Parent_OnClick_EditIcon_Opens_banners_popup_edit_section_start--------*/}

//           {/*----------1st_popup_edit_banner_table_section_start------------------ */}
//           {isPopupVisible && (
//             <div className="banner_popup">
//               <div className="banner_popup_content">
//                 <span className="banner_close" onClick={toggleBannerPopup}>
//                   <IoMdClose />
//                 </span>
//                 <h1>Edit Banners</h1>
//                 <button onClick={handleUploadBanner}>Upload New banner</button>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Index</th>
//                       <th>Banner</th>
//                       <th>Edit</th>
//                       <th>Order</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {banners.map((banner, index) => (
//                       <tr key={index}>
//                         <td>{banner.banner_Id}</td>
//                         <td>
//                           <div
//                             onClick={() =>
//                               handleBannerClick(
//                                 banner.banner,
//                                 banner.banner_Id,
//                                 banner.EntranceExams_Id
//                               )
//                             }
//                           >
//                             <img
//                               src={`data:image/svg+xml;base64,${banner.banner}`}
//                               alt={`Banner ${banner.EntranceExams_Id}_${banner.banner_Id}`}
//                               style={{
//                                 width: "400px",
//                                 height: "200px",
//                                 cursor: "pointer",
//                               }}
//                             />
//                           </div>
//                         </td>

//                         <td>
//                           <button
//                             className="add-clicked"
//                             onClick={() => handleEditButtonClick(banner)} // Pass banner object to identify which banner is being edited
//                           >
//                             <FaRegPenToSquare />
//                           </button>
//                         </td>

//                         <td>
//                           <div>
//                             <input
//                               type="number"
//                               name="bannerorder"
//                               defaultValue={banner.display_order}
//                               onChange={handleOrderInputChange}
//                               style={{ width: "60px" }}
//                             />

//                             <button
//                               onClick={() =>
//                                 handleOrderUpdate(
//                                   banner.EntranceExams_Id,
//                                   banner.banner_Id,
//                                   bannerOrder
//                                 )
//                               }
//                             >
//                               Save
//                             </button>
//                           </div>
//                         </td>

//                         <td>
//                           <button
//                             style={{
//                               backgroundColor:
//                                 banner.banner_status === "active"
//                                   ? "green"
//                                   : "red",
//                               color: "white",
//                             }}
//                             onClick={() =>
//                               handleEnableDisable(
//                                 banner.banner_Id,
//                                 banner.EntranceExams_Id,
//                                 banner.banner_status === "active"
//                                   ? "disable"
//                                   : "enable"
//                               )
//                             }
//                           >
//                             {banner.banner_status === "active"
//                               ? "Disable"
//                               : "Enable"}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//           {/* -------------popup_edit_banner_table_section_end--------------------- */}

//           {/* ----OnClick_EditIconOf_Specific_banner_opens_2nd_popup_editMode_section_start-----*/}
//           {bannerEditMode && selectedBanner && (
//             <div className="popup-overlay">
//               <span className="banner_close" onClick={toggleEditBannerPopup}>
//                 <IoMdClose />
//               </span>
//               <div className="BannerEditor">
//                 {renderControls()}

//                 <button
//                   onClick={toggleEditMode}
//                   style={{
//                     padding: "10px 20px",

//                     backgroundColor: "#007bff",

//                     color: "#fff",

//                     border: "none",

//                     borderRadius: "5px",

//                     zIndex: 1000,
//                   }}
//                 >
//                   {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
//                 </button>

//                 <button
//                   onClick={handleSave}
//                   style={{
//                     padding: "10px",

//                     backgroundColor: "#28a745",

//                     color: "#fff",

//                     border: "none",

//                     borderRadius: "5px",

//                     marginLeft: "10px",
//                   }}
//                 >
//                   Save
//                 </button>

//                 <div
//                   id="img_editor_container"
//                   ref={svgRef}
//                   className="img-container"
//                   dangerouslySetInnerHTML={{ __html: svgContent }}
//                   onClick={handleElementClick}
//                   contentEditable={editMode}
//                   onMouseDown={handleMouseDown}
//                 />

//                 <div
//                   style={{
//                     display: "flex",

//                     flexWrap: "wrap",

//                     marginLeft: "26rem",
//                   }}
//                 >
//                   <button
//                     onClick={handleLeftButtonClick}
//                     style={{ background: "none", border: "none" }}
//                   >
//                     {" "}
//                     <FaArrowLeft
//                       id="left_right_icon"
//                       style={{ fontSize: "24px" }}
//                     />
//                   </button>

//                   {banners.length > 0 && (
//                     <div
//                       key={`${banners[currentBannerIndex].EntranceExams_Id}_${banners[currentBannerIndex].banner_Id}`}
//                       onClick={() =>
//                         handleBannerClick(
//                           banners[currentBannerIndex].banner,

//                           banners[currentBannerIndex].banner_Id,

//                           banners[currentBannerIndex].EntranceExams_Id
//                         )
//                       }
//                     >
//                       <img
//                         src={`data:image/svg+xml;base64,${banners[currentBannerIndex].banner}`}
//                         alt={`Banner ${banners[currentBannerIndex].EntranceExams_Id}_${banners[currentBannerIndex].banner_Id}`}
//                         style={{
//                           width: "500px",

//                           height: "300px",

//                           cursor: "pointer",
//                         }}
//                       />
//                     </div>
//                   )}

//                   <button
//                     onClick={handleRightButtonClick}
//                     style={{ background: "none", border: "none" }}
//                   >
//                     {" "}
//                     <FaArrowRight
//                       id="left_right_icon"
//                       style={{ fontSize: "24px" }}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {/* ----OnClick_EditIconOf_Specific_banner_opens_popup_editMode_section_end-----*/}

//           {/* ---------alert_messages_popup_start--------- */}
//           {message && (
//             <div className="banner_popup">
//               <div
//                 className={`banner_popup_message ${
//                   message.startsWith("Error") ? "error" : "success"
//                 }`}
//               >
//                 <p>{message}</p>
//                 <button onClick={handleOkButtonClick}>OK</button>
//               </div>
//             </div>
//           )}
//           {/* ---------alert_messages_popup_end--------- */}

//           {/* --------To_upload_new_banner_3rd_popup_upload_section_start------------ */}
//           {isPopupUploadBanner && (
//             <div className="banner_popup">
//               <span className="banner_close" onClick={toggleBannerPopup}>
//                 &times;
//               </span>
//               <div className="banner_Upload_popup_content">
//                 <h3>Upload SVG Banner</h3>
//                 <label htmlFor="Course">Design: </label>
//                 <select value={selectedDesignId} onChange={handleDesignChange}>
//                   <option value="">Select Design</option>
//                   {designs.map((design) => (
//                     <option key={design.design_Id} value={design.design_Id}>
//                       {design.design}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type="file"
//                   accept="image/svg+xml"
//                   onChange={handleFileChange}
//                 />
//                 <div className="upload_showFile_btns">
//                   <button onClick={handleUpload}>Upload</button>
//                   <button onClick={handleCloseUploadFile}>
//                     Show Uploaded files
//                   </button>
//                 </div>
//                 {message && (
//                   <div className="banner_popup">
//                     <div
//                       className={`banner_popup_message ${
//                         message.startsWith("Error") ? "error" : "success"
//                       }`}
//                     >
//                       <p>{message}</p>
//                       <button onClick={handleOkButtonClick}>OK</button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* --------To_upload_new_banner_popup upload_section_end------------ */}

//           {/*-------End_Parent_OnClick_EditIcon_Opens_banners_popup_edit_section_end--------- */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BHBanners;
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
const BHBanners = () => {
  const [banners, setBanners] = useState([]);
  const { Branch_Id, EntranceExams_Id } = useParams();
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [bannerEditMode, setBannerEditMode] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerOrder, setBannerOrder] = useState(banners.display_order || "");
  const [updatedBanners, setUpdatedBanners] = useState(banners);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupUploadBanner, setIsPopupUploadBanner] = useState(false);
  const [message, setMessage] = useState(false);
  const [svgContent, setSVGContent] = useState("");
  const [selectedElement, setSelectedElement] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
  const [textSize, setTextSize] = useState(16);
  const [startBannerIndex, setStartBannerIndex] = useState(0);
  const svgRef = useRef(null);
 
  // Function to toggle the popup visibility
  const toggleBannerPopup = () => {
    setIsPopupVisible(!isPopupVisible);
    setIsPopupUploadBanner(false);
  };
 
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedElement(null);
  };
  const toggleEditBannerPopup = () => {
    setIsPopupVisible(true);
    setBannerEditMode(false);
  };
  // Function to toggle the popup visibility
  const handleUploadBanner = () => {
    setIsPopupUploadBanner(true);
    setIsPopupVisible(false);
  };
 
  const handleCloseUploadFile = () => {
    setIsPopupVisible(true);
    setIsPopupUploadBanner(false);
  };
 
  const handleOkButtonClick = () => {
    setIsPopupVisible(true);
    setMessage(false);
    setIsPopupUploadBanner(false);
  };
  const handleOrderInputChange = (e) => {
    setBannerOrder(e.target.value);
  };
 
  const handleOrderUpdate = async (
    EntranceExams_Id,
    banner_Id,
    bannerOrder
  ) => {
    console.log(EntranceExams_Id, banner_Id, bannerOrder);
 
    try {
      // Send a PUT request to update the display order in the database
 
      await axios.put(
        `${BASE_URL}/Webbanners/updateBannerOrder/${EntranceExams_Id}/${banner_Id}`,
        {
          display_order: bannerOrder,
        }
      );
 
      alert("Display order updated successfully");
    } catch (error) {
      console.error("Error updating display order:", error);
 
      // alert('Failed to update display order');
    }
  };
 
  const handleEnableDisable = (bannerId, entranceExamId, action) => {
    // Perform API call to update database
 
    const updatedBannerStatus = action === "enable" ? "active" : "inactive";
 
    // Assuming you're using fetch API or axios for HTTP requests
 
    fetch(`${BASE_URL}/Webbanners/updateBannerStatus`, {
      method: "PUT",
 
      headers: {
        "Content-Type": "application/json",
      },
 
      body: JSON.stringify({
        bannerId,
 
        entranceExamId,
 
        bannerStatus: updatedBannerStatus,
      }),
    })
      .then((response) => response.json())
 
      .then((data) => {
        // Update the local state if the database update was successful
 
        if (data.success) {
          const updatedBannersCopy = [...updatedBanners];
 
          const index = updatedBannersCopy.findIndex(
            (banner) =>
              banner.banner_Id === bannerId &&
              banner.EntranceExams_Id === entranceExamId
          );
 
          if (index !== -1) {
            updatedBannersCopy[index].banner_status = updatedBannerStatus;
 
            setUpdatedBanners(updatedBannersCopy);
          }
        }
      })
 
      .catch((error) => console.error("Error updating banner status:", error));
  };
 
  useEffect(() => {
    fetchBanners(Branch_Id);
  }, []);
 
  const fetchBanners = async (Branch_Id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/Webbanners/fetchingbanners/${Branch_Id}`
      );
      setBanners(response.data);
    } catch (error) {
      setMessage("Error fetching banners");
      console.error("Error fetching banners:", error);
    }
  };
 
  const handleElementClick = (event) => {
    let target = event.target;
    console.log("Element clicked:", target.tagName);
 
    if (target.tagName === "tspan" && target.parentElement.tagName === "text") {
      target = target.parentElement;
    }
 
    if (editMode && (target.tagName === "text" || target.tagName === "image")) {
      setSelectedElement(target);
      if (target.tagName === "image") {
        setImageSize({
          width: parseFloat(target.getAttribute("width")),
          height: parseFloat(target.getAttribute("height")),
        });
        console.log("Image element selected:", target);
      } else if (target.tagName === "text") {
        const fontSize = parseFloat(target.getAttribute("font-size")) || 16;
        setTextSize(fontSize);
        console.log("Text element selected:", target);
      }
    }
  };
 
  const handleImageReplace = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
 
    reader.onload = (e) => {
      if (selectedElement) {
        selectedElement.setAttribute("xlink:href", e.target.result);
      }
    };
 
    reader.readAsDataURL(file);
  };
 
  const handleTextSizeChange = (event) => {
    const newSize = parseFloat(event.target.value);
    console.log("New text size:", newSize);
    setTextSize(newSize);
    let targetElement = selectedElement;
    if (selectedElement.tagName === "tspan") {
      targetElement = selectedElement.parentElement;
    }
    console.log("Target element:", targetElement);
    if (targetElement) {
      targetElement.style.fontSize = `${newSize}px`;
      targetElement.setAttribute("font-size", newSize);
      console.log("Font size attribute set to:", newSize);
      console.log("Target element after setting font size:", targetElement);
    }
  };
 
  const handleSave = async () => {
    if (!selectedBannerId || !Branch_Id) {
      setMessage("Please select a banner or poster to edit.");
      return;
    }
 
    const svgElement = svgRef.current.querySelector("svg");
    const updatedSVG = new XMLSerializer().serializeToString(svgElement);
    const updatedSVGBase64 = btoa(updatedSVG);
 
    try {
      const response = await axios.put(
        `${BASE_URL}/Webbanners/updatebanner/${selectedBannerId}/${Branch_Id}`,
        {
          banner: updatedSVGBase64,
        }
      );
 
      // Ensure the backend responds with a success status
      if (response.status === 200) {
        setMessage("Banner updated successfully");
        // Fetch updated banners after successful update
        fetchBanners(Branch_Id);
      } else {
        setMessage("Error updating banner");
        console.error("Error updating banner: Unexpected response from server");
      }
    } catch (error) {
      setMessage("Error updating banner");
      console.error("Error updating banner:", error);
    }
  };
 
  const handleMouseDown = (event) => {
    if (selectedElement && selectedElement.tagName === "image") {
      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = parseFloat(selectedElement.getAttribute("width"));
      const startHeight = parseFloat(selectedElement.getAttribute("height"));
 
      const onMouseMove = (moveEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        const newHeight = startHeight + (moveEvent.clientY - startY);
        setImageSize({ width: newWidth, height: newHeight });
        selectedElement.setAttribute("width", newWidth);
        selectedElement.setAttribute("height", newHeight);
      };
 
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
 
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };
 
  const renderControls = () => {
    if (!editMode || !selectedElement) return null;
 
    const rect = selectedElement.getBoundingClientRect();
    return (
      <div
        className="controls"
        style={{
          //   margin: "2rem",
          top: "3rem",
          width: "23rem",
          position: "relative",
          left: "16rem",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "5px",
          //   zIndex: 1000,
          textalign: "center",
        }}
      >
        {selectedElement.tagName === "image" ? (
          <div>
            <p>Replace image:</p>
            <input type="file" accept="image/*" onChange={handleImageReplace} />
          </div>
        ) : (
          <div>
            <p>Adjust text size:</p>
            <input
              type="number"
              value={textSize}
              onChange={handleTextSizeChange}
              style={{
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
        )}
      </div>
    );
  };
 
  useEffect(() => {
    if (selectedElement && selectedElement.tagName === "image") {
      selectedElement.setAttribute("width", imageSize.width);
      selectedElement.setAttribute("height", imageSize.height);
    } else if (selectedElement && selectedElement.tagName === "text") {
      selectedElement.setAttribute("font-size", textSize);
    }
  }, [imageSize, textSize, selectedElement]);
 
  const handleBannerClick = (bannerContent, bannerId) => {
    setSVGContent(atob(bannerContent));
    setSelectedBannerId(bannerId);
    setEditMode(false);
    if (svgRef.current) {
      svgRef.current.classList.add("selected-banner");
    }
  };
 
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
 
  const handleLeftButtonClick = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : banners.length - 1
    );
  };
 
  const handleRightButtonClick = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex < banners.length - 1 ? prevIndex + 1 : 0
    );
  };
 
  const [file, setFile] = useState(null);
  //   const [message, setMessage] = useState("");
  const [designs, setDesigns] = useState([]);
  const [selectedDesignId, setSelectedDesignId] = useState("");
 
  useEffect(() => {
    fetchDesigns();
  }, []);
 
  const fetchDesigns = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Webbanners/webdesigns`);
      setDesigns(response.data);
    } catch (error) {
      setMessage("Error fetching designs");
      console.error("Error fetching designs:", error);
    }
  };
 
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
 
  const handleDesignChange = (event) => {
    setSelectedDesignId(event.target.value);
  };
 
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
 
    if (!selectedDesignId) {
      setMessage("Please select a design.");
      return;
    }
 
    if (!Branch_Id && !EntranceExams_Id) {
      setMessage("Please select either an entrance exam or a branch.");
      return;
    }
 
    const formData = new FormData();
    formData.append("banner", file);
    formData.append("designId", selectedDesignId);
 
    // Append either EntranceExams_Id or Branch_Id, or set them to 0 if not provided
    formData.append("EntranceExams_Id", EntranceExams_Id || 0);
    formData.append("Branch_Id", Branch_Id || 0);
 
    try {
      const response = await axios.post(
        `${BASE_URL}/Webbanners/uploadbanner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message || "Banner uploaded successfully!");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Error uploading banner";
      setMessage(errorMessage);
      console.error("Error uploading banner:", error);
    }
  };
 
  const [visibleSection, setVisibleSection] = useState(null);
 
  const toggleVisibility = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };
 
  const getIcon = (section) => {
    return visibleSection === section ? "-" : "+";
  };
 
  const handleEditButtonClick = (banner) => {
    console.log("Jimin");
 
    setSelectedBanner(banner);
 
    setBannerEditMode(true);
 
    setIsPopupVisible(false);
  };

  return (
    <div>
      <div className="banner_section">
        <div>
          <button onClick={toggleBannerPopup}>Edit</button>
 
          {/*--------------- Displaying_banners_start---------------- */}
          <div className="carousel-container">
                <Carousel 
                    axis="vertical"
                    verticalSwipe='natural'
                    autoPlay
                    infiniteLoop
                    showArrows={false}
                    interval={4600}
                    showThumbs={false}
                    showStatus={false}
                    // dynamicHeight={true}
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
                                    style={{ width: '100%', objectFit: 'cover' }} // Ensure images fit the container
                                />
                            </div>
                        ))}
                </Carousel>
            </div>
          {/*-------------- Displaying_banners_end-------------------- */}
 
          {/*-------Parent_OnClick_EditIcon_Opens_banners_popup_edit_section_start--------*/}
 
          {/*----------1st_popup_edit_banner_table_section_start------------------ */}
          {isPopupVisible && (
            <div className="banner_popup">
              <div className="banner_popup_content">
                <span className="banner_close" onClick={toggleBannerPopup}>
                  <IoMdClose />
                </span>
                <h1>Edit Banners</h1>
                <button onClick={handleUploadBanner}>Upload New banner</button>
                <table>
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Banner</th>
                      <th>Edit</th>
                      <th>Order</th>
                      <th>Action</th>
                    </tr>
                  </thead>
 
                  <tbody>
                    {banners.map((banner, index) => (
                      <tr key={index}>
                        <td>{banner.banner_Id}</td>
                        <td>
                          <div
                            onClick={() =>
                              handleBannerClick(
                                banner.banner,
                                banner.banner_Id,
                                banner.EntranceExams_Id
                              )
                            }
                          >
                            <img
                              src={`data:image/svg+xml;base64,${banner.banner}`}
                              alt={`Banner ${banner.EntranceExams_Id}_${banner.banner_Id}`}
                              style={{
                                width: "400px",
                                height: "200px",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        </td>
 
                        <td>
                          <button
                            className="add-clicked"
                            onClick={() => handleEditButtonClick(banner)} // Pass banner object to identify which banner is being edited
                          >
                            <FaRegPenToSquare />
                          </button>
                        </td>
 
                        <td>
                          <div>
                            <input
                              type="number"
                              name="bannerorder"
                              defaultValue={banner.display_order}
                              onChange={handleOrderInputChange}
                              style={{ width: "60px" }}
                            />
 
                            <button
                              onClick={() =>
                                handleOrderUpdate(
                                  banner.EntranceExams_Id,
                                  banner.banner_Id,
                                  bannerOrder
                                )
                              }
                            >
                              Save
                            </button>
                          </div>
                        </td>
 
                        <td>
                          <button
                            style={{
                              backgroundColor:
                                banner.banner_status === "active"
                                  ? "green"
                                  : "red",
                              color: "white",
                            }}
                            onClick={() =>
                              handleEnableDisable(
                                banner.banner_Id,
                                banner.EntranceExams_Id,
                                banner.banner_status === "active"
                                  ? "disable"
                                  : "enable"
                              )
                            }
                          >
                            {banner.banner_status === "active"
                              ? "Disable"
                              : "Enable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* -------------popup_edit_banner_table_section_end--------------------- */}
 
          {/* ----OnClick_EditIconOf_Specific_banner_opens_2nd_popup_editMode_section_start-----*/}
          {bannerEditMode && selectedBanner && (
            <div className="popup-overlay">
              <span className="banner_close" onClick={toggleEditBannerPopup}>
                <IoMdClose />
              </span>
              <div className="BannerEditor">
                {renderControls()}
 
                <button
                  onClick={toggleEditMode}
                  style={{
                    padding: "10px 20px",
 
                    backgroundColor: "#007bff",
 
                    color: "#fff",
 
                    border: "none",
 
                    borderRadius: "5px",
 
                    zIndex: 1000,
                  }}
                >
                  {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
                </button>
 
                <button
                  onClick={handleSave}
                  style={{
                    padding: "10px",
 
                    backgroundColor: "#28a745",
 
                    color: "#fff",
 
                    border: "none",
 
                    borderRadius: "5px",
 
                    marginLeft: "10px",
                  }}
                >
                  Save
                </button>
 
                <div
                  id="img_editor_container"
                  ref={svgRef}
                  className="img-container"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  onClick={handleElementClick}
                  contentEditable={editMode}
                  onMouseDown={handleMouseDown}
                />
 
                <div
                  style={{
                    display: "flex",
 
                    flexWrap: "wrap",
 
                    marginLeft: "26rem",
                  }}
                >
                  <button
                    onClick={handleLeftButtonClick}
                    style={{ background: "none", border: "none" }}
                  >
                    {" "}
                    <FaArrowLeft
                      id="left_right_icon"
                      style={{ fontSize: "24px" }}
                    />
                  </button>
 
                  {banners.length > 0 && (
                    <div
                      key={`${banners[currentBannerIndex].EntranceExams_Id}_${banners[currentBannerIndex].banner_Id}`}
                      onClick={() =>
                        handleBannerClick(
                          banners[currentBannerIndex].banner,
 
                          banners[currentBannerIndex].banner_Id,
 
                          banners[currentBannerIndex].EntranceExams_Id
                        )
                      }
                    >
                      <img
                        src={`data:image/svg+xml;base64,${banners[currentBannerIndex].banner}`}
                        alt={`Banner ${banners[currentBannerIndex].EntranceExams_Id}_${banners[currentBannerIndex].banner_Id}`}
                        style={{
                          width: "500px",
 
                          height: "300px",
 
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}
 
                  <button
                    onClick={handleRightButtonClick}
                    style={{ background: "none", border: "none" }}
                  >
                    {" "}
                    <FaArrowRight
                      id="left_right_icon"
                      style={{ fontSize: "24px" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* ----OnClick_EditIconOf_Specific_banner_opens_popup_editMode_section_end-----*/}
 
          {/* ---------alert_messages_popup_start--------- */}
          {message && (
            <div className="banner_popup">
              <div
                className={`banner_popup_message ${
                  message.startsWith("Error") ? "error" : "success"
                }`}
              >
                <p>{message}</p>
                <button onClick={handleOkButtonClick}>OK</button>
              </div>
            </div>
          )}
          {/* ---------alert_messages_popup_end--------- */}
 
          {/* --------To_upload_new_banner_3rd_popup_upload_section_start------------ */}
          {isPopupUploadBanner && (
            <div className="banner_popup">
              <span className="banner_close" onClick={toggleBannerPopup}>
                &times;
              </span>
              <div className="banner_Upload_popup_content">
                <h3>Upload SVG Banner</h3>
                <label htmlFor="Course">Design: </label>
                <select value={selectedDesignId} onChange={handleDesignChange}>
                  <option value="">Select Design</option>
                  {designs.map((design) => (
                    <option key={design.design_Id} value={design.design_Id}>
                      {design.design}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/svg+xml"
                  onChange={handleFileChange}
                />
                <div className="upload_showFile_btns">
                  <button onClick={handleUpload}>Upload</button>
                  <button onClick={handleCloseUploadFile}>
                    Show Uploaded files
                  </button>
                </div>
                {message && (
                  <div className="banner_popup">
                    <div
                      className={`banner_popup_message ${
                        message.startsWith("Error") ? "error" : "success"
                      }`}
                    >
                      <p>{message}</p>
                      <button onClick={handleOkButtonClick}>OK</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
 
          {/* --------To_upload_new_banner_popup upload_section_end------------ */}
 
          {/*-------End_Parent_OnClick_EditIcon_Opens_banners_popup_edit_section_end--------- */}
        </div>
      </div>
    </div>
  );
};
 
export default BHBanners;
