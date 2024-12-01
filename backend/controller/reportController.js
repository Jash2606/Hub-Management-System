const Vehicle = require('../model/Vehicle');
const Task = require('../model/Task');
const { calculateTAT } = require('../utils/timeUtils');

// Get Service TAT report
exports.getServiceTAT = async (req, res) => {
    try {
        const vehiclesInService = await Vehicle.find({
            state: 'Deployed',
            'serviceDetails.serviceStartTime': { $exists: true },
            'serviceDetails.serviceEndTime': { $exists: true }
        });

        console.log(vehiclesInService);

        const report = vehiclesInService.map(vehicle => {
            const { plateNumber, serviceDetails } = vehicle;
            console.log(vehicle.serviceDetails.serviceStartTime, vehicle.serviceDetails.serviceEndTime);
            const serviceDuration  = calculateTAT(vehicle.serviceDetails.serviceStartTime, vehicle.serviceDetails.serviceEndTime);
            console.log(serviceDuration);
        
            return {
                plateNumber,
                serviceDuration: `${serviceDuration.tat} `,
                technician: serviceDetails.technician || 'N/A',
                serviceNotes: serviceDetails.serviceNotes || 'No notes available',
                entryTime: serviceDuration.entryTime,
                exitTime: serviceDuration.exitTime
            };
        }).filter(Boolean); // Filter out null entries

        if (report.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No Deployed tasks found for generating Service TAT report',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Service TAT report generated successfully',
            results: report.length,
            data: report,
        });
    } catch (error) {
        console.error('Error generating Service TAT report:', error );
        res.status(500).json({ error: error.message });
    }
};



// // Get Hub TAT report
exports.getHubTAT = async (req, res) => {
    try {
        const vehiclesWithEntryAndExit = await Vehicle.find({
            entryTime: { $exists: true },
            exitTime: { $exists: true }
        });

        console.log(vehiclesWithEntryAndExit);

        

        const report = vehiclesWithEntryAndExit.map(vehicle => {
            const { plateNumber, entryTime, exitTime } = vehicle;
            const hubDuration = calculateTAT(entryTime, exitTime);
            return {
                plateNumber,
                hubDuration: `${hubDuration.tat} minutes`,
                entryTime: hubDuration.entryTime,
                exitTime: hubDuration.exitTime
            };
        });

        res.status(200).json({
            message: 'Hub TAT report generated successfully',
            data: report
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating Hub TAT report', error: error.message });
    }
};
