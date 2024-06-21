import React from 'react'
import BHPHeading from "./BHPHeading/BHPHeading"
import BHPNavBar from "./BHPHeading/BHPNavBar"
import BHBanners from "./BranchHomeBanners/BHBanners"
import ExploreExam from './BHPExploreExams/ExploreExam'
import OurCourses from './OurCourses/OurCourses'
import Footer from '../Footer/Footer'
import FooterEdit from '../Footer/FooterEdit'
const BranchHomePage = () => {
  return (
    <div>
      <BHPHeading />
      <BHPNavBar />
      <BHBanners />
      <ExploreExam />
      <OurCourses />
      <Footer />
      <FooterEdit/>
    </div>
  )
}

export default BranchHomePage