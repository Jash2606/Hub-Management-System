const mongoose = require('mongoose');
const Task = require('../model/Task');
const Vehicle = mongoose.models.Vehicle || require('./Vehicle');

// Create a task and assign to a team member
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, vehicleId } = req.body;

        if (!title || !description || !dueDate) {
            return res.status(400).json({
                message: 'Title, description, and due date are required',
                status: 'fail',
                data: null
            });
        }

        if (new Date(dueDate) < Date.now()) {
            return res.status(400).json({
                message: 'Due date cannot be in the past',
                status: 'fail',
                data: null
            });
        }

        let vehicle = null;
        if (vehicleId) {
            vehicle = await Vehicle.findById(vehicleId);
            if (!vehicle) {
            return res.status(404).json({
                message: 'Vehicle not found',
                status: 'fail',
                data: null
            });
            }
            vehicle.serviceDetails.serviceStartTime = Date.now();
            vehicle.state = 'Service';
            await vehicle.save();
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            dueDate,
            createdBy: req.user._id,
            vehicle: vehicle ? vehicle._id : null
        });

        res.status(201).json({
            status: 'success',
            data: task,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await Task.find(); 
        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: tasks,
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

exports.getTask = async (req, res, ) => {
    try{
        const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: 'Invalid Task ID',
                status: 'fail',
                data: null
            })
        }
    
        const task = await Task.findById(id);
    
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                status: 'fail',
                data: null
            })
        }
    
        res.status(200).json({
            status: 'success',
            message: 'Task found successfully',
            data: task,
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

exports.updateTask = async (req, res) => {
    try{
        console.log("Updating task");
        const { id } = req.params;
        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;
        console.log(req.body);
    
        if (!title && !description && !status && !priority && !dueDate) {
            return res.status(400).json({
                message: 'No fields to update',
                status: 'fail',
                data: null
            });
        }
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: 'Invalid Task ID',
                status: 'fail',
                data: null
            });
        }
        // console.log("user" , req.user);
        let newTask = {};
        if(title) newTask.title = title;
        if(description) newTask.description = description;
        if(status) newTask.status = status;
        if(priority) newTask.priority = priority;
        if(dueDate) newTask.dueDate = dueDate;

        if(status && status === 'completed') {
            const TempTask = await Task.findById(id);
            newTask.completedAt = Date.now();
            const vehicle = await Vehicle.findByIdAndUpdate(
                TempTask.vehicle,
                { 
                    'serviceDetails.serviceEndTime': Date.now(),
                    state: 'Deployed'
                },
                { new: true }
            );
        }

        if(status && status === 'pending'){
            await Vehicle.updateMany(
                { 'serviceDetails.technician': req.user._id },
                { $set: { 'serviceDetails.serviceEndTime': null } },
                { multi: true }
            );
        }

        if(status && status === 'in-progress') newTask.inProgressAt = Date.now();

        if(status && status === 'pending') {
            newTask.completedAt = null;
        }

        const task = await Task.findByIdAndUpdate(id, newTask, { new: true });
        
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                status: 'fail',
                data: null
            });
        }
    
        res.status(200).json({
            status: 'success',
            message: 'Task updated successfully',
            data: task
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try{
        const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: 'Invalid Task ID',
                status: 'fail',
                data: null
            })
        }
    
        const task = await Task.findByIdAndDelete(id);
    
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                status: 'fail',
                data: null
            })
        }
    
        res.status(200).json({
            status: 'success',
            message: 'Task deleted successfully',
            data: task
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

exports.assignTask = async (req, res) => {
    try{
        const { id } = req.params;
        const userId  = req.user._id;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: 'Invalid Task ID',
                status: 'fail',
                data: null
            });
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(404).json({
                message: 'Invalid User ID',
                status: 'fail',
                data: null
            });
        }
    
        const task = await Task.findByIdAndUpdate(
            id,
            { assignedTo: userId },
            { new: true, runValidators: true }
        );


        if (task.status !== 'pending') {
            return res.status(400).json({
                message: 'Task is not in pending status',
                status: 'fail',
                data: null
            });
        }

        // console.log("task", task.vehicle);
        // const Allvehicle = await Vehicle.find({});
        // console.log("Allvehicle", Allvehicle);

        const vehicle = await Vehicle.findByIdAndUpdate(
            task.vehicle,
            { 
            'serviceDetails.serviceEndTime': null,
            'serviceDetails.serviceStartTime': Date.now(),
            'serviceDetails.technician': userId
            },
            { new: true }
        );

        console.log("vehicle", vehicle);


        const newVehicle = await Vehicle.findOne({ 'serviceDetails.technician': userId });
        console.log("vehicle", newVehicle);
        console.log("userId", userId);  
        
        if (!vehicle) {
            return res.status(404).json({
                message: 'Vehicle not found',
                status: 'fail',
                data: null
            });
        }

    
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                status: 'fail',
                data: null
            });
        }

    
        res.status(200).json({
            status: 'success',
            message: 'Task assigned successfully',
            data: task,
            vehicle: newVehicle
        });

    }catch(error){
        res.status(500).json({ error: error.message });
    }
};


exports.unassign = async (req, res) => {
    try{
        const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: 'Invalid Task ID',
                status: 'fail',
                data: null
            });
        }
    
        const task = await Task.findByIdAndUpdate(
            id,
            { assignedTo: null },
            { new: true, runValidators: true }
        );
    
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                status: 'fail',
                data: null
            });
        }
    
        res.status(200).json({
            status: 'success',
            message: 'Task unassigned successfully',
            data: task
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}
