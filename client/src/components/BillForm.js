import React, { useState } from 'react';

const API_URL = "http://localhost:5000/api";

export default function BillForm({ appointment, token, onClose }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          amount: Number(amount)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create bill');
      }

      alert('Bill created successfully!');
      onClose();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Create Bill</h2>
          <p>For: <strong>{appointment.patientName}</strong> ({appointment.date})</p>
          
          <input type="number" placeholder="Amount ($)" value={amount} onChange={e => setAmount(e.target.value)} required />
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Create Bill</button>
          </div>
        </form>
      </div>
    </div>
  );
}