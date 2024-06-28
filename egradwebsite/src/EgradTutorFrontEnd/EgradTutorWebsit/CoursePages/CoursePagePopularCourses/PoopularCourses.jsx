import React, { useEffect, useState } from "react";
import BASE_URL from "../../../../apiConfig";
import { Link, useParams } from "react-router-dom";
import { GoChevronDown } from "react-icons/go";
import '../../../../styles/CoursesPageStyles/CoursePage.css'
const PoopularCourses = () => {
  const { Portale_Id } = useParams();
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);

  const fetchunPurchasedCourses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/PoopularCourses/unPurchasedCoursesOnHomePage/${Portale_Id}`
      );
      const data = await response.json();
      setUnPurchasedCourses(data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    }
  };
  useEffect(() => {
    fetchunPurchasedCourses();
  }, []);

  const coursesByPortalAndExam = unPurchasedCourses.reduce(
    (portals, course) => {
      const portal = course.portal || "Unknown Portal";
      const examName = course.examName || "Unknown Exam";
      if (!portals[portal]) {
        portals[portal] = {};
      }
      if (!portals[portal][examName]) {
        portals[portal][examName] = [];
      }
      portals[portal][examName].push(course);
      console.log(portals, "portals from the coursesByPortalAndExam");
      return portals;
    },
    {}
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <div>
        {Object.entries(coursesByPortalAndExam).map(([portal, exams]) => (
          <div key={portal} >
            <div className="coursePagePortalName">
              <h2>{portal}</h2>
            </div>
            <div className="courseExamParentContainer">
              {Object.entries(exams).map(([examName, courses], index) => (
                <div key={examName} className="courseExamContainer">
                  <div className="coursePageExamCardContainer">
                    <div className="courseExamHeading">
                      <h2>{examName}</h2>
                    </div>
                    <div className="courseExamDetailsContainer">
                      {courses.map((courseExamsDetails) => (
                        <div key={courseExamsDetails.courseCreationId} className="courseCardDetailsContainer">
                          <div className="courseImgContainer">
                            <img
                              src={courseExamsDetails.courseCardImage}
                              alt={courseExamsDetails.courseName}
                            />
                          </div>
                          <div className="courseExamPriceDetailsContainer">
                          <div>{courseExamsDetails.courseName}</div>

                          <p>
                            <span> Duration:</span>
                            {formatDate(courseExamsDetails.courseStartDate)}
                            <small
                              style={{
                                textTransform: "capitalize",
                                padding: "0 1px",
                              }}
                            >
                              {" "}
                              to{" "}
                            </small>
                            {formatDate(courseExamsDetails.courseEndDate)}
                          </p>

                          <div>
                            <p>
                              <p>
                                <span>Price :</span>{" "}
                                <span>{courseExamsDetails.ActualtotalPrice}</span>
                              </p>
                              <p>
                                <span>Discount : </span>{" "}
                                {courseExamsDetails.discount}%
                              </p>
                            </p>
                            <p>
                              {" "}
                              <span>Amount :</span> ₹
                              {courseExamsDetails.totalPrice}/-
                            </p>

                            <div>
                              <Link
                                to={`/coursedataSRP/${courseExamsDetails.courseCreationId}`}
                              >
                                Buy Now
                              </Link>
                            </div>
                          </div>
                          </div>
                          {/* asdf */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoopularCourses;
