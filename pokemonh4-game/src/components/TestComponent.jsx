import React from 'react';

const TestComponent = () => {
  const username = localStorage.getItem('username');
  const uuid = localStorage.getItem('uuid');

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div>
        <h1 className="text-4xl font-bold text-green-700">
          Bravo, vous êtes connecté !
        </h1>
        <p className="mt-4 text-2xl">Username: {username}</p>
        <p className="text-xl">UUID: {uuid}</p>
      </div>
    </div>
  );
};

export default TestComponent;
