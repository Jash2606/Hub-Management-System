const express = require('express');
const { createVehicle , updateVehicle , getVehiclesByState , deleteVehicle , getAllVehicles , exitVehicle} = require('../controller/vehicleController');
const { restrictTo } = require('../middleware/roleMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/entry', authMiddleware, restrictTo(['Hub Ops', 'OEM Technician']), createVehicle);
router.post('/exit/:vehicleID', authMiddleware, restrictTo(['Hub Ops', 'OEM Technician', 'Blive Technician']), exitVehicle);
router.put('/update/:vehicleID', authMiddleware, restrictTo(['Hub Ops', 'OEM Technician']), updateVehicle);
router.get('/:state', authMiddleware, restrictTo(['Hub Ops', 'OEM Technician', 'TUT']), getVehiclesByState);
router.delete('/exit/:vehicleID', authMiddleware, restrictTo(['Admin']), deleteVehicle);
router.get('/', authMiddleware, getAllVehicles);

module.exports = router;
