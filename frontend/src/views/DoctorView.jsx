import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/patients';

const DoctorView = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch the current patient list (same as Front Desk)
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

  // Function to handle status updates (Start Consultation/Mark Done)
  const updateStatus = async (patientId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/${patientId}`, { status: newStatus });
      // Refresh the list to show the updated status immediately
      fetchPatients();
    } catch (error) {
      console.error(`Error updating status for ID ${patientId}:`, error);
      alert('Failed to update patient status.');
    }
  };

  // Filter patients: prioritize Waiting and In Consultation at the top
  const waitingConsultingPatients = patients.filter(
    (p) => p.status === 'Waiting' || p.status === 'In Consultation'
  );
  const donePatients = patients.filter((p) => p.status === 'Done');

  return (
    <div className="view-container">
      <h2>Doctor View | Consultation Queue</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Patients in Queue / Consultation ({waitingConsultingPatients.length} Total)</h3>
        <button onClick={fetchPatients} disabled={loading} style={{ padding: '8px 15px' }}>
          {loading ? 'Refreshing...' : 'Manual Refresh Queue'}
        </button>
      </div>

      <table className="patient-table">
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
          {waitingConsultingPatients.length > 0 ? (
            waitingConsultingPatients.map((patient) => (
              <tr key={patient.id}>
                <td>**{patient.token_number}**</td>
                <td>{patient.name}</td>
                <td>{patient.age || 'N/A'}</td>
                <td>{patient.purpose}</td>
                <td className={`status-${patient.status.replace(/\s/g, '')}`}>{patient.status}</td>
                <td>
                  {patient.status === 'Waiting' && (
                    <button 
                      onClick={() => updateStatus(patient.id, 'In Consultation')}
                      style={{ padding: '8px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                    >
                      Start Consultation
                    </button>
                  )}
                  {patient.status === 'In Consultation' && (
                    <button 
                      onClick={() => updateStatus(patient.id, 'Done')}
                      style={{ padding: '8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Mark Done
                    </button>
                  )}
                  {/* No action needed if status is 'Done' */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No patients are currently Waiting or In Consultation.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Optionally show done patients below */}
      <h3 style={{ marginTop: '30px' }}>Completed Today ({donePatients.length})</h3>
       <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table className="patient-table" style={{ fontSize: '0.9em' }}>
          <tbody>
            {donePatients.map((patient) => (
              <tr key={patient.id} style={{ opacity: 0.7 }}>
                <td>{patient.token_number}</td>
                <td>{patient.name}</td>
                <td>{patient.purpose}</td>
                <td className={`status-${patient.status.replace(/\s/g, '')}`}>{patient.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorView;