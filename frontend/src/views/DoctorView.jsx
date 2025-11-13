import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './DoctorView.css';
import { socket } from '../socket';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DoctorView = () => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch today's patients
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/patients/getAll/Today`);
      const allPatients = response.data;

      // Find the one currently in consultation
      const current = allPatients.find((p) => p.status === 'In Consultation');

      setPatients(allPatients);
      setCurrentPatient(current || null);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Real-time updates from backend
  useEffect(() => {
    socket.on('patientAdded', (newPatient) => {
      setPatients((prev) => [newPatient, ...prev]);
    });

    socket.on('patientUpdated', (updatedPatient) => {
      setPatients((prev) =>
        prev.map((p) => (p._id === updatedPatient._id ? updatedPatient : p))
      );

      if (updatedPatient.status === 'In Consultation') {
        setCurrentPatient(updatedPatient);
      } else if (
        updatedPatient._id === currentPatient?._id &&
        updatedPatient.status === 'Done'
      ) {
        setCurrentPatient(null);
      }
    });

    return () => {
      socket.off('patientAdded');
      socket.off('patientUpdated');
    };
  }, [currentPatient]);

  // Handle calling a patient
  const handleCallPatient = async (patient) => {
    try {
      const updated = { ...patient, status: 'In Consultation' };
      const patientId = patient._id || patient.id; // ✅ FIX
      await axios.put(`${API_BASE_URL}/patients/put/status/${patientId}`, updated);
      setCurrentPatient(updated);
      fetchPatients();
    } catch (err) {
      console.error('Error updating patient:', err);
    }
  };

  // Handle marking patient as completed
  const handleCompletePatient = async () => {
    if (!currentPatient) return;
    try {
      const updated = { ...currentPatient, status: 'Done' };
      const patientId = currentPatient._id || currentPatient.id; // ✅ FIX
      await axios.put(`${API_BASE_URL}/patients/put/status/${patientId}`, updated);
      setCurrentPatient(null);
      fetchPatients();
    } catch (err) {
      console.error('Error marking complete:', err);
    }
  };

  // Manual refresh
  const handleRefreshQueue = () => {
    fetchPatients();
  };

  return (
    <div className="view-container">
      <div className="consultation-section">
        <h2>Doctor View | Consultation Queue</h2>

        <div className="current-patient">
          <h3>Current Patient</h3>
          {currentPatient ? (
            <div className="patient-card">
              <div className="patient-info">
                <p><span>Token No.:</span> {currentPatient.tokenNo || '—'}</p>
                <p><span>Name:</span> {currentPatient.name}</p>
                <p><span>Age:</span> {currentPatient.age}</p>
                <p><span>Purpose:</span> {currentPatient.purpose}</p>
              </div>
              <button className="btn-complete" onClick={handleCompletePatient}>
                Mark as Completed
              </button>
            </div>
          ) : (
            <div className="no-patient">No patients in consultation queue.</div>
          )}
        </div>

        <div className="queue-list">
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
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr
                    key={patient._id || index}
                    className={
                      patient.status === 'In Consultation' ? 'highlight-row' : ''
                    }
                  >
                    <td>{patient.tokenNo || index + 1}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.purpose}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          patient.status === 'In Consultation'
                            ? 'in-consultation'
                            : patient.status === 'Done'
                            ? 'done'
                            : 'waiting'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      {patient.status === 'Waiting' && (
                        <button
                          className="btn-call"
                          onClick={() => handleCallPatient(patient)}
                        >
                          Call
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="6">No patients in queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;
