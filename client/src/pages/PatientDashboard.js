import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5000/api";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Function to fetch all data
  const fetchData = async () => {
    try {
      const headers = { "x-auth-token": token };
      
      const [apptRes, presRes, billRes] = await Promise.all([
        fetch(`${API_URL}/appointments/my`, { headers }),
        fetch(`${API_URL}/prescriptions/my`, { headers }),
        fetch(`${API_URL}/bills/my`, { headers })
      ]);

      if (!apptRes.ok || !presRes.ok || !billRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const apptData = await apptRes.json();
      const presData = await presRes.json();
      const billData = await billRes.json();

      setAppointments(apptData);
      setPrescriptions(presData);
      setBills(billData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Could not load your data.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on load
  useEffect(() => {
    if (!token || !user || user.role !== 'patient') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, user, navigate]);

  // Handle Bill Payment
  const handlePayBill = async (billId) => {
    if (!window.confirm("Are you sure you want to pay this bill?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/bills/${billId}/pay`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      alert('Payment successful!');
      fetchData(); // Re-fetch all data to show the updated "Paid" status
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="container"><h1>Loading Dashboard...</h1></div>;
  }

  return (
    <div className="container">
      <h1>My Dashboard</h1>

      <div className="dashboard-section">
        <h2>My Appointments</h2>
        {appointments.length === 0 ? <p>No appointments found.</p> : (
          appointments.map(app => (
            <div key={app._id} className="card">
              {/* === BUG FIX HERE === */}
              <h3>Appointment with {app.doctor?.name || 'Unknown Doctor'}</h3>
              <p><strong>Specialty:</strong> {app.doctor?.specialty || 'N/A'}</p>
              <p><strong>Date:</strong> {app.date} at {app.time}</p>
              <p><strong>Status:</strong> <span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span></p>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-section">
        <h2>My Prescriptions</h2>
        {prescriptions.length === 0 ? <p>No prescriptions found.</p> : (
          prescriptions.map(pres => (
            <div key={pres._id} className="card">
              <h3>{pres.medication}</h3>
              {/* === BUG FIX HERE === */}
              <p><strong>Doctor:</strong> {pres.doctor?.name || 'Unknown Doctor'} ({pres.doctor?.specialty || 'N/A'})</p>
              <p><strong>Dosage:</strong> {pres.dosage || 'N/A'}</p>
              <p><strong>Notes:</strong> {pres.notes || 'N/A'}</p>
              <p><strong>Date Issued:</strong> {new Date(pres.dateIssued).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-section">
        <h2>My Bills</h2>
        {bills.length === 0 ? <p>No bills found.</p> : (
          bills.map(bill => (
            <div key={bill._id} className="card">
              {/* === BUG FIX HERE === */}
              <h3>Bill from {bill.doctor?.name || 'Unknown Doctor'}</h3>
              <p><strong>Amount:</strong> ${bill.amount}</p>
              <p><strong>Status:</strong> <span className={`status status-${bill.status.toLowerCase()}`}>{bill.status}</span></p>
              <p><strong>Date Issued:</strong> {new Date(bill.dateIssued).toLocaleDateString()}</p>
              {bill.status === 'Pending' && (
                <div className="card-actions">
                  <button className="btn btn-success" onClick={() => handlePayBill(bill._id)}>
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}