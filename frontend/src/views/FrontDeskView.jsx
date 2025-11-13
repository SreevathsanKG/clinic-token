import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FrontDeskView.css';
import { socket } from '../socket';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FrontDeskView = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', purpose: '' });
  const [loading, setLoading] = useState(false);

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/patients/getAll/Today`);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Real-time updates
  useEffect(() => {
    socket.on('patientAdded', (newPatient) => {
      setPatients((prev) => [newPatient, ...prev]);
    });

    socket.on('patientUpdated', (updatedPatient) => {
      setPatients((prev) =>
        prev.map((p) => (p._id === updatedPatient._id ? updatedPatient : p))
      );
    });

    return () => {
      socket.off('patientAdded');
      socket.off('patientUpdated');
    };
  }, []);

  // Add patient
  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.purpose) return;

    try {
      await axios.post(`${API_BASE_URL}/patients/add`, {
        ...newPatient,
        age: parseInt(newPatient.age),
      });
      setNewPatient({ name: '', age: '', purpose: '' });
    } catch (err) {
      console.error('Error adding patient:', err);
    }
  };

  const handleChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleRefreshQueue = () => {
    fetchPatients();
  };

  return (
    <div className="frontdesk-container">
      <div className="queue-section">
        <h2>Front Desk | Patient Queue</h2>

        <div className="add-patient-form">
          <h3>Add New Patient</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Patient Name"
              name="name"
              value={newPatient.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Age"
              name="age"
              value={newPatient.age}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Purpose of Visit"
              name="purpose"
              value={newPatient.purpose}
              onChange={handleChange}
            />
          </div>
          <button className="btn-add" onClick={handleAddPatient}>
            Add Patient
          </button>
        </div>

        <div className="patients-queue">
          <div className="queue-header">
            <h3>Patients in Queue / Consultation ({patients.length} Total)</h3>
            <button className="btn-refresh" onClick={handleRefreshQueue}>
              {loading ? 'Refreshing...' : 'Manual Refresh Queue'}
            </button>
          </div>

          <table className="patients-table">
            <thead>
              <tr>
                <th>Token No.</th>
                <th>Name</th>
                <th>Age</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={patient._id || index}>
                    <td>{patient.tokenNo || index + 1}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.purpose}</td>
                    <td>
                      <span className={`status-badge ${patient.status.toLowerCase()}`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="5">No patients currently in queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskView;
