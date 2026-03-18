import React, { useState } from 'react';

const API_URL = "http://localhost:5000/api";

export default function PrescriptionForm({ appointment, token, onClose }) {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          medication,
          dosage,
          notes
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create prescription');
      }

      alert('Prescription created successfully!');
      onClose();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Add Prescription</h2>
          <p>For: <strong>{appointment.patientName}</strong> ({appointment.date})</p>
          
          <input placeholder="Medication" value={medication} onChange={e => setMedication(e.target.value)} required />
          <input placeholder="Dosage (e.g., 10mg, twice a day)" value={dosage} onChange={e => setDosage(e.target.value)} />
          <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Save Prescription</button>
          </div>
        </form>
      </div>
    </div>
  );
}