import React, { useState } from 'react';
import LandingPageHeader from './LandingPageHeader/LandingPageHeader';
import LandingPageExamdata from './LandingpageExamdata/LandingPageExamdata';
import Footer from '../Footer/Footer';

const WebSiteLandingPage = ({ isEditMode }) => {
  return (
    <div>
      <LandingPageHeader isEditMode={isEditMode} />
      <LandingPageExamdata isEditMode={isEditMode} />
      <Footer isEditMode={isEditMode} />
    </div>
  );
};

export default WebSiteLandingPage;
