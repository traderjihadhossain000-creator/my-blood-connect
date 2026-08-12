import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const makeIcon = (color) => new L.Icon({
  iconUrl:`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize:[25, 41], iconAnchor:[12, 41], popupAnchor:[1, -34], shadowSize:[41, 41]
});
const donorIcon = makeIcon('red');
const recipientIcon = makeIcon('blue');
const samePoint = (a, b) => Math.abs(a[0] - b[0]) < 0.000001 && Math.abs(a[1] - b[1]) < 0.000001;

function FitMarkers({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 15);
    if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding:[45, 45], maxZoom:16 });
  }, [map, points]);
  return null;
}

export default function LiveMap({ donorsList = [] }) {
  const liveLocation = window.__bloodConnectRecipientLocation;
  const recipientLat = Number(liveLocation?.lat);
  const recipientLng = Number(liveLocation?.lng);
  const recipientPoint = useMemo(() => Number.isFinite(recipientLat) && Number.isFinite(recipientLng)
    ? [recipientLat, recipientLng] : null, [recipientLat, recipientLng]);

  const donors = useMemo(() => {
    const occupied = [];
    return donorsList.flatMap((donor) => {
      const coordinates = donor.location?.coordinates;
      if (!coordinates || coordinates.length !== 2) return [];
      const exactPoint = [Number(coordinates[1]), Number(coordinates[0])];
      if (!exactPoint.every(Number.isFinite)) return [];
      const overlapIndex = occupied.filter((point) => samePoint(point, exactPoint)).length +
        (recipientPoint && samePoint(recipientPoint, exactPoint) ? 1 : 0);
      occupied.push(exactPoint);
      // Only spread the rendered pins (~8 m); saved GPS and distance stay exact.
      const angle = overlapIndex * Math.PI / 3;
      const displayPoint = overlapIndex ? [exactPoint[0] + Math.cos(angle) * 0.00007, exactPoint[1] + Math.sin(angle) * 0.00007] : exactPoint;
      return [{ ...donor, displayPoint, overlaps:overlapIndex > 0 }];
    });
  }, [donorsList, recipientPoint]);

  const points = useMemo(() => [...(recipientPoint ? [recipientPoint] : []), ...donors.map((donor) => donor.displayPoint)], [donors, recipientPoint]);
  const center = recipientPoint || donors[0]?.displayPoint || [23.8103, 90.4125];

  return <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2"><MapPin className="text-red-500"/><h3 className="font-bold">Live Donor & Recipient Map</h3></div>
      <div className="flex gap-2 text-xs"><span className="rounded-lg bg-blue-600/20 px-2.5 py-1 text-blue-300">Blue: You</span><span className="rounded-lg bg-red-600/20 px-2.5 py-1 text-red-300">Red: Donor ({donors.length})</span></div>
    </div>
    <p className="mb-3 text-xs text-slate-400">Same-location pins are slightly spread visually so both donor and recipient remain visible.</p>
    <div className="relative z-0 overflow-hidden rounded-[20px]">
      <MapContainer center={center} zoom={13} style={{ height:'420px', width:'100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <FitMarkers points={points}/>
        {recipientPoint && <Marker position={recipientPoint} icon={recipientIcon} zIndexOffset={1000}>
          <Tooltip permanent direction="left" offset={[-12, -22]} className="recipient-map-label">Your location</Tooltip>
          <Popup><strong>Your current GPS location</strong></Popup>
        </Marker>}
        {donors.map((donor) => <Marker key={donor._id} position={donor.displayPoint} icon={donorIcon}>
          <Tooltip permanent direction="right" offset={[12, -22]} className="donor-map-label">{donor.name}</Tooltip>
          <Popup><div className="min-w-36 text-slate-900"><strong className="text-red-600">{donor.name}</strong><p>Blood group: {donor.bloodGroup}</p>{donor.distanceKm != null && <p>Distance: {donor.distanceKm} km</p>}{donor.overlaps && <p className="mt-1 text-xs text-blue-600">Same GPS location (pin visually separated)</p>}</div></Popup>
        </Marker>)}
      </MapContainer>
    </div>
  </div>;
}
