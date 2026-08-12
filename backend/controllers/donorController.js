const User = require('../models/User');

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
const GPS_FRESH_MS = 2 * 24 * 60 * 60 * 1000;
const toBoundedNumber = (value, min, max) => {
    if (value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= min && number <= max ? number : null;
};

const isEligible = (donor) => !donor.lastDonationDate || (Date.now() - new Date(donor.lastDonationDate).getTime() >= NINETY_DAYS_MS);
const isFreshLocation = (donor, now = Date.now()) => {
    if (!donor.locationUpdatedAt || donor.location?.coordinates?.length !== 2) return false;
    const age = now - new Date(donor.locationUpdatedAt).getTime();
    return Number.isFinite(age) && age >= 0 && age <= GPS_FRESH_MS;
};

const parseSearchType = (value) => value === 'gps' ? 'gps' : value === 'profile' ? 'profile' : null;

const addSelectedAreaFilters = (query, filters) => {
    if (filters.division && filters.division !== 'All') query.division = filters.division;
    if (filters.district && filters.district !== 'All') query.district = filters.district;
    if (filters.thana && filters.thana !== 'All') query.thana = filters.thana;
    return query;
};

const searchDonors = async (req, res) => {
    try {
        const {
            bloodGroup, division, district, thana, city, lat, lng, searchType,
            eligibleOnly = 'true', availableOnly = 'true'
        } = req.query;
        const filters = { division, district, thana };
        const baseQuery = { _id: { $ne: req.user.id } };
        if (bloodGroup && bloodGroup !== 'All') baseQuery.bloodGroup = bloodGroup;
        if (city && city !== 'All') baseQuery.city = city;
        if (availableOnly !== 'false') baseQuery.isAvailable = true;
        if (eligibleOnly !== 'false') {
            const cutoff = new Date(Date.now() - NINETY_DAYS_MS);
            baseQuery.$and = [{ $or: [{ lastDonationDate: null }, { lastDonationDate: { $lte: cutoff } }] }];
        }

        const requestedSearchType = parseSearchType(searchType);
        if (!requestedSearchType) {
            return res.status(400).json({ success:false, message:'Choose Search with Live GPS or Search without GPS' });
        }
        const latitude = Number(lat);
        const longitude = Number(lng);
        const hasValidCoordinates = lat !== undefined && lng !== undefined && Number.isFinite(latitude) && Number.isFinite(longitude) &&
            latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
        if (requestedSearchType === 'gps' && !hasValidCoordinates) {
            return res.status(400).json({ success:false, message:'Live GPS search requires valid recipient coordinates' });
        }
        const hasGps = requestedSearchType === 'gps';
        const now = Date.now();
        const gpsCutoff = new Date(now - GPS_FRESH_MS);
        const selectFields = 'name bloodGroup division district thana city location locationUpdatedAt locationAccuracy lastDonationDate isAvailable';
        let rawDonors = [];

        if (hasGps) {
            const freshQuery = {
                ...baseQuery,
                locationUpdatedAt: { $gte: gpsCutoff },
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [longitude, latitude] }
                    }
                }
            };
            addSelectedAreaFilters(freshQuery, filters);

            const staleQuery = { ...baseQuery, $and: [...(baseQuery.$and || []), { $or: [
                { locationUpdatedAt: null },
                { locationUpdatedAt: { $exists: false } },
                { locationUpdatedAt: { $lt: gpsCutoff } }
            ] }] };
            // Stale/missing GPS donors still remain searchable by their saved
            // profile address. "All" must not silently restrict them to the
            // recipient's own thana; only explicitly selected areas filter them.
            addSelectedAreaFilters(staleQuery, filters);
            const freshDonors = await User.find(freshQuery).select(selectFields).lean();
            const staleDonors = await User.find(staleQuery).select(selectFields).lean();
            rawDonors = [
                ...freshDonors.map((donor) => ({ ...donor, locationSource: 'gps' })),
                ...staleDonors.map((donor) => ({ ...donor, locationSource: 'profile' }))
            ];
        } else {
            const profileQuery = { ...baseQuery };
            // Without GPS, apply only the filters explicitly chosen by the
            // recipient. Never auto-fill missing levels from their profile.
            addSelectedAreaFilters(profileQuery, filters);
            rawDonors = (await User.find(profileQuery).select(selectFields).lean())
                .map((donor) => ({ ...donor, locationSource: 'profile' }));
        }

        const unique = new Map(rawDonors.map((donor) => [String(donor._id), donor]));
        let donors = [...unique.values()].map((donor) => {
            const coordinates = donor.location?.coordinates || [];
            let distanceKm = null;
            if (donor.locationSource === 'gps' && isFreshLocation(donor, now)) {
                const [lon, latValue] = coordinates;
                const dLat = ((latValue - latitude) * Math.PI) / 180;
                const dLon = ((lon - longitude) * Math.PI) / 180;
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitude * Math.PI / 180) * Math.cos(latValue * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
                distanceKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            }
            const { lastDonationDate, ...publicDonor } = donor;
            if (publicDonor.locationSource === 'profile') delete publicDonor.location;
            return {
                ...publicDonor,
                eligible: isEligible(donor),
                gpsExpiresAt: donor.locationSource === 'gps' ? new Date(new Date(donor.locationUpdatedAt).getTime() + GPS_FRESH_MS) : null,
                distanceKm: distanceKm === null ? null : Number(distanceKm.toFixed(2))
            };
        });
        donors.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

        res.json({ success: true, total: donors.length, searchMode: hasGps ? 'gps' : 'profile', gpsFreshHours: 48, donors });
    } catch (error) {
        console.error('Donor search failed:', error);
        res.status(500).json({ success: false, message: 'Unable to search donors' });
    }
};

module.exports = { searchDonors, isEligible, isFreshLocation, parseSearchType, addSelectedAreaFilters, toBoundedNumber, GPS_FRESH_MS };
