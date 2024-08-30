import React, { useCallback, useEffect } from 'react';
import { useConnectionMessage } from './hooks/useConnectionMessage';
import { useHandleConnectionData } from './hooks/useHandleConnectionData';
import { useUserStore } from './stores/user';

function App() {
  const { user, setUser } = useUserStore();
  const sendMessage = useConnectionMessage();

  const handleMessage = useCallback((event) => {
    try {
      const parsedData = JSON.parse(event.data);
      if (parsedData.name === 'userinfo') {
        setUser(parsedData.data);
      } else {
        console.log('Received general message:', parsedData);
        // 在這裡處理其他類型的消息
      }
    } catch (error) {
      console.error('Error parsing data:', error);
    }
  }, [setUser]);

  useHandleConnectionData(handleMessage);

  useEffect(() => {
    sendMessage('userinfo', null);
  }, [sendMessage]);

  return (
    <div className="App">
      <h1>My App</h1>
      {user ? (
        <div>
          <h2>User Information</h2>
          <p>Username: {user.username}</p>
          <p>Real Name: {user.realName}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phoneNo}</p>
          <h3>Address</h3>
          {user.addresses && user.addresses.length > 0 && (
            <p>
              {user.addresses[0].city} {user.addresses[0].town} {user.addresses[0].street}
            </p>
          )}
          <h3>Other Details</h3>
          <p>Member Type: {user.memberType}</p>
          <p>Verify Level: {user.verifyLevel}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}

export default App;