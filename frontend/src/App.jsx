import { useState } from 'react';
import FrontDeskView from './views/FrontDeskView';
import DoctorView from './views/DoctorView';
import './App.css'; // Import the CSS file

const App = () => {
  const [view, setView] = useState('front-desk'); // State to switch between views

  return (
    <div className="app-container">
      <header className="header">
        <h1>Clinic Pulse Token System</h1>
        <nav className="nav">
          <button 
            className={`nav-button ${view === 'front-desk' ? 'active' : ''}`}
            onClick={() => setView('front-desk')}
          >
            Front Desk
          </button>
          <button
            className={`nav-button ${view === 'doctor' ? 'active' : ''}`}
            onClick={() => setView('doctor')}
          >
            Doctor View
          </button>
        </nav>
      </header>

      <main className="main-content">
        {view === 'front-desk' ? <FrontDeskView /> : <DoctorView />}
      </main>
    </div>
  );
};

export default App;