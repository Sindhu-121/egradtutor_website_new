import React from 'react'
import ExamPageBanner from './ExamPageBanners/ExamPageBanner'
import ExamPageHeader from "./ExamHomepageHeader/ExamPageHeader"
import ExamInfo from './ExamInfo/ExamInfo'
import ExamCourse from './ExamCourse/ExamCourse'
import Footer from '../Footer/Footer'
const ExamHomePage = () => {
  return (
    <div>ExamHomePage
      <ExamPageHeader />
      <ExamPageBanner/>
      <ExamInfo/>
      <ExamCourse/>
      <Footer/>
    </div>
  )
}

export default ExamHomePage