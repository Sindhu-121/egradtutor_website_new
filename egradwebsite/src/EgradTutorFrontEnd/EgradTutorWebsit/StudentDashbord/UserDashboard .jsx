import React from 'react';
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
  const { userId } = useParams();

  // Use userId as needed in your component
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default UserDashboard;
