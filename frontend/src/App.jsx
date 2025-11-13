import { useState, useEffect } from 'react';
import './App.css';
import FrontDeskView from './views/FrontDeskView';
import DoctorView from './views/DoctorView';
import { socket } from './socket'; // ✅ use single shared socket

function App() {
  const [currentView, setCurrentView] = useState('frontDesk');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Clinic Pulse Token System</h1>
        <div className="view-buttons">
          <button
            className={`view-btn ${currentView === 'frontDesk' ? 'active' : ''}`}
            onClick={() => setCurrentView('frontDesk')}
          >
            Front Desk
          </button>
          <button
            className={`view-btn ${currentView === 'doctor' ? 'active' : ''}`}
            onClick={() => setCurrentView('doctor')}
          >
            Doctor View
          </button>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'frontDesk' ? <FrontDeskView /> : <DoctorView />}
      </main>

      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '● Connected' : '● Disconnected'}
      </div>
    </div>
  );
}

export default App;
