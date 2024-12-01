const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'User must have a name']
    },  
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'User must have a password']
    },
    role: {
        type: String,
        enum: ['Admin', 'OEM Technician', 'Blive Technician', 'TUT', 'Hub Ops'],
        default: 'Hub Ops'
    },
}, { timestamps: true });


// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user-entered password with stored password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
