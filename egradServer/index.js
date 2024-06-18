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

const LandingPageHeader =require("./EgradTutorWebsite/LandingPage/LandingPageHeader");
app.use("/LandingPageHeader" ,LandingPageHeader)


const LandingPageHeaderEdit =require("./EgradTutorWebsite/LandingPage/LandingPageHeaderEdit");
app.use("/LandingPageHeaderEdit" ,LandingPageHeaderEdit)


const ExampagePortals =require("./EgradTutorWebsite/ExamPage/ExampagePortals");
app.use("/ExampagePortals" ,ExampagePortals)

const AboutUs =require("./EgradTutorWebsite/AboutUs/AboutUs");
app.use("/AboutUs", AboutUs)
const AboutUsEdit =require("./EgradTutorWebsite/AboutUs/AboutUsEdit");
app.use("/AboutUsEdit", AboutUsEdit)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });