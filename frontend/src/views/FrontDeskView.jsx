import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3001/api/patients';

const FrontDeskView = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', purpose: '' });
  const [loading, setLoading] = useState(false);

  // Function to fetch the current patient list
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]); // Fetch data on component mount

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.purpose) {
      alert('Patient Name and Purpose are required.');
      return;
    }

    try {
      // POST request to create a new patient/token
      await axios.post(API_BASE_URL, formData);
      
      // Clear form and refresh the patient list
      setFormData({ name: '', age: '', purpose: '' });
      fetchPatients(); 
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient.');
    }
  };

  return (
    <div className="view-container">
      <h2>Front Desk | Patient Registration</h2>
      
      {/* Patient Registration Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label>
            Name:
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              style={{ padding: '8px', marginLeft: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label>
            Age:
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange} 
              style={{ padding: '8px', marginLeft: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }}
            />
          </label>
          <label>
            Purpose:
            <input 
              type="text" 
              name="purpose" 
              value={formData.purpose} 
              onChange={handleChange} 
              required
              style={{ padding: '8px', marginLeft: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Generate Token
          </button>
        </div>
      </form>

      {/* Today's Patient Queue Table */}
      <h3>Today's Patient Queue</h3>
      <button onClick={fetchPatients} disabled={loading} style={{ padding: '8px', marginBottom: '10px' }}>
        {loading ? 'Refreshing...' : 'Manual Refresh'}
      </button>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Token No.</th>
            <th>Name</th>
            <th>Age</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Check-in Time</th>
          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td>**{patient.token_number}**</td>
                <td>{patient.name}</td>
                <td>{patient.age || 'N/A'}</td>
                <td>{patient.purpose}</td>
                <td className={`status-${patient.status.replace(/\s/g, '')}`}>{patient.status}</td>
                <td>{new Date(patient.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No patients checked in yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FrontDeskView;