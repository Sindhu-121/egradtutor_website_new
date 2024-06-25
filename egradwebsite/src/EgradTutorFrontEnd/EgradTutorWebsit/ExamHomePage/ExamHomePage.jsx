import React from 'react'
import ExamPageBanner from './ExamPageBanners/ExamPageBanner'
import ExamPageHeader from "./ExamHomepageHeader/ExamPageHeader"
import ExamInfo from './ExamInfo/ExamInfo'
import ExamCourse from './ExamCourse/ExamCourse'
import Footer from '../Footer/Footer'
const ExamHomePage = ({isEditMode}) => {
  return (
    <div>
      <ExamPageHeader isEditMode={isEditMode}/>
      <ExamPageBanner isEditMode={isEditMode}/>
      <ExamInfo isEditMode={isEditMode}/>
      <ExamCourse isEditMode={isEditMode}/>
      <Footer/>
    </div>
  )
}

export default ExamHomePage