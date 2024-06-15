import React from 'react'
import LandingPageHeader from './LandingPageHeader/LandingPageHeader'
import LandingPageExamdata from './LandingpageExamdata/LandingPageExamdata'
import Footer from '../Footer/Footer'


const WebSiteLandingPage = () => {
  return (
    <div>
      WebSiteLandingPage

      {/* each compoent ki 1.edit 2.data  */}
      
    {/* <div className="Newlandingpage"> */}
    <LandingPageHeader /> 
      <LandingPageExamdata />
      {/* </div> */}
   
      <Footer />
    </div>
  )
}

export default WebSiteLandingPage