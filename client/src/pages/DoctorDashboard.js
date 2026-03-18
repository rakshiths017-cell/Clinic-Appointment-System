import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrescriptionForm from '../components/PrescriptionForm';
import BillForm from '../components/BillForm';

const API_URL = "http://localhost:5000/api";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchDoctorAppointments = async () => {
    try {
      const headers = { "x-auth-token": token };
      const response = await fetch(`${API_URL}/appointments/doctor`, { headers });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch appointments');
      }

      const apptData = await response.json();
      setAppointments(apptData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert(`Could not load appointments: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user || user.role !== 'doctor') {
      navigate('/login');
      return;
    }
    fetchDoctorAppointments();
  }, [token, user, navigate]);

  const handleOpenPrescription = (appt) => {
    setSelectedAppt(appt);
    setShowPrescriptionForm(true);
    setShowBillForm(false);
  };

  const handleOpenBill = (appt) => {
    setSelectedAppt(appt);
    setShowBillForm(true);
    setShowPrescriptionForm(false);
  };

  const handleComplete = async (apptId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${apptId}/complete`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark as complete');
      }

      // Refresh the appointment list to show the new status
      fetchDoctorAppointments();

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="container"><h1>Loading Doctor Portal...</h1></div>;
  }

  return (
    <div className="container">
      <h1>Doctor Portal</h1>

      <div className="dashboard-section">
        <h2>Your Appointments</h2>
        {appointments.length === 0 ? <p>No appointments found.</p> : (
          appointments.map(app => (
            <div key={app._id} className="card">
              <h3>{app.date} at {app.time}</h3>
              <p><strong>Patient:</strong> {app.patientName} ({app.patientEmail})</p>
              <p><strong>Status:</strong> <span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span></p>
              
              <div className="card-actions">
                {app.status === 'Upcoming' && (
                  <button className="btn btn-success" onClick={() => handleComplete(app._id)}>
                    Mark as Complete
                  </button>
                )}
                
                <button 
                  className="btn" 
                  onClick={() => handleOpenPrescription(app)}
                  disabled={app.status !== 'Completed'}
                >
                  Add Prescription
                </button>
                
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleOpenBill(app)}
                  disabled={app.status !== 'Completed'}
                >
                  Create Bill
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals for Forms */}
      {showPrescriptionForm && selectedAppt && (
        <PrescriptionForm
          appointment={selectedAppt}
          token={token}
          onClose={() => setShowPrescriptionForm(false)}
        />
      )}

      {showBillForm && selectedAppt && (
        <BillForm
          appointment={selectedAppt}
          token={token}
          onClose={() => setShowBillForm(false)}
        />
      )}
    </div>
  );
}