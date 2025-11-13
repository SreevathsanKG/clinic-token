const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// 1. Front Desk: Add a new patient (POST /api/patients)
router.post('/add', patientController.addPatient);

// 2. Doctor/Front Desk: Get all today's patients (GET /api/patients)
router.get('/getAll/Today', patientController.getAllPatients);

// 3. Doctor: Update patient status (PUT /api/patients/:id)
router.put('/put/status/:id', patientController.updatePatientStatus);

module.exports = router;