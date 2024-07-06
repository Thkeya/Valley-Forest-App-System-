import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Patients.css";
import PatientCard from "./PatientCard";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    dob: "",
    gender: "",
    insurance: "",
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchPatients = useCallback(() => {
    axios
      .get("http://localhost:4000/patients")
      .then((response) => {
        const patientsData = response.data.map((patient) => ({
          ...patient,
          dob: new Date(patient.dob).toISOString(), // Convert date string to UTC format
          age: calculateAge(patient.dob), // Calculate age based on dob
        }));
        setPatients(patientsData);
      })
      .catch((error) => console.error("Error fetching patients:", error));
  }, []); // Empty dependency array because fetchPatients does not depend on any props or state

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]); // Include fetchPatients in the dependency array of useEffect

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

  const handleAddPatient = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4000/patients/add", newPatient)
      .then((response) => {
        console.log(response.data);
        fetchPatients(); // Refresh patients list after adding new patient
        setNewPatient({
          name: "",
          dob: "",
          gender: "",
          insurance: "",
        });
      })
      .catch((error) => console.error("Error adding patient:", error));
  };

  const handleUpdatePatient = (id, e) => {
    e.preventDefault();

    axios
      .post(`http://localhost:4000/patients/update/${id}`, selectedPatient)
      .then((response) => {
        console.log("Patient updated:", response.data);
        fetchPatients(); // Refresh patients list after updating patient
        setSelectedPatient(null);
        setIsEditMode(false);
      })
      .catch((error) => console.error("Error updating patient:", error));
  };

  const handleDeletePatient = (id) => {
    axios
      .delete(`http://localhost:4000/patients/delete/${id}`)
      .then((response) => {
        console.log(response.data);
        setPatients(patients.filter((patient) => patient._id !== id));
      })
      .catch((error) => console.error("Error deleting patient:", error));
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsEditMode(true);
  };

  return (
    <div className="patient-main">
      <div className="form-sections">
        <h4>{isEditMode ? "Edit Patient" : "Add New Patient"}</h4>
        <form
          onSubmit={
            isEditMode
              ? (e) => handleUpdatePatient(selectedPatient._id, e)
              : handleAddPatient
          }
        >
          <label>Name: </label>
          <input
            type="text"
            value={isEditMode ? selectedPatient.name : newPatient.name}
            onChange={(e) =>
              isEditMode
                ? setSelectedPatient({
                    ...selectedPatient,
                    name: e.target.value,
                  })
                : setNewPatient({
                    ...newPatient,
                    name: e.target.value,
                  })
            }
          />
          <br />
          <label>DOB: </label>
          <input
            type="date"
            value={isEditMode ? selectedPatient.dob : newPatient.dob}
            onChange={(e) =>
              isEditMode
                ? setSelectedPatient({
                    ...selectedPatient,
                    dob: e.target.value,
                  })
                : setNewPatient({
                    ...newPatient,
                    dob: e.target.value,
                  })
            }
          />
          <br />
          <label>Gender: </label>
          <input
            type="text"
            value={isEditMode ? selectedPatient.gender : newPatient.gender}
            onChange={(e) =>
              isEditMode
                ? setSelectedPatient({
                    ...selectedPatient,
                    gender: e.target.value,
                  })
                : setNewPatient({
                    ...newPatient,
                    gender: e.target.value,
                  })
            }
          />
          <br />
          <label>Insurance: </label>
          <input
            type="text"
            value={
              isEditMode ? selectedPatient.insurance : newPatient.insurance
            }
            onChange={(e) =>
              isEditMode
                ? setSelectedPatient({
                    ...selectedPatient,
                    insurance: e.target.value,
                  })
                : setNewPatient({
                    ...newPatient,
                    insurance: e.target.value,
                  })
            }
          />
          <br />
          <button type="submit">
            {isEditMode ? "Update Patient" : "Add Patient"}
          </button>
        </form>
      </div>

      <div className="patients-section">
        <h3 style={{ textAlign: "center" }}>Patients ({patients.length})</h3>

        <div className="patient-list">
          {patients.map((patient) => (
            <PatientCard
              key={patient._id}
              patient={patient}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
