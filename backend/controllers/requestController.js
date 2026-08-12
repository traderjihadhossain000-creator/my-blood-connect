const mongoose = require('mongoose');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

const cutoffDate = () => new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const validCoordinates = (latitude, longitude) => {
    if (latitude === undefined && longitude === undefined) return null;
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    return [lng, lat];
};

const fail = (res, label, error) => {
    console.error(`${label}:`, error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
};

const eligibleDonorQuery = (bloodGroup) => ({
    bloodGroup, isAvailable: true,
    $or: [{ lastDonationDate: null }, { lastDonationDate: { $lte: cutoffDate() } }]
});

const notifyDonors = (io, donorIds, request) => {
    if (!io) return;
    donorIds.forEach((id) => io.to(`user:${id}`).emit('blood_request_received', request));
    io.emit('blood_request_changed', { type: 'created', requestId: request._id });
};

const createBloodRequest = async (req, res) => {
    try {
        const { patientName, bloodGroup, hospitalName, hospitalAddress, contactNumber, bagsRequired, neededTime, targetDonorIds = [], requestType, latitude, longitude } = req.body;
        if (!patientName || !bloodGroup || !hospitalName || !hospitalAddress || !contactNumber || !neededTime) {
            return res.status(400).json({ success: false, message: 'All required blood request fields must be provided' });
        }
        if (!BLOOD_GROUPS.includes(bloodGroup)) return res.status(400).json({ success: false, message: 'Invalid blood group' });
        const deadline = new Date(neededTime);
        if (Number.isNaN(deadline.getTime())) return res.status(400).json({ success: false, message: 'Invalid needed date/time' });
        if (deadline <= new Date()) return res.status(400).json({ success: false, message: 'Needed date/time must be in the future' });
        const bags = Number(bagsRequired || 1);
        if (!Number.isInteger(bags) || bags < 1 || bags > 20) return res.status(400).json({ success: false, message: 'Bags required must be between 1 and 20' });

        let donorIds = Array.isArray(targetDonorIds) ? [...new Set(targetDonorIds.filter((id) => mongoose.isValidObjectId(id)).map(String))] : [];
        donorIds = donorIds.filter((id) => id !== req.user.id.toString());
        const resolvedRequestType = donorIds.length ? 'direct' : 'emergency';
        if (requestType && requestType !== resolvedRequestType) {
            return res.status(400).json({ success: false, message: 'Request type does not match the selected recipients' });
        }
        if (donorIds.length) {
            const donors = await User.find({ _id: { $in: donorIds }, ...eligibleDonorQuery(bloodGroup) }).select('_id');
            donorIds = donors.map((d) => d._id.toString());
            if (!donorIds.length) {
                return res.status(404).json({ success: false, message: 'Selected donor is not currently eligible or available' });
            }
        } else {
            const donors = await User.find({ bloodGroup, _id: { $ne: req.user.id } }).select('_id');
            donorIds = donors.map((d) => d._id.toString());
            if (!donorIds.length) {
                return res.status(404).json({ success: false, message: 'No other account found for this blood group' });
            }
        }

        const coordinates = validCoordinates(latitude, longitude);
        if (coordinates === false) return res.status(400).json({ success: false, message: 'Invalid request location' });
        const responses = donorIds.map((id) => ({ donorId: id, status: 'pending' }));

        const requestData = {
            recipientId: req.user.id,
            requestType: resolvedRequestType,
            patientName: String(patientName).trim(),
            bloodGroup,
            hospitalName: String(hospitalName).trim(),
            hospitalAddress: String(hospitalAddress).trim(),
            contactNumber: String(contactNumber).trim(),
            bagsRequired: bags,
            neededTime: deadline,
            responses
        };
        if (coordinates) requestData.recipientLocation = { type: 'Point', coordinates };
        const newRequest = await BloodRequest.create(requestData);

        const populated = await BloodRequest.findById(newRequest._id).populate('recipientId', 'name phone city division district thana');
        const io = req.app.get('socketio');
        notifyDonors(io, donorIds, populated);

        res.status(201).json({ success: true, message: `Request sent to ${donorIds.length} matching donor account(s)`, request: populated });
    } catch (error) {
        if (error?.name === 'ValidationError') return res.status(400).json({ success: false, message: error.message });
        return fail(res, 'Request creation failed', error);
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ requestType: { $in: ['emergency', null] }, status: 'pending', neededTime: { $gt: new Date() } })
            .select('-contactNumber -recipientLocation')
            .populate('recipientId', 'name city division district thana')
            .populate('responses.donorId', 'name bloodGroup city')
            .sort({ postedAt: -1 });
        res.json({ success: true, total: requests.length, requests });
    } catch (error) {
        return fail(res, 'Request board read failed', error);
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ recipientId: req.user.id })
            .populate('responses.donorId', 'name bloodGroup phone city division district thana')
            .sort({ postedAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        return fail(res, 'Own requests read failed', error);
    }
};

const getMyEmergencyRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({
            recipientId: req.user.id,
            requestType: { $in: ['emergency', null] },
            status: { $ne: 'cancelled' },
            neededTime: { $gt: new Date() }
        }).populate('responses.donorId', 'name bloodGroup phone city division district thana').sort({ postedAt: -1 });
        return res.json({ success: true, requests });
    } catch (error) {
        return fail(res, 'Own emergency requests read failed', error);
    }
};

const getMyDirectRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({
            recipientId: req.user.id,
            requestType: 'direct',
            status: { $ne: 'cancelled' },
            neededTime: { $gt: new Date() }
        }).populate('responses.donorId', 'name bloodGroup phone city division district thana').sort({ postedAt: -1 });
        return res.json({ success: true, requests });
    } catch (error) {
        return fail(res, 'Own direct requests read failed', error);
    }
};

const getIncomingRequests = (requestType) => async (req, res) => {
    try {
        const requests = await BloodRequest.find({
            requestType: requestType === 'emergency' ? { $in: ['emergency', null] } : 'direct',
            status: 'pending',
            responses: { $elemMatch: { donorId: req.user.id, status: { $ne: 'rejected' } } },
            neededTime: { $gt: new Date() }
        }).populate('recipientId', 'name phone city division district thana').sort({ postedAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        return fail(res, 'Incoming requests read failed', error);
    }
};

const getIncomingDirectRequests = getIncomingRequests('direct');
const getIncomingEmergencyRequests = async (req, res) => {
    try {
        const donor = await User.findById(req.user.id).select('bloodGroup age weight isAvailable lastDonationDate').lean();
        if (!donor) return res.status(404).json({ success: false, message: 'User not found' });
        await BloodRequest.updateMany({
            requestType: { $in: ['emergency', null] },
            status: 'pending',
            bloodGroup: donor.bloodGroup,
            recipientId: { $ne: req.user.id },
            neededTime: { $gt: new Date() },
            'responses.donorId': { $ne: req.user.id }
        }, { $addToSet: { responses: { donorId: req.user.id, status: 'pending' } } });
        const requests = await BloodRequest.find({
            requestType: { $in: ['emergency', null] },
            status: 'pending',
            responses: { $elemMatch: { donorId: req.user.id, status: { $ne: 'rejected' } } },
            neededTime: { $gt: new Date() }
        }).populate('recipientId', 'name phone city division district thana').sort({ postedAt: -1 });
        return res.json({ success: true, requests });
    } catch (error) {
        return fail(res, 'Emergency requests read failed', error);
    }
};

const respondToRequest = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });

        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid request id' });
        const donor = await User.findById(req.user.id).select('name bloodGroup phone city isAvailable lastDonationDate').lean();
        if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
        if (status === 'accepted' && (!donor.isAvailable || (donor.lastDonationDate && donor.lastDonationDate > cutoffDate()))) {
            return res.status(400).json({ success: false, message: 'You are not currently eligible and available to accept this request' });
        }

        const request = await BloodRequest.findOne({ _id: req.params.id, 'responses.donorId': req.user.id });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found for this donor' });
        if (request.recipientId.toString() === req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'You cannot respond to your own blood request' });
        }
        if (request.status !== 'pending') return res.status(400).json({ success: false, message: 'This request is no longer active' });

        const response = request.responses.find((item) => item.donorId.toString() === req.user.id.toString());
        if (!response) return res.status(404).json({ success: false, message: 'Donor response record not found' });
        if (response.status !== 'pending') return res.status(409).json({ success: false, message: 'You have already responded to this request' });
        response.status = status;
        response.respondedAt = new Date();
        const acceptedCount = request.responses.filter((item) => item.status === 'accepted').length;
        if (acceptedCount >= request.bagsRequired) request.status = 'fulfilled';
        await request.save();

        const populated = await BloodRequest.findById(request._id)
            .populate('recipientId', 'name phone city division district thana')
            .populate('responses.donorId', 'name bloodGroup phone city');

        const finalAcceptedCount = populated.responses.filter((item) => item.status === 'accepted').length;
        const io = req.app.get('socketio');
        if (io) {
            io.to(`user:${populated.recipientId._id}`).emit('request_response_updated', {
                request: populated,
                donor: { id: req.user.id, name: donor.name, bloodGroup: donor.bloodGroup, city: donor.city },
                acceptedCount: finalAcceptedCount
            });
            io.emit('blood_request_changed', { type: 'responded', requestId: request._id });
        }

        res.json({ success: true, message: `Request ${status}`, acceptedCount: finalAcceptedCount, request: populated });
    } catch (error) {
        return fail(res, 'Request response failed', error);
    }
};

const cancelRequest = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid request id' });
        const request = await BloodRequest.findOneAndUpdate(
            { _id: req.params.id, recipientId: req.user.id, status: 'pending' },
            { status: 'cancelled' }, { new: true }
        );
        if (!request) return res.status(404).json({ success: false, message: 'Active request not found' });
        const io = req.app.get('socketio');
        if (io) {
            request.responses.forEach((item) => io.to(`user:${item.donorId}`).emit('blood_request_cancelled', { requestId: request._id }));
            io.emit('blood_request_changed', { type: 'cancelled', requestId: request._id });
        }
        res.json({ success: true, message: 'Request cancelled', request });
    } catch (error) {
        return fail(res, 'Request cancellation failed', error);
    }
};

const updateRequest = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid request id' });
        const request = await BloodRequest.findOne({ _id: req.params.id, recipientId: req.user.id });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        if (request.responses.some((item) => item.status === 'accepted')) {
            return res.status(409).json({ success: false, message: 'Accepted requests cannot be edited' });
        }

        const fields = ['patientName', 'bloodGroup', 'hospitalName', 'hospitalAddress', 'contactNumber', 'bagsRequired'];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) request[field] = req.body[field];
        });
        if (req.body.neededTime !== undefined) {
            const deadline = new Date(req.body.neededTime);
            if (Number.isNaN(deadline.getTime()) || deadline <= new Date()) {
                return res.status(400).json({ success: false, message: 'Needed date/time must be in the future' });
            }
            request.neededTime = deadline;
        }
        const acceptedCount = request.responses.filter((item) => item.status === 'accepted').length;
        request.status = acceptedCount >= Number(request.bagsRequired) ? 'fulfilled' : 'pending';
        await request.save();

        const io = req.app.get('socketio');
        if (io) {
            request.responses.forEach((item) => io.to(`user:${item.donorId}`).emit('blood_request_changed', { type: 'updated', requestId: request._id }));
            io.emit('blood_request_changed', { type: 'updated', requestId: request._id });
        }
        res.json({ success: true, message: 'Request updated successfully', request });
    } catch (error) {
        if (error?.name === 'ValidationError') return res.status(400).json({ success: false, message: error.message });
        return fail(res, 'Request update failed', error);
    }
};

const deleteRequest = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid request id' });
        const request = await BloodRequest.findOne({ _id: req.params.id, recipientId: req.user.id });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        if (request.responses.some((item) => item.status === 'accepted')) {
            return res.status(409).json({ success: false, message: 'Accepted requests cannot be deleted' });
        }
        await request.deleteOne();
        const io = req.app.get('socketio');
        if (io) {
            request.responses.forEach((item) => io.to(`user:${item.donorId}`).emit('blood_request_cancelled', { requestId: request._id }));
            io.emit('blood_request_changed', { type: 'deleted', requestId: request._id });
        }
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        return fail(res, 'Request deletion failed', error);
    }
};

module.exports = { createBloodRequest, getAllRequests, getMyRequests, getMyEmergencyRequests, getMyDirectRequests, getIncomingDirectRequests, getIncomingEmergencyRequests, respondToRequest, cancelRequest, updateRequest, deleteRequest, validCoordinates };
