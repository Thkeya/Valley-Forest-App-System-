import React from "react";

const PatientCard = ({ patient, onEdit, onDelete }) => {
  // Helper function to format date as Month, Date, Year
  const formatDate = (date) => {
    if (!date) return "";
    const utcDate = new Date(date);
    return utcDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC", // Ensure UTC time zone
    });
  };

  // Function to calculate age based on dob
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="patient-card">
      <h4>{patient.name}</h4>
      <p>DOB: {formatDate(patient.dob)}</p>
      <p>Age: {calculateAge(patient.dob)}</p>
      <p>Gender: {patient.gender}</p>
      <p>Insurance: {patient.insurance}</p>
      <div className="btn-container" style={{ width: "100%" }}>
        <button onClick={() => onEdit(patient)}>Edit</button>
        <button onClick={() => onDelete(patient._id)}>Delete</button>
      </div>
    </div>
  );
};

export default PatientCard;
