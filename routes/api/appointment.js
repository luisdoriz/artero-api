const express = require("express");
const router = express.Router();
const passport = require("passport");

const riskIndex = require('../../constants/cardiovascularRisk');
const Appointment = require("../../models/Appointment");
const Profile = require("../../models/Profile");
const Medicine = require("../../models/Medicine");

calculateRisk = (patient, systolicPressure, diastolicPressure) => {
  const risk = getAgeRisk(patient) + getDiabetesRisk(patient.diabetes) + getSmokerRisk(patient.smoke) + getCholesterolRisk(patient.cholesterol, patient.sex) + getHdlCholesterolRisk(patient.hdlCholesterol, patient.sex) + getBloodPressure(patient.sex, systolicPressure, diastolicPressure);
  return getPercentage(risk, patient.sex);
}

getAgeRisk = (patient) => {
  const birthDate = new Date(patient.birthday);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (patient.sex) {
    if (age <= 34) return -1;
    if (age >= 35 && age <= 39) return 0;
    if (age >= 40 && age <= 44) return 1;
    if (age >= 45 && age <= 49) return 2;
    if (age >= 50 && age <= 54) return 3;
    if (age >= 55 && age <= 59) return 4;
    if (age >= 60 && age <= 64) return 5;
    if (age >= 65 && age <= 69) return 6;
    if (age >= 70 && age <= 74) return 7;
  } else {
    if (age <= 34) return -9;
    if (age >= 35 && age <= 39) return -4;
    if (age >= 40 && age <= 44) return 0;
    if (age >= 45 && age <= 49) return 3;
    if (age >= 50 && age <= 54) return 6;
    if (age >= 55 && age <= 59) return 7;
    if (age >= 60 && age <= 64) return 8;
    if (age >= 65 && age <= 69) return 8;
    if (age >= 70 && age <= 74) return 8;
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
  if (sex && cholesterol < 160) return -3;
  if (!sex && cholesterol < 160) return -2;
  if (cholesterol > 160 && cholesterol < 199) return 0;
  if (cholesterol > 200 && cholesterol < 239) return 1;
  if (cholesterol > 240 && cholesterol < 280) {
    if (sex) return 2;
    return 1;
  };
  if (cholesterol > 280) return 3;
  return 0;
}

getHdlCholesterolRisk = (cholesterol, sex) => {
  if (cholesterol < 35) {
    if (sex) return 2;
    return 5;
  }
  if (cholesterol < 44 && cholesterol > 35) {
    if (sex) return 1;
    return 2;
  };
  if (cholesterol < 49 && cholesterol > 45) {
    if (sex) return 0;
    return 1;
  };
  if (cholesterol > 50 && cholesterol < 59) return 0;
  if (cholesterol > 60) {
    if (sex) return -2;
    return -3;
  };
  return 0;
}

getBloodPressure = (sex, systolicPressure, diastolicPressure) => {
  if (sex) return getMaleBloodPressure(systolicPressure, diastolicPressure);
  return getFemaleBloodPressure(systolicPressure, diastolicPressure);
}

getMaleBloodPressure = (systolicPressure, diastolicPressure) => {
  if (systolicPressure <= 129) {
    if (diastolicPressure <= 84) return 0;
    if (diastolicPressure <= 89) return 1;
    if (diastolicPressure <= 99) return 2;
    return 3;
  }
  if (systolicPressure <= 139) {
    if (diastolicPressure <= 89) return 1;
    if (diastolicPressure <= 99) return 2;
    return 3;
  }
  if (systolicPressure <= 159) {
    if (diastolicPressure <= 99) return 2;
    return 3;
  }
  return 3;
}

getFemaleBloodPressure = (systolicPressure, diastolicPressure) => {
  if (systolicPressure <= 120) {
    if (diastolicPressure <= 80) return -3;
    if (diastolicPressure <= 89) return 0;
    if (diastolicPressure <= 99) return 2;
    return 3;
  }
  if (systolicPressure <= 139) {
    if (diastolicPressure <= 89) return 0;
    if (diastolicPressure <= 99) return 2;
    return 3;
  }
  if (systolicPressure <= 159) {
    if (diastolicPressure <= 99) return 2;
    return 3;
  }
  return 3;
}

getPercentage = (points, sex) => {
  if (sex) return riskIndex[points + 2].male;
  return riskIndex[points + 2].female;
}

getHipertensionLevel = (s, d, birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (s >= 160 || d >= 100) {
    return 'Etapa 2';
  }
  if (
    (s > 140 && s < 160 && age < 60)
    || 
    (s > 150 && s < 160 && age >= 60) 
    || (d < 100 && d > 89)) {
    return 'Etapa 1';
  }
  return 'Normal'
}

findMed = (name, medicines) => (
  medicines.find(med => {
    return med.name == name;
  }))

getMedicines = (medicines, patient, hipertension) => {
  let medicinesResult = [];

  if (hipertension == 'Etapa 2') {
    if ((patient.hearthDisease || patient.migraine || patient.anxiety) && !patient.depression && !patient.cocaineAddiction && !patient.venousInsufficiency && !patient.cough && !patient.bronchitis)
      medicinesResult.push(findMed('Beta Bloqueador', medicines));
    if (patient.cardioInsufficiency && !patient.prostaticHyperplasia && !patient.goutDisease) medicinesResult.push(findMed('Diuretico Tiazidico', medicines));
    if (
      patient.cardioInsufficiency &&
      patient.diabetes &&
      patient.renalDisease &&
      patient.venousInsufficiency &&
      patient.goutDisease &&
      patient.depression
    ) medicinesResult.push(findMed('IECA', medicines));
    if (patient.renalDisease && !patient.prostaticHyperplasia) medicinesResult.push(findMed('Diruetico ASA', medicines));
    if (patient.prostaticHyperplasia && patient.diabetes) medicinesResult.push(findMed('Alfa Bloqueador', medicines));
    if (patient.pregnancy) {
      medicinesResult.push(findMed('Metildopa', medicines));
      medicinesResult.push(findMed('Labetolol', medicines));
    }
    if (patient.cocaineAddiction) medicinesResult.push(findMed('Nitroglicerina', medicines));
    if (patient.cough || patient.bronchitis || patient.venousInsufficiency || patient.goutDisease || patient.depression || med.length == 0) medicinesResult.push(findMed('ARA II', medicines));
  } else {
    if (patient.cardioInsufficiency) medicinesResult.push(findMed('Diuretico Tiazidico', medicines));
    if (patient.diabetes == 2 || patient.renalDisease) medicinesResult.push(findMed('IECA', medicines));
    if (patient.pregnancy) medicinesResult.push(findMed('Labetolol', medicines));

    if (patient.goutDisease || patient.depression || medicinesResult.length == 0) medicinesResult.push(findMed('ARA II', medicines));
  }
  rtn = medicinesResult.map(med => ({ medicine: med._id }));
  return rtn;
}
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findById(req.body.patientId).then(patient => {
      const icm = req.body.wheight / (patient.height/100 * patient.height/100);
      const cr = calculateRisk(patient, req.body.systolicPressure, req.body.diastolicPressure);
      const hipertension = getHipertensionLevel(req.body.systolicPressure, req.body.diastolicPressure, patient.birthday);
      Medicine.find().then(meds => {
        const medicines = hipertension == 'Normal' ? [] : getMedicines(meds, patient, hipertension);
        const newAppointment = new Appointment({
          patient: req.body.patientId,
          doctor: req.user.id,
          systolicPressure: req.body.systolicPressure,
          diastolicPressure: req.body.diastolicPressure,
          wheight: req.body.wheight,
          medicines,
          icm,
          cr,
          hipertension
        });
        newAppointment.save().then((appointment) => {
          res.status(200).json(appointment)
        }).catch(err =>
          res.status(404).json({ message: "An error ocurred when tried to save appointment" })
        );
      });

    }).catch(err => res.status(404).json({ message: "An error ocurred when tried to find the patient" }));
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Appointment.find({ patient: req.params.id }).populate('medicines.medicine', ['name']).then((appointments) => res.status(200).json(appointments)).catch(err =>
      res.status(404).json({ message: "No appointments" })
    );
  }
);

module.exports = router;
