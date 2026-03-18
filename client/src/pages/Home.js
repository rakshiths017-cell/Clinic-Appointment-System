import React, { useEffect, useState } from "react";
import "../index.css"; 
import DoctorCard from "../components/DoctorCard";
import AppointmentForm from "../components/AppointmentForm";

// !!! IMPORTANT !!!
// Find a real image URL of a doctor or clinic and paste it here
// Example from unsplash: "https://images.unsplash.com/photo-1551191834-6e1b9b2a5c96?q=80&w=1740"
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1856";

const API_URL = "http://localhost:5000/api";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [time, setTime] = useState("");

  // FETCH DOCTORS FROM BACKEND
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors`);
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchDoctors();
  }, []);

  const selectedDoctorObj = doctors.find(d => d._id === selectedDoctor);
  const availableSlots = selectedDoctorObj ? selectedDoctorObj.availableSlots : [];

  return (
    <>
      <div className="container">
        <div className="hero">
          <div className="hero-text">
            <h1>Expert Care, Always Here.</h1>
            <p>Your health is our priority. Book an appointment with our specialist doctors today.</p>
          </div>
          <div className="hero-image">
            <img src={HERO_IMAGE_URL} alt="Friendly doctor" />
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="form-container">
          <h2>Book Your Appointment</h2>
          <AppointmentForm
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            setSelectedDoctor={setSelectedDoctor}
            time={time}
            setTime={setTime}
            availableSlots={availableSlots}
          />
        </div>

        <div className="dashboard-section">
          <h2>Our Doctors</h2>
          <div className="doctor-grid">
            {doctors.map(d => (
              <DoctorCard
                key={d._id}
                doctor={d}
                selectedTime={selectedDoctor === d._id ? time : ""}
                onSelectDoctor={(id) => {
                  setSelectedDoctor(id);
                  setTime(""); 
                }}
                onSelectTime={(slot) => {
                  setSelectedDoctor(d._id); 
                  setTime(slot);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}