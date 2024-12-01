const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Task description is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Optional for manual task assignment
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Task must have a creator'],
        },

        createdAt: {    
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: false, // Optional if a task is not always related to a vehicle
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('Task', taskSchema);
