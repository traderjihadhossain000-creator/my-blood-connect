const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCoordinates } = require('../controllers/authController');
const { isEligible, isFreshLocation, parseSearchType, addSelectedAreaFilters, toBoundedNumber } = require('../controllers/donorController');
const { validCoordinates } = require('../controllers/requestController');

test('auth coordinates are stored in GeoJSON longitude-latitude order', () => {
    assert.deepEqual(validateCoordinates('23.81', '90.41'), [90.41, 23.81]);
    assert.equal(validateCoordinates(91, 90), null);
    assert.equal(validateCoordinates('', ''), null);
});

test('request coordinates distinguish missing and invalid input', () => {
    assert.equal(validCoordinates(undefined, undefined), null);
    assert.equal(validCoordinates(23, undefined), false);
    assert.deepEqual(validCoordinates(23.81, 90.41), [90.41, 23.81]);
});

test('numeric filters reject invalid and out-of-range values', () => {
    assert.equal(toBoundedNumber('18', 1, 120), 18);
    assert.equal(toBoundedNumber('abc', 1, 120), null);
    assert.equal(toBoundedNumber('121', 1, 120), null);
});

test('90-day eligibility rule is enforced', () => {
    assert.equal(isEligible({ lastDonationDate: null }), true);
    assert.equal(isEligible({ lastDonationDate: new Date(Date.now() - 91 * 86400000) }), true);
    assert.equal(isEligible({ lastDonationDate: new Date(Date.now() - 10 * 86400000) }), false);
});

test('donor GPS remains fresh for 48 hours only', () => {
    const now = Date.now();
    const location = { type: 'Point', coordinates: [90.41, 23.81] };
    assert.equal(isFreshLocation({ location, locationUpdatedAt: new Date(now - 47 * 3600000) }, now), true);
    assert.equal(isFreshLocation({ location, locationUpdatedAt: new Date(now - 49 * 3600000) }, now), false);
    assert.equal(isFreshLocation({ location, locationUpdatedAt: new Date(now + 3600000) }, now), false);
    assert.equal(isFreshLocation({ location }, now), false);
});

test('search type must explicitly choose GPS or profile mode', () => {
    assert.equal(parseSearchType('gps'), 'gps');
    assert.equal(parseSearchType('profile'), 'profile');
    assert.equal(parseSearchType(undefined), null);
});

test('All area search does not restrict stale GPS donors to recipient thana', () => {
    assert.deepEqual(addSelectedAreaFilters({}, { division:'', district:'', thana:'' }), {});
    assert.deepEqual(
        addSelectedAreaFilters({}, { division:'Dhaka', district:'Gazipur', thana:'Kaliakair' }),
        { division:'Dhaka', district:'Gazipur', thana:'Kaliakair' }
    );
});
