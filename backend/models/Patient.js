const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  insurance: { type: String, required: true },
});

// Virtual field for age calculation
patientSchema.virtual("age").get(function () {
  const today = new Date();
  const birthDate = this.dob;
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
