import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const makeIcon = (color) => new L.Icon({
  iconUrl:`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowSize:[41,41]
});
const donorIcon=makeIcon('red');
const recipientIcon=makeIcon('blue');

function FitMarkers({ points }) {
  const map=useMap();
  useEffect(()=>{ if(points.length===1) map.setView(points[0],15); if(points.length>1) map.fitBounds(L.latLngBounds(points),{padding:[45,45],maxZoom:16}); },[map,points]);
  return null;
}

export default function LiveMap({ donorsList=[] }) {
  const live=window.__bloodConnectRecipientLocation;
  const recipientPoint=useMemo(()=>{const lat=Number(live?.lat),lng=Number(live?.lng);return Number.isFinite(lat)&&Number.isFinite(lng)?[lat,lng]:null;},[live?.lat,live?.lng]);
  const groups=useMemo(()=>{
    const grouped=new Map();
    donorsList.forEach((donor)=>{
      const [lng,lat]=donor.location?.coordinates || [];
      if(!Number.isFinite(lat)||!Number.isFinite(lng)) return;
      const key=`${lat.toFixed(6)},${lng.toFixed(6)}`;
      const group=grouped.get(key)||{point:[lat,lng],donors:[]};
      group.donors.push(donor); grouped.set(key,group);
    });
    return [...grouped.values()];
  },[donorsList]);
  const points=useMemo(()=>[...(recipientPoint?[recipientPoint]:[]),...groups.map(group=>group.point)],[groups,recipientPoint]);
  const center=recipientPoint||groups[0]?.point||[23.8103,90.4125];

  return <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><MapPin className="text-red-500"/><h3 className="font-bold">Live Donor & Recipient Map</h3></div><div className="flex gap-2 text-xs"><span className="rounded-lg bg-blue-600/20 px-2.5 py-1 text-blue-300">Blue: You</span><span className="rounded-lg bg-red-600/20 px-2.5 py-1 text-red-300">Red: Donor ({donorsList.length})</span></div></div>
    <p className="mb-3 text-xs text-slate-400">Donors with identical GPS coordinates share one exact marker. Open it to see every donor at that location.</p>
    <div className="relative z-0 overflow-hidden rounded-[20px]"><MapContainer center={center} zoom={13} style={{height:'420px',width:'100%'}}><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><FitMarkers points={points}/>
      {recipientPoint&&<Marker position={recipientPoint} icon={recipientIcon} zIndexOffset={1000}><Tooltip permanent direction="left" offset={[-12,-22]} className="recipient-map-label">Your location</Tooltip><Popup><strong>Your current GPS location</strong></Popup></Marker>}
      {groups.map((group)=><Marker key={`${group.point[0]},${group.point[1]}`} position={group.point} icon={donorIcon} zIndexOffset={1100}><Tooltip permanent direction="right" offset={[12,-22]} className="donor-map-label">{group.donors.length>1?`${group.donors.length} donors here`:group.donors[0].name}</Tooltip><Popup><div className="min-w-44 text-slate-900"><strong className="text-red-600">{group.donors.length>1?`${group.donors.length} donors at the same GPS location`:group.donors[0].name}</strong>{group.donors.map((donor)=><div key={donor._id} className="mt-2 border-t pt-2"><b>{donor.name}</b><p>Blood group: {donor.bloodGroup}</p>{donor.distanceKm!=null&&<p>Distance: {donor.distanceKm} km</p>}</div>)}</div></Popup></Marker>)}
    </MapContainer></div>
  </div>;
}
