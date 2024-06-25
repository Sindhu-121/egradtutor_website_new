import React from "react";
import BHPHeading from "./BHPHeading/BHPHeading";
import BHPNavBar from "./BHPHeading/BHPNavBar";
import BHBanners from "./BranchHomeBanners/BHBanners";
import ExploreExam from "./BHPExploreExams/ExploreExam";
import OurCourses from "./OurCourses/OurCourses";
import Footer from "../Footer/Footer";
import FooterEdit from "../Footer/FooterEdit";
import { Element } from "react-scroll";
const BranchHomePage = ({ isEditMode }) => {
  return (
    <div>
      <BHPHeading isEditMode={isEditMode} />
      <BHPNavBar  isEditMode={isEditMode}/>
      <BHBanners  isEditMode={isEditMode}/>
      <Element id="ExploreExam">
        <ExploreExam  isEditMode={isEditMode}/>
      </Element>
      <Element id="OurCourses">
        <OurCourses  isEditMode={isEditMode}/>
      </Element>
      <Footer isEditMode={isEditMode}/>
      <FooterEdit isEditMode={isEditMode} />
    </div>
  );
};

export default BranchHomePage;
