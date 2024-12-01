const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();
connectDB();

const vehicleRoutes = require('./routes/vehicleRoute');
const taskRoutes = require('./routes/taskRoute');
const userRoutes = require('./routes/userRoute');
const reportRoutes = require('./routes/reportRoute');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API is running'));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/vehicle', vehicleRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/reports', reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
