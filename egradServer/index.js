const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5001;
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const Logo =require("./EgradTutorWebsite/Logo");
app.use("/Logo" ,Logo)

const LandingPageHeader =require("./EgradTutorWebsite/LandingPage/LandingPageHeader");
app.use("/LandingPageHeader" ,LandingPageHeader)


const LandingPageHeaderEdit =require("./EgradTutorWebsite/LandingPage/LandingPageHeaderEdit");
app.use("/LandingPageHeaderEdit" ,LandingPageHeaderEdit)

const LandingPageExamData =require("./EgradTutorWebsite/LandingPage/LandingPageExamData");
app.use("/LandingPageExamData" ,LandingPageExamData)


const BHPNavBar =require("./EgradTutorWebsite/BranchHomePage/BHPNavBar");
app.use("/BHPNavBar" , BHPNavBar)

const OueCourses =require("./EgradTutorWebsite/BranchHomePage/OueCourses");
app.use("/OueCourses" , OueCourses)


const ExploreExam =require("./EgradTutorWebsite/BranchHomePage/ExploreExam");
app.use("/ExploreExam" , ExploreExam)


const Webbanners =require("./EgradTutorWebsite/ExamPage/Webbanners");
app.use("/Webbanners" ,Webbanners)

const ExampagePortals =require("./EgradTutorWebsite/ExamPage/ExampagePortals");
app.use("/ExampagePortals" ,ExampagePortals)

const ExamInfo =require("./EgradTutorWebsite/ExamPage/ExamInfo");
app.use("/ExamInfo" ,ExamInfo)

const AboutUs =require("./EgradTutorWebsite/AboutUs/AboutUs");
app.use("/AboutUs", AboutUs)
const AboutUsEdit =require("./EgradTutorWebsite/AboutUs/AboutUsEdit");
app.use("/AboutUsEdit", AboutUsEdit)

const themesSection=require('./ThemesAPIs/ThemesAPIs')
app.use('/themesSection',themesSection);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });