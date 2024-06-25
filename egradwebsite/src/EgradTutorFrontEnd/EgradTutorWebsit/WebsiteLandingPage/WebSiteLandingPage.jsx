import React, { useState, useEffect } from 'react';
import LandingPageHeader from './LandingPageHeader/LandingPageHeader';
import LandingPageExamdata from './LandingpageExamdata/LandingPageExamdata';
import Footer from '../Footer/Footer';

const WebSiteLandingPage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div>
      {isAdmin && (
        <button onClick={toggleEditMode}>
          {isEditMode ? 'Disable Edit' : 'Enable Edit'}
        </button>
      )}
      <LandingPageHeader isEditMode={isEditMode} />
      <LandingPageExamdata isEditMode={isEditMode} />
      <Footer isEditMode={isEditMode}/>
    </div>
  );
};

export default WebSiteLandingPage;



