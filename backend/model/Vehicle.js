const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    plateNumber: {
      type: String,
      required: [true, 'Vehicle must have a plate number'],
      unique: true
    },
    state: {
      type: String,
      enum: ['Service', 'RTD', 'Missing', 'Deployed'],
      required: [true, 'Vehicle must have a state']
    },
    entryTime: {
      type: Date,
      default: Date.now
    },
    exitTime: {
      type: Date
    },
    serviceDetails: {
      technician: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
      },
      serviceStartTime: Date,
      serviceEndTime: Date,
      serviceNotes: String
    },
    currentLocation: {
      type: String
    },
    additionalNotes: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual to calculate service duration
// vehicleSchema.virtual('serviceDuration').get(function() {
//   if (this.serviceDetails?.serviceStartTime && this.serviceDetails?.serviceEndTime) {
//     return (this.serviceDetails.serviceEndTime - this.serviceDetails.serviceStartTime) / (1000 * 60); // duration in minutes
//   }
//   return null;
// });


const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;