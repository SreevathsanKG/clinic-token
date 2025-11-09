const Patient = require('../models/patientModel');
const { Op } = require('sequelize'); // Needed for date filtering

// Helper function to get the start of the current day (midnight)
const getTodayStart = () => {
    const today = new Date();
    // Setting hours, minutes, seconds, and milliseconds to zero
    today.setHours(0, 0, 0, 0); 
    return today;
};

// 1. Add a new patient (POST) - Generates the daily sequential token
exports.addPatient = async (req, res) => {
    const { name, age, purpose } = req.body;

    if (!name || !purpose) {
        return res.status(400).json({ message: 'Name and Purpose are required.' });
    }

    try {
        // Find the patient with the highest token number created TODAY
        const latestPatient = await Patient.findOne({
            // Key logic: Filter records where createdAt is Greater Than or Equal (gte) to the start of today
            where: {
                createdAt: { [Op.gte]: getTodayStart() }
            },
            order: [['token_number', 'DESC']],
            attributes: ['token_number']
        });
        
        // Calculate the new sequential token number
        // If latestPatient is null (first patient today), start at 1.
        // Otherwise, increment the highest token.
        const nextToken = (latestPatient ? latestPatient.token_number : 0) + 1;

        // Create the new patient record
        const newPatient = await Patient.create({
            token_number: nextToken,
            name,
            age: age || null, // Allow age to be optional
            purpose,
            status: 'Waiting' 
        });

        res.status(201).json(newPatient);

    } catch (error) {
        console.error('Error adding patient:', error);
        // Respond with a 500 and the error message for debugging
        res.status(500).json({ message: 'Internal Server Error', error: error.message }); 
    }
};

// 2. Get all today's patients (GET) - Used by both Front Desk and Doctor views
exports.getAllPatients = async (req, res) => {
    try {
        // Fetch all patients added since the start of today
        const patients = await Patient.findAll({
            where: {
                createdAt: { [Op.gte]: getTodayStart() }
            },
            order: [
                // Ordering by status prioritizes 'Waiting' and 'In Consultation'
                ['status', 'ASC'], 
                // Then sort by token number to maintain queue order
                ['token_number', 'ASC'] 
            ]
        });

        res.status(200).json(patients);

    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 3. Update patient status (PUT) - Used by the Doctor View
exports.updatePatientStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expects 'In Consultation' or 'Done'

    if (!['In Consultation', 'Done'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value. Must be "In Consultation" or "Done".' });
    }

    try {
        // Update the status in the database
        const [updatedRows] = await Patient.update(
            { status },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Fetch and return the updated record
        const updatedPatient = await Patient.findByPk(id);
        res.status(200).json(updatedPatient);

    } catch (error) {
        console.error('Error updating patient status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};