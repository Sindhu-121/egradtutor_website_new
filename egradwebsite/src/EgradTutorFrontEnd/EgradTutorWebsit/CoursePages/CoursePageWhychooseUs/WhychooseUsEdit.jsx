import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { useParams } from "react-router-dom";
const WhychooseUsEdit = ({ type }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: "",
    image: null,
  });
  const [tabEditDetails, setTabEditDetails] = useState([]);
  const [courseTabButtonNames, setCourseTabButtonNames] = useState([]);
  // for editing the existing data
  const[isEditFlag,setIsEditFlag]=useState(false);
  const[editIdForTabs,setEditIdForTabs]=useState(false)
  const [courseTabTitlesData, setCourseTabTitlesData] = useState([]);
  const getCourseTabButtonNames = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courseTab/getCourseTabButtonDetails`)
      setCourseTabButtonNames(response.data);
      console.log(courseTabButtonNames)
    } catch (error) {
      console.log(error, "error while getting course tab names");
    }


  }

  const [WhyChooseUsitems, setWhyChooseUsItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tabsData, setTabsData] = useState({
    coursePortaleId: "",
    courseTabId: "",
    // courseTabTitle: "",
    courseTabDescription: "",
    courseTabImage: null

  })
  const [portales, setPortales] = useState([])
  useEffect(() => {
    fetchPortales();
    fetchCourseTabTitles();
    getCourseTabButtonNames();
  }, []);
  const fetchCourseTabTitles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courseTab/getCourseTabNames`)
      setCourseTabTitlesData(response.data);
      console.log(courseTabTitlesData)
    } catch (error) {
      console.log(error, "error happened while getting the course tab names in front end");
    }
  }
  const fetchPortales = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ExploreExam/portales`);
      setPortales(response.data);
    } catch (error) {
      console.error("Error fetching portales:", error);
    }
  };

  useEffect(() => {
    // Fetch saved data from the backend when the component mounts
    const fetchWhyChooseUsData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`
        );
        const data = await response.json();
        setWhyChooseUsItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchWhyChooseUsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editMode
      ? `${BASE_URL}/WhychooseUsEdit/updateWhyChooseUsItem/${editId}`
      : `${BASE_URL}/WhychooseUsEdit/saveWhyChooseUsItem`;
    const method = editMode ? "PUT" : "POST";

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("order", formData.order);
    formDataToSend.append("image", formData.image);

    try {
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        alert(`Item ${editMode ? "updated" : "saved"} successfully`);
        setShowForm(false);
        setFormData({
          title: "",
          description: "",
          order: "",
          image: null,
        });
        setEditMode(false);
        setEditId(null);
        // Refetch data
        const updatedItems = await fetch(
          `${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`
        ).then((res) => res.json());
        setWhyChooseUsItems(updatedItems);
      } else {
        alert(`Failed to ${editMode ? "update" : "save"} item`);
      }
    } catch (error) {
      console.error(`Error ${editMode ? "updating" : "saving"} item:`, error);
      alert(
        `An error occurred while ${editMode ? "updating" : "saving"} the item`
      );
    }
  };
  const {Portale_Id}=useParams()
  console.log(Portale_Id,"portaleIdddddddddd")
  const handleEdit = (item) => {
    setFormData({
      title: item.WhyChooseUsTitle,
      description: item.WhyChooseUsDiscreption,
      order: item.WhyChooseUsOrder,
      image: null, // Image needs to be re-uploaded
    });
    setEditMode(true);
    setEditId(item.WhyChooseUsId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/WhychooseUsEdit/deleteWhyChooseUsItem/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Item deleted successfully");
        // Refetch data
        const updatedItems = await fetch(
          `${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`
        ).then((res) => res.json());
        setWhyChooseUsItems(updatedItems);
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item");
    }
  };

  // const handleTabDataSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //     formData.append('coursePortaleId', tabsData.coursePortaleId);
  //     formData.append('courseTabId', tabsData.courseTabId);
  //     formData.append('courseTabDescription', tabsData.courseTabDescription);
  //     formData.append('courseTabImage', tabsData.courseTabImage);
  //   if(isEditFlag){
  //     try {
  //      const response= await axios.put(`${BASE_URL}/courseTab/courseTabEditData`,formData,{
  //       headers:{
  //         'Content-Type':'multipart/form-data',
  //       },
  //       method:'PUT'
  //      })
  //      console.log(response)
  //     } catch (error) {
  //       console.log("error while editing the data into the table at front end")
  //     }
  //   }
  //   else{
  //   // first when submit is clicked
  //   try {
      
  //     const response = await axios.post(`${BASE_URL}/courseTab/courseTabFormData`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     if (response.data.exists) {
  //       if (window.confirm("Data already exists.Do you want to over write it?")) {
  //         handleOverwriteSubmit();
  //       }
  //       else {

  //       }
  //     }
  //   } catch (error) {
  //     console.log(error, "happened while posting the tabs data");
  //   }
  // }
  // };
  
  const handleTabDataSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('coursePortaleId', tabsData.coursePortaleId);
    formData.append('courseTabId', tabsData.courseTabId);
    formData.append('courseTabDescription', tabsData.courseTabDescription);
    formData.append('courseTabImage', tabsData.courseTabImage);
  
    if (isEditFlag) {
      try {
        const response = await axios.put(`${BASE_URL}/courseTab/courseTabEditData`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.data.success) {
          alert(response.data.message || "Tab updated successfully");
        } else {
          alert(response.data.message || "Failed to update tab");
        }
      } catch (error) {
        console.log("Error while editing the data into the table at front end", error);
        alert("An error occurred while updating the tab");
      }
    } else {
      try {
        const response = await axios.post(`${BASE_URL}/courseTab/courseTabFormData`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.data.exists) {
          if (window.confirm("Data already exists. Do you want to overwrite it?")) {
            await handleOverwriteSubmit();
          }
        } else {
          alert("Data inserted successfully");
        }
      } catch (error) {
        console.log(error, "Error happened while posting the tabs data");
        alert("An error occurred while inserting the tab data");
      }
    }
  };
  


  const handleOverwriteSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('coursePortaleId', tabsData.coursePortaleId);
      formData.append('courseTabId', tabsData.courseTabId);
      formData.append('courseTabDescription', tabsData.courseTabDescription);
      formData.append('courseTabImage', tabsData.courseTabImage);

      const response = await axios.post(`${BASE_URL}/courseTab/overwriteCourseTabData`, formData);
      if (response.status === 200) {
        alert("Info overwritten successfully");
      }
    } catch (error) {
      console.log("Error happened while overwriting the tabs data", error);
    }
  }

  const handleChangeTabData = (e) => {
    console.log(tabsData);
    setTabsData(prevState => {
      const newState = { ...prevState, [e.target.name]: e.target.value };
      console.log(newState);
      return newState;
    });
  }
  const handleTabImageChange = (e) => {
    const file = e.target.files[0]
    setTabsData(prevState => {
      const newState = { ...prevState, [e.target.name]: file }
      console.log(newState);
      return newState;

    })
  }
  useEffect(() => {
    const fetchTabDetailsForEdit = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courseTab/fetchTabDetailsForEdit/${Portale_Id}`);
        setTabEditDetails(response.data);
        console.log(response.data, "response data ");
      } catch (error) {
        console.error("Error fetching tab details for edit:", error);
      }
    };

    fetchTabDetailsForEdit();
  }, []);
  const handlePreFillDropDown = (objPre) => {
    console.log(objPre)
    setTabsData(
     {coursePortaleId:objPre.course_portale_id,
      courseTabId:objPre.course_tab_title_id,
      courseTabDescription:objPre.course_tab_text,
      // courseTabImage:objPre.course_tab_image,
    }
    )
    setIsEditFlag(true);
    console.log(isEditFlag,"isEditiing flag from the handle pre fill dropdown")

  }
const handleDeleteTab=async(objPre)=>{
  console.log(objPre,"from the delete function");
  const tabId=objPre.tab_id;
  console.log(tabId);
  const confirmDelete=window.confirm("Are you sure you want to delete this tab?");
  if(!confirmDelete){
      return;
  }
  try {
    const response= await axios.delete(`${BASE_URL}/courseTab/courseTabDelete/${tabId}`)
    console.log(response);
    if(response.data.message){
      alert(response.data.message);
    }
    else{
      alert(response.data.message);
    }
  } catch (error) {
    console.log(error,"Error while deleting the course tab")
    alert("An error occurred while deleting the tab");
  }
}
  return (
    <div>
      {type === "WhyChooseUs" && (
        <div>
          {" "}
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Order:
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Image:
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  required={!editMode}
                />
              </label>
            </div>
            <button type="submit">Submit</button>
          </form>
          <div>
            <h2>Saved Items</h2>
            <ul>
              {WhyChooseUsitems.map((WhyChooseUsitem) => (
                <li key={WhyChooseUsitem.WhyChooseUsId}>
                  <img
                    src={`data:image/png;base64,${WhyChooseUsitem.WhyChooseUsImeage}`}
                    alt={WhyChooseUsitem.WhyChooseUsTitle}
                  />
                  {WhyChooseUsitem.WhyChooseUsTitle} -{" "}
                  {WhyChooseUsitem.WhyChooseUsDiscreption} -{" "}
                  {WhyChooseUsitem.WhyChooseUsOrder}
                  <button onClick={() => handleEdit(WhyChooseUsitem)}>
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(WhyChooseUsitem.WhyChooseUsId)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {type === 'tabButtonForm' && (
        <div>
          <form action="" onSubmit={handleTabDataSubmit}>
            <div>
              <label htmlFor="">Select a Portale: </label>
              <select name='coursePortaleId' onChange={handleChangeTabData} value={tabsData.coursePortaleId}>
                <option disabled value=''>Select a Portale</option>
                {portales.map((portale) => (
                  <option key={portale.Portale_Id} value={portale.Portale_Id}>
                    {portale.Portale_Name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {tabsData.coursePortaleId && (
                <div>
                  <label htmlFor="">Select tab :</label>
                  <select name="courseTabId" id="" onChange={handleChangeTabData} value={tabsData.courseTabId}>
                    <option disabled value=''>Select a tab name</option>
                    {courseTabTitlesData.map((tabName) => (
                      <option value={tabName.course_tab_id} >{tabName.course_tab_title}</option>
                    ))}
                  </select>

                </div>
              )}
              {tabsData.courseTabId && (
                <div>
                  <label htmlFor="">Enter Course Tab Description : </label>
                  <input type="text" name='courseTabDescription' onChange={handleChangeTabData} value={tabsData.courseTabDescription} placeholder='enter course tab description' />
                </div>
              )}
              {tabsData.courseTabDescription && (
                <div>
                  <label htmlFor="">Choose a Image for tab :</label>
                  <input type="file" name='courseTabImage' onChange={handleTabImageChange} />
                </div>
              )}
              {/* {tabsData.courseTabImage && ( */}
                <button type='submit' >Submit</button>
              {/* )} */}

            </div>
          </form>
          <form>
            <div>
              <div>
                {tabEditDetails.map(objPre => (
                  <div key={objPre.id} style={{ border: "1px solid black" }}>
                    <button type="button" onClick={() => handlePreFillDropDown(objPre)}>Edit</button>
                    <button type="button" onClick={()=>handleDeleteTab(objPre)}>Delete</button>
                    <div style={{ width: "50%" }}>
                      <img src={`data:image/png;base64,${objPre.course_tab_image}`} alt="nopeeeeee" />
                    </div>
                    <br />
                    <span>{objPre.course_tab_text}</span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WhychooseUsEdit;
