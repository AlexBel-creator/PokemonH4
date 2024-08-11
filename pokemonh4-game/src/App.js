import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import UserInfo from './components/UserInfo';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ token, uuid: decoded.uuid });
    }
  }, []);

  return (
    <div>
      {!userInfo ? (
        <LoginForm setUserInfo={setUserInfo} />
      ) : (
        <UserInfo userInfo={userInfo} setUserInfo={setUserInfo} />
      )}
    </div>
  );
}

export default App;
