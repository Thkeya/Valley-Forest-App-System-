import React from "react";

const AppointmentCard = ({ appointment, onEdit, onDelete }) => {
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

  return (
    <div className="appointment-card">
      <p>
        <span>Patient:</span> {appointment.patientName}
      </p>
      <p>
        <span>Doctor:</span> {appointment.doctorName}
      </p>
      <p>
        <span>Date:</span> {formatDate(appointment.date)}
      </p>
      <p>
        <span>Time:</span> {appointment.time} {/* Display the time field */}
      </p>
      <div className="btn-container">
        <button onClick={() => onEdit(appointment)}>Edit</button>
        <button onClick={() => onDelete(appointment._id)}>Delete</button>
      </div>
    </div>
  );
};

export default AppointmentCard;
