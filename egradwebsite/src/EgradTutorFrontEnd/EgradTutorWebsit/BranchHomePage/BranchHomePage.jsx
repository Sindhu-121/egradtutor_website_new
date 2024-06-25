import React from "react";
import BHPHeading from "./BHPHeading/BHPHeading";
import BHPNavBar from "./BHPHeading/BHPNavBar";
import BHBanners from "./BranchHomeBanners/BHBanners";
import ExploreExam from "./BHPExploreExams/ExploreExam";
import OurCourses from "./OurCourses/OurCourses";
import Footer from "../Footer/Footer";
import FooterEdit from "../Footer/FooterEdit";
import { Element } from "react-scroll";
const BranchHomePage = () => {
  return (
    <div>
      <BHPHeading />
      <BHPNavBar />
      <BHBanners />
      <Element id="ExploreExam">
        <ExploreExam />
      </Element>
      <Element id="OurCourses">
        <OurCourses />
      </Element>
      <Footer />
      <FooterEdit />
    </div>
  );
};

export default BranchHomePage;
