const Vehicle = require('../model/Vehicle');

// Create a new vehicle entry
exports.createVehicle = async (req, res) => {
    try{
        const {
            plateNumber,
            state,
            currentLocation,   
            additionalNotes,
        } = req.body;

        console.log(req.body);

        if (!plateNumber || !state || !currentLocation) {
            return res.status(400).json({ 
                message: 'plateNumber, state, and current location are required' 
            });
        }

        const existingVehicle = await Vehicle.findOne({ plateNumber });
        if (existingVehicle) {
            return res.status(400).json({ 
                message: 'Vehicle already exists' 
            });
        }
        const newVehicle = new Vehicle({
            plateNumber,
            state,
            serviceDetails: {
                technician: null,
                serviceStartTime: null,
                serviceEndTime: null,
                serviceNotes: additionalNotes
            },
            currentLocation,
            additionalNotes,
            entryTime: new Date()
        });

        await newVehicle.save();

        res.status(201).json({
            status: 'success',
            message: 'Vehicle created successfully',
            data:{
                vehicle: newVehicle
            }
        })
    }catch(error){
        console.error('Error creating vehicle:', error);
        res.status(500).json({ error: error.message }); 
    }
};

// Update an existing vehicle entry
exports.updateVehicle = async (req, res) => {
    try {
        const { vehicleID } = req.params;
        const { state, serviceDetails } = req.body;
        // console.log("User details",req.user);
        // console.log(vehicleID)
        // const tempVehicle = await Vehicle.findById(vehicleID);
        // console.log(tempVehicle)
        const vehicle = await Vehicle.findByIdAndUpdate(
            { _id: vehicleID },
            { 
                state, 
                ...(state === 'Service' && req.user && { 
                    'serviceDetails.serviceStartTime': new Date(),
                    'serviceDetails.technician': req.user.id 
                }),
                ...(state === 'RTD' && { 
                    'serviceDetails.serviceEndTime': new Date(),
                    exitTime: new Date()
                }),
                ...(serviceDetails && { 'serviceDetails.serviceNotes': serviceDetails.serviceNotes })
            },
            { 
                new: true, 
                runValidators: true 
            }
        );
        console.log(vehicle);

        if (!vehicle) {
            return res.status(404).json({ 
                message: 'Vehicle not found' 
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Vehicle updated successfully',
            data: {
                vehicle
            }
        }); 
    }catch(error){
        console.error("Error updating vehicle:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all vehicles by state
exports.getVehiclesByState = async (req, res) => {
    try{
        const { state } = req.params;
        console.log(state);
        if(!state.includes('Service', 'RTD', 'Missing', 'Deployed')) {
            return res.status(400).json({ 
                message: 'Invalid state provided' 
            });
        }
        const vehicles = await Vehicle.find(state ? { state } : {})
            .populate('serviceDetails.technician', 'name email');

        res.status(200).json({
            status: 'success',
            results: vehicles.length,
            data: {
                vehicles
            }
        });
    }catch(error){
        console.error("Error getting vehicles by state:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteVehicle = async (req, res) => {
    try{
        const { id } = req.params;
        const vehicle = await Vehicle.findOneAndDelete({ id });

        if (!vehicle) {
            return res.status(404).json({
                status: 'fail',
                message: 'Vehicle not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Vehicle deleted successfully',
            data: {
                vehicle
            }
        });
    }catch(error){
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllVehicles = async (req, res) => {
    try{
        const vehicles = await Vehicle.find();
        res.status(200).json({
            status: 'success',
            results: vehicles.length,
            data: {
                vehicles
            }
        });
    }catch(error){
        console.error("Error getting all vehicles:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.exitVehicle = async (req, res) => {
    try{
        const { vehicleID } = req.params;
        const vehicle = await Vehicle.findByIdAndUpdate(
            vehicleID ,
            { 
                state: 'Deployed',
                exitTime: new Date()
            },
            { 
                new: true, 
                runValidators: true 
            }
        );

        console.log(vehicle);

        if (!vehicle) {
            return res.status(404).json({
                status: 'fail',
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Vehicle exited successfully',
            data: {
                vehicle
            }
        });
    }catch(error){
        console.error("Error exiting vehicle:", error);
        res.status(500).json({ error: error.message });
    }
};
