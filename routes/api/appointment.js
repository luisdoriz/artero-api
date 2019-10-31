const express = require("express");
const router = express.Router();
const passport = require("passport");

const riskIndex = require('../../constants/cardiovascularRisk');
const Appointment = require("../../models/Appointment");
const Profile = require("../../models/Profile");

calculateRisk = (patient, systolicPressure, diastolicPressure) => {
  const risk = getAgeRisk(patient) + getDiabetesRisk(patient.diabetes) + getSmokerRisk(patient.smoke) + getCholesterolRisk(patient.cholesterol, patient.sex) + getHdlCholesterolRisk(patient.hdlCholesterol, patient.sex) + getBloodPressure(patient.sex, systolicPressure, diastolicPressure);
  return getPercentage(risk, patient.sex);
}

getAgeRisk = (patient) => {
  const birthDate = new Date(patient.birthday);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (patient.sex) {
    if(age<34) return -1;
    if(age>35 && age<39) return 0;
    if(age>40 && age<44) return 1;
    if(age>45 && age<49) return 2;
    if(age>50 && age<54) return 3;
    if(age>55 && age<59) return 4;
    if(age>60 && age<64) return 5;
    if(age>65 && age<69) return 6;
    if(age>70 && age<74) return 7;
  } else {
    if(age<34) return -9;
    if(age>35 && age<39) return -4;
    if(age>40 && age<44) return 0;
    if(age>45 && age<49) return 3;
    if(age>50 && age<54) return 6;
    if(age>55 && age<59) return 7;
    if(age>60 && age<64) return 8;
    if(age>65 && age<69) return 8;
    if(age>70 && age<74) return 8;
  }
}

getDiabetesRisk = (diabetes) => {
  if (diabetes = 0) return 0;
  return 2;
}

getSmokerRisk = (smoke) => {
  if (smoke) return 2;
  return 0;
}

getCholesterolRisk = (cholesterol, sex) => {
  if (sex && cholesterol<160) return -3;
  if (!sex && cholesterol<160) return -2;
  if (cholesterol>160 && cholesterol<199) return 0;
  if (cholesterol>200 && cholesterol<239) return 1;
  if (cholesterol>240 && cholesterol<280) {
    if (sex) return 2;
    return 1;
  };
  if (cholesterol>280) return 3;
}

getHdlCholesterolRisk = (cholesterol, sex) => {
  if (cholesterol<35) {
    if(sex) return 2;
    return 5;
  }
  if (cholesterol<44 && cholesterol>35) {
    if(sex) return 1;
    return 2;
  };
  if (cholesterol<49 && cholesterol>45) {
    if(sex) return 0;
    return 1;
  };
  if (cholesterol>50 && cholesterol<59) return 0;
  if (cholesterol>60) {
    if(sex) return -2;
    return -3;
  };
}

getBloodPressure = (sex, systolicPressure, diastolicPressure) => {
  if (sex) return getMaleBloodPressure(systolicPressure, diastolicPressure);
  return getFemaleBloodPressure(systolicPressure, diastolicPressure);
}

getMaleBloodPressure = (systolicPressure, diastolicPressure) => {
  if ( systolicPressure <=129) {
    if(diastolicPressure <=84) return 0;
    if(diastolicPressure <=89) return 1;
    if(diastolicPressure <=99) return 2;
    return 3;
  } 
  if ( systolicPressure <=139) {
    if(diastolicPressure <=89) return 1;
    if(diastolicPressure <=99) return 2;
    return 3;
  } 
  if ( systolicPressure <=159) {
    if(diastolicPressure <=99) return 2;
    return 3;
  } 
  return 3;
}

getFemaleBloodPressure = (systolicPressure, diastolicPressure) => {
  if ( systolicPressure <=120) {
    if(diastolicPressure <=80) return -3;
    if(diastolicPressure <=89) return 0;
    if(diastolicPressure <=99) return 2;
    return 3;
  } 
  if ( systolicPressure <=139) {
    if(diastolicPressure <=89) return 0;
    if(diastolicPressure <=99) return 2;
    return 3;
  } 
  if ( systolicPressure <=159) {
    if(diastolicPressure <=99) return 2;
    return 3;
  } 
  return 3;
}

 getPercentage = (points, sex) => {
  if(sex) return riskIndex[points+2].male;
  return riskIndex[points+2].female;
}

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findById(req.body.patientId).then(patient => {
      const icm = req.body.wheight / (patient.height * patient.height);
      const cr = calculateRisk(patient, req.body.systolicPressure, req.body.diastolicPressure);

      const newAppointment = new Appointment({
        patient: req.body.patientId,
        doctor: req.user.id,
        systolicPressure: req.body.systolicPressure,
        diastolicPressure: req.body.diastolicPressure,
        wheight: req.body.wheight,
        icm,
        cr,
      });
      newAppointment.save().then((appointment) =>{
         res.status(200).json(appointment)}).catch(err =>
        res.status(404).json({ message: "An error ocurred when tried to save appointment" })
      );
    }).catch(err => res.status(404).json({ message: "An error ocurred when tried to find the patient" }));
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Appointment.find({ patient: req.params.id }).then((appointments) => res.status(200).json(appointments)).catch(err =>
      res.status(404).json({ message: "No appointments" })
    );
  }
);

module.exports = router;
