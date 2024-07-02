import React, { useContext, useEffect, useState } from "react";
import BASE_URL from "../../../../apiConfig";
import { Link, useParams } from "react-router-dom";
import { GoChevronDown } from "react-icons/go";
import '../../../../styles/CoursesPageStyles/CoursePage.css'
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import img from '../../../../styles/About_us_Image.jpeg'
// theme-2 
import '../../../../styles/CoursesPageStyles/OrangeTheme.css'
// theme white is for default
import '../../../../styles/CoursesPageStyles/themeWhite.css'
// before themes, css
import '../../../../styles/CoursesPageStyles/Home.css'
// theme-1 (green,yellow )
import '../../../../styles/CoursesPageStyles/Theme-green.css';
import '../../../../styles/CoursesPageStyles/CoursePage.css'

const PoopularCourses = () => {
  const { Portale_Id } = useParams();
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
  const themeFromContext = useContext(ThemeContext);
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
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
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
        <div className="courseheader_continer">
          <div
            className={`${themeDetails.theme_COURSES} `}
          >
            <div className={`${themeDetails.themeHeadingInCp}`}>
              <h2
                className={`${themeDetails.themeContant} `}
              >BUY COURSES</h2>
            </div>
            <span>Choose your course and get started.</span>
          </div>
          <div className="beforelogin_Quiz_cards_cantainer_contain">
            {Object.entries(coursesByPortalAndExam).map(
              ([portal, exams]) => (

                <div key={portal} className={themeDetails.theme_portal}>
                  {themeColor === 'theme-purple' ? <div className="pp">
                    <h2 className="portal_group_h2">{portal}</h2>{" "}
                    <div>
                      <img src={img} alt="" />
                    </div>
                  </div> :
                    <h2 className="portal_group_h2">{portal}</h2>
                  }
                  {Object.entries(exams).map(([examName, courses], index) => (
                    <div
                      key={examName}
                      className={`exam_group ${themeDetails.theme_exam_group}
                              ${index % 2 === 0 ? 'evenColor' : 'oddColor'}`}
                    >
                      <h2
                        className={`subheading ${themeDetails.theme_examName}`}
                        id={themeDetails.theme_examName}
                      >
                        {examName}
                      </h2>
                      <div
                        className={`courses_container ${themeDetails.theme_courses_container} `}
                      >
                        {courses.map((courseExamsDetails) => (
                          <div
                            className={`card_container ${themeDetails.themeCard}`}
                          >
                            <div
                              key={courseExamsDetails.courseCreationId}
                              className={`before_login_first_card ${themeDetails.themeCardImg}`}
                            >
                              <img
                                src={courseExamsDetails.courseCardImage}
                                alt={courseExamsDetails.courseName}
                              />
                              {themeColor ===
                                "theme-purple" && (
                                  <div className="purpleCardHeading">
                                    {courseExamsDetails.courseName}
                                  </div>
                                )}
                              {themeColor ===
                                "theme-blue" && (
                                  <div className="blueCardHeading">
                                    {courseExamsDetails.courseName}
                                    < GoChevronDown />
                                  </div>
                                )}
                              {themeColor === 'theme-purple' && (
                                <p>
                                  <span
                                    className={
                                      'durationBeforeHover'
                                    }
                                  >
                                    {" "}
                                    Duration:
                                  </span>
                                  {formatDate(
                                    courseExamsDetails.courseStartDate
                                  )}
                                  <small style={{ textTransform: 'capitalize', padding: '0 1px' }}> to </small>
                                  {formatDate(
                                    courseExamsDetails.courseEndDate
                                  )}
                                </p>
                              )}

                              <div
                                className={`before_login_first_carddel ${themeDetails.themeCardBody}`}
                              >
                                <p className={`courseNameInCard ${themeDetails.themeCourseNameInCard}`}>
                                  {courseExamsDetails.courseName}
                                </p>
                                <p>
                                  <span className={themeDetails.themeCourseInfoSpan}>Duration:</span>
                                  {formatDate(
                                    courseExamsDetails.courseStartDate
                                  )} to
                                  {formatDate(
                                    courseExamsDetails.courseEndDate
                                  )}
                                </p>
                                <p className="Price_Discount">
                                  <p>
                                    <span className={themeDetails.themeCourseInfoSpan}>Price:</span>
                                    <span className="toBeStrikeOff">
                                      {courseExamsDetails.ActualtotalPrice}
                                    </span>
                                  </p>
                                  <p>
                                    <span className={themeDetails.themeCourseInfoSpan}>Discount : </span>{courseExamsDetails.discount}%
                                  </p>
                                </p>
                                <p className={themeDetails.themeCourseAmountSpan}>
                                  <span className={themeDetails.themeCourseInfoSpan}>Amount : ₹</span>
                                  {courseExamsDetails.totalPrice}/-
                                </p>

                                <div className="before_start_now">
                                  <Link
                                    to={`/coursedataSRP/${courseExamsDetails.courseCreationId}`}
                                  >
                                    Buy Now
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoopularCourses;
