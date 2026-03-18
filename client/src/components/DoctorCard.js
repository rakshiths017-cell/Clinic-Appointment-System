import React from "react";

export default function DoctorCard({ doctor, onSelectDoctor, onSelectTime, selectedTime }) {
  return (
    <div className="doctor-card" onClick={() => onSelectDoctor(doctor._id)}>
      <h2>{doctor.name}</h2>
      <p>{doctor.specialty}</p>
      <div className="time-slot-container">
        {doctor.availableSlots.map((slot, index) => (
          <span
            key={index}
            className={`time-slot ${selectedTime === slot ? "selected-slot" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTime(slot);
            }}
          >
            {slot}
          </span>
        ))}
      </div>
    </div>
  );
}