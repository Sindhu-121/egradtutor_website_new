import React from 'react'
import BHPHeading from "./BHPHeading/BHPHeading"
import BHPNavBar from "./BHPHeading/BHPNavBar"
import BHBanners from "./BranchHomeBanners/BHBanners"
import ExploreExam from './BHPExploreExams/ExploreExam'
import OurCourses from './OurCourses/OurCourses'
import Footer from '../Footer/Footer'
const BranchHomePage = () => {
  return (
    <div>BranchHomePage
   <BHPHeading />
   <BHPNavBar/>
   <BHBanners/>
   <ExploreExam/>
   <OurCourses/>
   <Footer/>
    </div>
  )
}

export default BranchHomePage