import React, { useState } from 'react';
import StudentRegistrationFormFields from './StudentRegistationFormFileds';
import './Style/Registrationform.css';

const StudentRegistationPage = () => {
  const [formState, setFormState] = useState({
    emailExists: false,
    contactExists: false,
    emailChecked: false,
    contactChecked: false,
    showModal: false,
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userId, setUserId] = useState(null); // New state to store user ID

  const checkUserExistence = async (field, value) => {
    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;

    if (name === 'emailId' || name === 'contactNo') {
      const exists = await checkUserExistence(name, value);
      if (name === 'emailId') {
        setFormState((prevState) => ({
          ...prevState,
          emailExists: exists,
          emailChecked: true,
        }));
        if (exists) {
          alert('Email ID already exists. Please log in.');
        }
      } else if (name === 'contactNo') {
        setFormState((prevState) => ({
          ...prevState,
          contactExists: exists,
          contactChecked: true,
        }));
        if (exists) {
          alert('Contact number already exists. Please log in.');
        }
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const requiredFields = [
      'candidateName', 'dateOfBirth', 'Gender', 'Category', 'emailId', 'confirmEmailId', 'contactNo',
      'fatherName', 'occupation', 'mobileNo', 'line1', 'state', 'districts', 'pincode',
      'qualification', 'NameOfCollege', 'passingYear', 'marks', 'photo', 'signature','Proof'
    ];

    for (let field of requiredFields) {
      if (!formData.get(field)) {
        alert(`Please fill the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return;
      }
    }

    const emailId = formData.get('emailId');
    const confirmEmailId = formData.get('confirmEmailId');

    if (emailId.toLowerCase() !== confirmEmailId.toLowerCase()) {
      alert('Email and Confirm Email fields do not match');
      return;
    }

    if (formState.emailChecked && formState.emailExists) {
      alert('Email ID already exists. Please log in.');
      return;
    }
    if (formState.contactChecked && formState.contactExists) {
      alert('Contact number already exists. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/register', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 409) {
        alert('User with this email ID or contact number already exists. Please log in.');
      } else if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const result = await response.json(); // Parse JSON response
        setUserId(result.userId); // Store user ID in state
        alert(result.message);
        setIsPopupVisible(true); // Show popup on successful submission
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving data');
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const formFields = [
    {
      sectionTitle: "Personal Details",
      fields: [
        { label: "Candidate Name", name: "candidateName", type: "text", placeholder: "Please enter your full name" },
        { label: "Date of Birth", name: "dateOfBirth", type: "date", placeholder: "dd-mm-yyyy" },
        { label: "Gender", name: "Gender", type: "radio", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Others", value: "others" }
        ]},
        { label: "Category", name: "Category", type: "radio", options: [
          { label: "General", value: "general" },
          { label: "ST", value: "st" },
          { label: "SC", value: "sc" },
          { label: "OBC", value: "obc" }
        ]},
        { label: "Email ID", name: "emailId", type: "email", placeholder: "Enter your email", onBlur: handleBlur },
        { label: "Confirm Email ID", name: "confirmEmailId", type: "email", placeholder: "Re-enter your email" },
        { label: "Contact No", name: "contactNo", type: "text", placeholder: "Enter your mobile number", onBlur: handleBlur },
      ]
    },
    {
      sectionTitle: "Father's/Guardian's Details",
      fields: [
        { label: "Father's Name", name: "fatherName", type: "text", placeholder: "Enter your father's full name" },
        { label: "Occupation", name: "occupation", type: "text", placeholder: "Enter father's occupation" },
        { label: "Mobile No", name: "mobileNo", type: "text", placeholder: "Enter your father's mobile number" },
      ]
    },
    {
      sectionTitle: "Education Details",
      fields: [
        { label: "Qualification", name: "qualification", type: "dropdown", options: [
          { label: "Choose a Qualification", value: "" },
          { label: "High School", value: "highSchool" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Graduate", value: "graduate" },
        ]},
        { label: "Name of College (with city)", name: "NameOfCollege", type: "text", placeholder: "Enter your college name" },
        { label: "Passing Year", name: "passingYear", type: "text", placeholder: "Enter your passing year" },
        { label: "Marks in %", name: "marks", type: "text", placeholder: "Enter your marks" },
      ]
    },
    {
      sectionTitle: "Communication Address",
      fields: [
        { label: "Line 1", name: "line1", type: "text", placeholder: "Enter full address" },
        { label: "Select a State", name: "state", type: "dropdown", options: [
          { label: "Andhra Pradesh", value: "AP" },
          { label: "Telangana", value: "TG" },
          { label: "Karnataka", value: "KA" },
          { label: "Tamil Nadu", value: "TN" },
        ]},
        { label: "Select a districts", name: "districts", type: "dropdown", options: [
          { label: "Choose a districts", value: "" },
          { label: "Andhra Pradesh", value: "AP" },
        ]},
        { label: "Pincode", name: "pincode", type: "text", placeholder: "Enter your pin code" },
      ]
    },
    {
      sectionTitle: "Upload Image/Documents",
      fields: [
        { label: "Upload Photo", name: "photo", type: "file" },
        { label: "Upload Signature", name: "signature", type: "file" },
        { label: "Proof", name: "Proof", type: "file" },
      ]
    },
  ];

  return (
    <div className="container mt-4">
      <h1>Student Registration Page</h1>
      <StudentRegistrationFormFields onSubmit={handleFormSubmit} fields={formFields} />

      {isPopupVisible && (
        <div className="popup show">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Registration Successful</h2>
              <span className="popup-close" onClick={handleClosePopup}>&times;</span>
            </div>
            <div className="popup-body">
              <p>You have successfully registered!</p>
            </div>
            <div className="popup-footer">
              <button className="popup-button" onClick={() => window.location.href = `/buy-courses/${userId}`}>Buy Courses</button>
              <button className="popup-button" onClick={() => window.location.href = `/login/${userId}`}>Login</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRegistationPage;
