import React, { useState } from 'react'
import LandingPageHeader from './LandingPageHeader/LandingPageHeader'
import LandingPageExamdata from './LandingpageExamdata/LandingPageExamdata'
import Footer from '../Footer/Footer'


const WebSiteLandingPage = () => {
  const [enableEdit, setEnableEdit] = useState("Enable Edit FromParent");
  const [enableEditcontainer, setEnableEditcontainer] = useState(false);

  const handleenableEdit = () => {
    if (enableEdit === "Enable Edit") {
      setEnableEdit("Disable Edit");
      setEnableEditcontainer(true);
    } else {
      setEnableEdit("Enable Edit");
      setEnableEditcontainer(false);
    }
  };

  return (
    <div>
      {/* WebSiteLandingPage */}
      {/* <button
        onClick={()=>{handleenableEdit();console.log(enableEdit,"enable edit value")}}
        className={
          enableEdit === "Disable Edit" ? "disabled-edit" : ""
        }
      >
        {enableEdit}
      </button> */}

      
      {/* from the button, we have to pass the enable button to all the components from here */}
      {/* so that buttons will be passed to the below children   */}
      <LandingPageHeader />
      {/* <LandingPageExamdata enableEditFromP={enableEdit}/> */}
      <LandingPageExamdata />
      <Footer />
    </div>
  )
}

export default WebSiteLandingPage