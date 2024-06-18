import React, { useState,useEffect} from 'react'
import OurCoursesEdit from './OurCoursesEdit'
import axios from 'axios';
import BASE_URL from '../../../../apiConfig';
const OueCourses = () => {
  const [courseFeatures, setCourseFeatures] = useState([]);
  useEffect(() => {
    fetchCourseFeatures();
  }, []);
  const fetchCourseFeatures = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/UgHomePage/course_features_with_images/1`
      );

      // Map over each feature and create image URLs
      const featuresWithImages = response.data.map((feature) => {
        if (feature.image) {
          // Set image URL if available
          return {
            ...feature,
            image: feature.image,
          };
        } else {
          return feature;
        }
      });

      // Set the features with image URLs
      setCourseFeatures(featuresWithImages);
    } catch (error) {
      console.error("Error fetching course features:", error);
      // setError(error.message);
    }
  };
  return (
    <div>OueCourses
      <div>
          <h3>Course Features:</h3>
          <ul>
            {courseFeatures.map((feature, index) => (
              <li key={index}>
                <strong>{feature.Portale_Name}</strong> -{" "}
                <em>{feature.EntranceExams_name.join(", ")}</em>:{" "}
                {/* {feature.Features.join(", ")} */}
                <div>
                  {feature.Features.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
                {/* Render image if available */}
                {feature.image && (
                  <div style={{ width: '250px' }}>
                    <img src={feature.image} alt={`${feature.Portale_Name}`} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <OurCoursesEdit/>
    </div>
  )
}

export default OueCourses