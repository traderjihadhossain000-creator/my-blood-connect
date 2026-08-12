const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, unique: true, trim: true, minlength: 7, maxlength: 20 },
    role: { type: String, enum: ['user', 'donor', 'recipient'], required: true, default: 'user' },
    bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true },
    age: { type: Number, min: 1, max: 120, default: null },
    weight: { type: Number, min: 1, max: 300, default: null },
    division: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
    thana: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, required: true, maxlength: 100 },
    nidDocument: { type: String, trim: true, default: '' },
    birthCertificateDocument: { type: String, trim: true, default: '' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
            type: [Number],
            default: undefined,
            validate: {
                validator: (value) => !value || (value.length === 2 && value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90),
                message: 'Invalid GPS coordinates'
            }
        }
    },
    locationUpdatedAt: { type: Date, default: null },
    locationAccuracy: { type: Number, min: 0, default: null },
    lastDonationDate: { type: Date, default: null },
    isAvailable: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

userSchema.index({ location: '2dsphere' });
userSchema.index({ bloodGroup: 1, isAvailable: 1 });
userSchema.index({ division: 1, district: 1, thana: 1 });

const User = mongoose.model('User', userSchema);

User.migrateToUnifiedAccounts = async () => {
    await User.updateMany({ role: 'recipient' }, { $set: { isAvailable: false } });
    await User.updateMany({ role: { $in: ['donor', 'recipient'] } }, { $set: { role: 'user' } });
};

module.exports = User;
