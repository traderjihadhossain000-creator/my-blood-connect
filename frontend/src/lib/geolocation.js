// ei helper diye browser er current GPS location capture kora hoy.
// ei location use kora hoy donor search, registration, ar nearby emergency matching er jonno.
export const getAccuratePosition = (timeout = 15000) => new Promise((resolve, reject) => {
  if (!navigator.geolocation) return reject(new Error('Your browser does not support GPS location.'));
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({ latitude:coords.latitude, longitude:coords.longitude, accuracy:coords.accuracy }),
    reject,
    { enableHighAccuracy:true, timeout, maximumAge:0 }
  );
});
