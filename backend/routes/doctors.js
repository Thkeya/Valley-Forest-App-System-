const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const cors = require("./cors");

// Get all doctors
router
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res) => {
    Doctor.find()
      .then((doctors) => res.json(doctors))
      .catch((err) => res.status(400).json("Error: " + err));
  });

// Add new doctor
router.route("/add").post(cors.corsWithOptions, (req, res) => {
  const { name, specialty } = req.body;

  const newDoctor = new Doctor({ name, specialty });

  newDoctor
    .save()
    // Return the savedDoctor object
    .then((savedDoctor) => res.json(savedDoctor))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Update doctor data
router.route("/update/:id").post(cors.corsWithOptions, (req, res) => {
  Doctor.findById(req.params.id)
    .then((doctor) => {
      if (!doctor) {
        return res.status(404).json("Doctor not found");
      }

      doctor.name = req.body.name;
      doctor.specialty = req.body.specialty;

      doctor
        .save()
        .then(() => res.json("Doctor updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Delete doctor by ID
router.route("/delete/:id").delete(cors.corsWithOptions, (req, res) => {
  Doctor.findByIdAndDelete(req.params.id)
    .then((doctor) => {
      if (!doctor) {
        return res.status(404).json("Doctor not found");
      }
      res.json("Doctor deleted!");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
