import React, { useEffect, useState } from 'react';
import { fetchUserInfo } from '../api';

const UserInfo = ({ userInfo, setUserInfo }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await fetchUserInfo(userInfo.token);
        setUserDetails(data);
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    getUserInfo();
  }, [userInfo]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserInfo(null);
  };

  return (
    <div>
      {userDetails && (
        <div>
          <h1>Welcome, {userDetails.username}!</h1>
          <p>UUID: {userDetails.uuid}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
