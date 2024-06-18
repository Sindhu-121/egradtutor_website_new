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
      <LandingPageHeader />
      <LandingPageExamdata />
      <Footer />
    </div>
  )
}

export default WebSiteLandingPage