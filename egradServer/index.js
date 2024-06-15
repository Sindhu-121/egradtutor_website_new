const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const MainHearder =require("./EgradTutorWebsit/HeaderFolders/MainHearder")
app.use("/MainHearder",MainHearder)


const ContactUs =require("./EgradTutorWebsit/ContactUs/ContactUs")
app.use("/ContactUs", ContactUs)

const ContactUsEdit =require("./EgradTutorWebsit/ContactUs/ContactUsEdit")
app.use("/ContactUsEdit", ContactUsEdit)

const AboutUs =require("./EgradTutorWebsit/AboutUs/AboutUs")
app.use("/AboutUs",AboutUs)

const AboutUsEdit =require("./EgradTutorWebsit/AboutUs/AboutUsEdit")
app.use("/AboutUsEdit",AboutUsEdit)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });