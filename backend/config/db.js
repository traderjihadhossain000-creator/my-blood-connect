const mongoose = require('mongoose');

// ei function diye server start hobar sathe sathe MongoDB connection initialize kora hoy.
// ei database e user, donor, request related data store kora hoy, tai app er core data access er jonno ei connection lage.
const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB connected: ${connection.connection.name}`);
};

module.exports = connectDB;
