import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify'; // To interact with the API
import { Auth } from 'aws-amplify';

function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch user data from the RDS database
  const fetchUserData = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const apiName = 'myApiName';  // Replace with your API name
      const path = '/getUserData';  // Replace with your API path
      const myInit = {
        headers: { Authorization: `Bearer ${currentUser.signInUserSession.idToken.jwtToken}` }
      };
      const response = await API.get(apiName, path, myInit);
      setUserData(response); // Store the fetched data
    } catch (error) {
      setErrorMessage('Error fetching data');
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {userData ? (
        <div>
          <h3>Welcome, {userData.username}</h3>
          <p>{userData.email}</p>
          {/* Display other data fetched from RDS */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DashboardPage;
