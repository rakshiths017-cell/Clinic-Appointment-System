import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5000/api";

export default function AppointmentForm({ doctors, selectedDoctor, setSelectedDoctor, time, setTime, availableSlots }) {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    setTime("");
  }, [selectedDoctor, setTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token || !user) {
      setError("You must be logged in to book an appointment.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (user.role !== 'patient') {
      setError("Only patients can book appointments. Please log in to a patient account.");
      return;
    }

    if (!selectedDoctor || !time || !date) {
      setError("Please fill out all fields!");
      return;
    }

    const appointmentDetails = {
      doctorId: selectedDoctor,
      date,
      time,
    };

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token 
        },
        body: JSON.stringify(appointmentDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      alert(`✅ Appointment booked successfully!`);
      
      setDate("");
      setTime("");
      setSelectedDoctor("");
      
      navigate('/dashboard');

    } catch (error) {
      console.error("Booking error:", error);
      setError(`Error: ${error.message}`);
    }
  };

  return (
    // The <form> tag is now here
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} required>
        <option value="">Select Doctor</option>
        {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>)}
      </select>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

      <select value={time} onChange={e => setTime(e.target.value)} required disabled={!selectedDoctor}>
        <option value="">Select Time</option>
        {availableSlots.map((slot, idx) => <option key={idx} value={slot}>{slot}</option>)}
      </select>

      <button type="submit" className="btn">Book Appointment</button>
    </form>
  );
}