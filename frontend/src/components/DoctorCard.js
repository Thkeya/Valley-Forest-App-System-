import React from "react";

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
  return (
    <div className="doctor-card">
      <p>
        <span>Doctor: </span>
        {doctor.name}
      </p>
      <p>
        <span>Specialty: </span>
        {doctor.specialty}
      </p>
      <div className="btn-container">
        <button onClick={() => onEdit(doctor)}>Edit</button>
        <button onClick={() => onDelete(doctor._id)}>Delete</button>
      </div>
    </div>
  );
};

export default DoctorCard;
