let cachedHierarchy = null;
let cachedAt = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const API_BASE = 'https://bdapis.pro.bd/geo/v2.0';

const readJson = async (path) => {
    const response = await fetch(`${API_BASE}/${path}`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Location service returned ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.data)) throw new Error('Invalid location service response');
    return payload.data;
};

const getLocationHierarchy = async (req, res) => {
    try {
        if (cachedHierarchy && Date.now() - cachedAt < CACHE_DURATION) {
            return res.json({ success: true, ...cachedHierarchy });
        }

        const [divisionRows, districtRows, upazilaRows] = await Promise.all([
            readJson('divisions'), readJson('districts'), readJson('upazilas')
        ]);
        const divisionById = Object.fromEntries(divisionRows.map((division) => [String(division.id), division.name]));
        const districtById = Object.fromEntries(districtRows.map((district) => [String(district.id), district.name]));
        const divisions = Object.fromEntries(divisionRows.map((division) => [division.name, []]));
        districtRows.forEach((district) => {
            const divisionName = divisionById[String(district.division_id)];
            if (divisionName) divisions[divisionName].push(district.name);
        });
        const thanas = {};
        upazilaRows.forEach((upazila) => {
            const districtName = districtById[String(upazila.district_id)];
            if (!districtName) return;
            (thanas[districtName] ||= []).push(upazila.name);
        });
        Object.values(divisions).forEach((districts) => districts.sort());
        Object.values(thanas).forEach((upazilas) => upazilas.sort());

        cachedHierarchy = { divisions, thanas, counts: { divisions:divisionRows.length, districts:districtRows.length, thanas:upazilaRows.length } };
        cachedAt = Date.now();
        return res.json({ success: true, ...cachedHierarchy });
    } catch (error) {
        console.error('Location hierarchy failed:', error);
        return res.status(503).json({ success: false, message: 'Complete Bangladesh location list is temporarily unavailable' });
    }
};

module.exports = { getLocationHierarchy };
