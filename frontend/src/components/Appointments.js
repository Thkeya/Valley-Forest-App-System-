import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentCard from "./AppointmentCard";
import "./Appointment.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/appointments")
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  const handleAddAppointment = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4000/appointments/add", newAppointment)
      .then((response) => {
        console.log(response.data);
        setAppointments([...appointments, response.data]);
        setNewAppointment({
          patientName: "",
          doctorName: "",
          date: "",
          time: "",
        });
      })
      .catch((error) => console.error("Error adding appointment:", error));
  };

  const handleUpdateAppointment = (id, e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:4000/appointments/update/${id}`,
        selectedAppointment
      )
      .then((response) => {
        console.log(response.data);
        const updateApp = {
          ...selectedAppointment,
          _id: id,
        };
        setAppointments(
          appointments.map((appointment) =>
            appointment._id === id ? updateApp : appointment
          )
        );
        setSelectedAppointment(null);
        setIsEditMode(false); // Switch back to Add mode
      })
      .catch((error) => console.error("Error updating appointment:", error));
  };

  const handleDeleteAppointment = (id) => {
    axios
      .delete(`http://localhost:4000/appointments/delete/${id}`)
      .then((response) => {
        console.log(response.data);
        setAppointments(
          appointments.filter((appointment) => appointment._id !== id)
        );
      })
      .catch((error) => console.error("Error deleting appointment:", error));
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true); // Switch to Edit mode
  };

  // Generate time options from 8:00 AM to 6:00 PM with 15-minute intervals
  const generateTimeOptions = () => {
    let startTime = new Date();
    startTime.setHours(8, 0, 0); // Start at 8:00 AM
    const endTime = new Date();
    endTime.setHours(18, 0, 0); // End at 6:00 PM

    const options = [];
    while (startTime <= endTime) {
      const timeStr = startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      options.push(
        <option key={timeStr} value={timeStr}>
          {timeStr}
        </option>
      );
      startTime.setMinutes(startTime.getMinutes() + 15); // Increment by 15 minutes
    }

    return options;
  };

  return (
    <div className="flex-row" style={{ width: "100%" }}>
      <div className="flex-column">
        <div className="add-form">
          <h4>{isEditMode ? "Edit Appointment" : "Add New Appointment"}</h4>
          <form
            className="appointment-form"
            onSubmit={
              isEditMode
                ? (e) => handleUpdateAppointment(selectedAppointment._id, e)
                : handleAddAppointment
            }
          >
            <label>Patient Name:</label>
            <input
              type="text"
              value={
                isEditMode
                  ? selectedAppointment.patientName
                  : newAppointment.patientName
              }
              onChange={(e) =>
                isEditMode
                  ? setSelectedAppointment({
                      ...selectedAppointment,
                      patientName: e.target.value,
                    })
                  : setNewAppointment({
                      ...newAppointment,
                      patientName: e.target.value,
                    })
              }
            />
            <label>Doctor Name:</label>
            <input
              type="text"
              value={
                isEditMode
                  ? selectedAppointment.doctorName
                  : newAppointment.doctorName
              }
              onChange={(e) =>
                isEditMode
                  ? setSelectedAppointment({
                      ...selectedAppointment,
                      doctorName: e.target.value,
                    })
                  : setNewAppointment({
                      ...newAppointment,
                      doctorName: e.target.value,
                    })
              }
            />
            <label>Date:</label>
            <input
              type="date"
              value={
                isEditMode ? selectedAppointment.date : newAppointment.date
              }
              onChange={(e) =>
                isEditMode
                  ? setSelectedAppointment({
                      ...selectedAppointment,
                      date: e.target.value,
                    })
                  : setNewAppointment({
                      ...newAppointment,
                      date: e.target.value,
                    })
              }
            />
            <label>Time:</label>
            <select
              value={
                isEditMode ? selectedAppointment.time : newAppointment.time
              }
              onChange={(e) =>
                isEditMode
                  ? setSelectedAppointment({
                      ...selectedAppointment,
                      time: e.target.value,
                    })
                  : setNewAppointment({
                      ...newAppointment,
                      time: e.target.value,
                    })
              }
            >
              <option value="">Select Time</option>
              {generateTimeOptions()}
            </select>
            <button type="submit">
              {isEditMode ? "Update Appointment" : "Add Appointment"}
            </button>
          </form>
        </div>
      </div>
      <div className="appointments">
        <h3>Appointments ({appointments.length})</h3>
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
