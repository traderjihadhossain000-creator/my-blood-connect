import { useEffect, useState } from 'react';
import { Search, MapPin, Navigation, Send, X } from 'lucide-react';
import LiveMap from '../components/LiveMap';
import DateTimePicker from '../components/DateTimePicker';
import api, { API_URL, getStoredUser } from '../lib/api';
import { divisions, commonThanas } from '../data/bangladeshLocations';

const input = 'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-red-500';

export default function SearchPage() {
  const user = getStoredUser();
  const [filters, setFilters] = useState({ bloodGroup:'All', division:'', district:'', thana:'' });
  const [locationOptions, setLocationOptions] = useState({ divisions, thanas:commonThanas });
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [lastSearchType, setLastSearchType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsMessage, setGpsMessage] = useState('Live GPS will be requested when you search.');
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [form, setForm] = useState({ patientName:'', hospitalName:'', hospitalAddress:'', contactNumber:'', bagsRequired:1, neededAt:'' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/locations/hierarchy`)
      .then((response) => { if (!response.ok) throw new Error('Location service unavailable'); return response.json(); })
      .then((data) => { if (data.divisions && data.thanas) setLocationOptions({ divisions:data.divisions, thanas:data.thanas }); })
      .catch(() => {})
      .finally(() => setLocationsLoading(false));
  }, []);

  const change = (event) => setFilters((previous) => ({ ...previous, [event.target.name]:event.target.value }));
  const divisionChange = (event) => setFilters((previous) => ({ ...previous, division:event.target.value, district:'', thana:'' }));
  const districtChange = (event) => setFilters((previous) => ({ ...previous, district:event.target.value, thana:'' }));

  const search = async (useGps) => {
    setError(''); setMessage(''); setLoading(true);
    setGpsMessage(useGps ? 'Requesting your live GPS location...' : 'Searching only with your selected filters...');
    try {
      let coords = {};
      if (useGps) {
        try {
          coords = await getLiveGps();
          window.__bloodConnectRecipientLocation = coords;
          setGpsMessage('Live GPS received. Matching filters and showing nearest donors first.');
        } catch (gpsError) {
          setGpsMessage('GPS was not available. Use the Search Without GPS button.');
          throw gpsError;
        }
      }
      const params = { ...filters, ...coords, searchType:useGps ? 'gps' : 'profile' };
      Object.keys(params).forEach((key) => { if (params[key] === '' || params[key] === undefined) delete params[key]; });
      const { data } = await api.get('/api/donors/search', { params });
      const otherDonors = (data.donors || []).filter((donor) => String(donor._id) !== String(user.id));
      setDonors(otherDonors);
      setLastSearchType(useGps ? 'gps' : 'profile');
      if (!useGps) window.__bloodConnectRecipientLocation = null;
      setSelectedDonors([]);
      if (!useGps) setGpsMessage(`Search completed using only your selected filters. ${otherDonors.length} donor(s) found.`);
      if (!otherDonors.length) setGpsMessage(useGps ? 'GPS received, but no available eligible donor matched the selected filters.' : 'No available eligible donor matched the selected filters.');
    } catch (searchError) {
      setDonors([]);
      setLastSearchType(null);
      window.__bloodConnectRecipientLocation = null;
      setGpsMessage(useGps ? 'Could not complete live GPS search.' : 'Could not complete filter search.');
      setError(searchError.response?.data?.message || searchError.message || 'Could not access your live GPS location.');
    } finally { setLoading(false); }
  };

  const toggleDonor = (donor) => setSelectedDonors((previous) => previous.some((item)=>item._id===donor._id) ? previous.filter((item)=>item._id!==donor._id) : [...previous,donor]);
  const openRequest = () => { if (!selectedDonors.length) return; setForm((previous) => ({ ...previous, patientName:user.name, contactNumber:user.phone })); setMessage(''); setRequestOpen(true); };

  const send = async (event) => {
    event.preventDefault(); setMessage('');
    try {
      await api.post('/api/requests/create', { ...form, neededTime:new Date(form.neededAt), requestType:'direct', targetDonorIds:selectedDonors.map((donor)=>donor._id) });
      setMessage(`Request sent to ${selectedDonors.length} selected donor(s).`); setRequestOpen(false); setSelectedDonors([]);
    } catch (sendError) { setMessage(sendError.response?.data?.message || sendError.message || 'Request failed.'); }
  };

  return <div className="min-h-screen bg-slate-950 p-6 text-white"><div className="mx-auto max-w-7xl pt-10">
    <div className="mb-8"><p className="text-xs font-black uppercase tracking-widest text-red-400">Nearby Search</p><h1 className="text-4xl font-black">Find Nearby Eligible Donors</h1><p className="mt-2 text-slate-400">Your live GPS location is used to show the nearest eligible donors first.</p></div>
    <form onSubmit={(event) => event.preventDefault()} className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:grid-cols-4">
      <Select label="Blood Group" name="bloodGroup" value={filters.bloodGroup} onChange={change} options={['All','A+','A-','B+','B-','AB+','AB-','O+','O-']} />
      <Select label="Division" name="division" value={filters.division} onChange={divisionChange} disabled={locationsLoading} options={['',...Object.keys(locationOptions.divisions)]}/>
      <Select label="District" name="district" value={filters.district} onChange={districtChange} disabled={!filters.division || locationsLoading} options={['',...(locationOptions.divisions[filters.division] || [])]}/>
      <Select label={`Thana / Upazila${filters.district ? ` (${(locationOptions.thanas[filters.district] || []).length})` : ''}`} name="thana" value={filters.thana} onChange={change} disabled={!filters.district || locationsLoading} options={['',...(locationOptions.thanas[filters.district] || [])]}/>
      <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 md:col-span-4"><Navigation className="mr-2 h-4 w-4 shrink-0 text-emerald-400"/>{gpsMessage}</div>
      <button type="button" disabled={loading} onClick={() => search(true)} className="rounded-xl bg-red-600 py-3 font-black md:col-span-2"><Navigation className="mr-2 inline h-4 w-4"/>{loading ? 'Searching...' : 'Search with Live GPS'}</button>
      <button type="button" disabled={loading} onClick={() => search(false)} className="rounded-xl bg-slate-700 py-3 font-black md:col-span-2"><Search className="mr-2 inline h-4 w-4"/>{loading ? 'Searching...' : 'Search without GPS'}</button>
    </form>
    {error && <p className="mt-3 text-red-400">{error}</p>}{message && <p className="mt-3 text-emerald-400">{message}</p>}
    {donors.length > 0 && <div className="mt-8"><div className="mb-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-200">{lastSearchType === 'gps' ? 'Distance is shown only for donor GPS updated within 48 hours. Expired GPS is never used for distance.' : 'Search without GPS uses only the selected filters and profile addresses. No distance is calculated.'}</div>{lastSearchType === 'gps' && donors.some((donor) => donor.locationSource === 'gps') && <LiveMap donorsList={donors}/>}<div className="sticky top-20 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-slate-900/95 p-4 shadow-xl"><p className="font-bold"><span className="text-red-400">{selectedDonors.length}</span> donor(s) selected</p><button disabled={!selectedDonors.length} onClick={openRequest} className="rounded-xl bg-red-600 px-5 py-3 font-black"><Send className="mr-2 inline h-4 w-4"/>Request Selected Donors</button></div><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{donors.map((donor) => {const selected=selectedDonors.some((item)=>item._id===donor._id);return <div key={donor._id} className={`rounded-3xl border p-5 ${selected?'border-emerald-500 bg-emerald-500/10':'border-slate-800 bg-slate-900/70'}`}><div className="flex justify-between"><div><p className="text-xl font-black">{donor.name}</p><p className="font-black text-red-400">{donor.bloodGroup}</p></div><span className="text-xs text-emerald-400">{donor.eligible ? 'Eligible' : 'Ineligible'}</span></div><div className="mt-4 space-y-2 text-sm text-slate-400"><p className="flex items-start"><MapPin className="mr-2 mt-0.5 h-4 w-4 shrink-0"/><span>{donorAddress(donor)}</span></p><p><Navigation className="mr-1 inline h-4 w-4"/>{lastSearchType === 'gps' && donor.locationSource === 'gps' && donor.distanceKm != null ? `Estimated ${donor.distanceKm} km straight-line (GPS updated within 48 hours)` : lastSearchType === 'gps' ? 'Distance unavailable — GPS expired or not shared; matched by profile address' : 'Matched by profile address — distance not calculated'}</p></div><button onClick={() => toggleDonor(donor)} className={`mt-5 w-full rounded-xl py-3 font-bold ${selected?'bg-emerald-600':'bg-slate-700'}`}>{selected?'Selected - Click to Remove':'Select Donor'}</button></div>})}</div></div>}
    {requestOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4"><form onSubmit={send} className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6"><div className="sticky -top-6 z-10 mb-5 flex justify-between border-b border-slate-800 bg-slate-900 py-4"><div><h2 className="text-2xl font-black">Send Search Request</h2><p className="text-sm text-slate-400">To {selectedDonors.length} selected donor(s)</p></div><button type="button" onClick={() => setRequestOpen(false)} className="rounded-xl bg-slate-800 p-2"><X/></button></div><div className="space-y-3">{['patientName','hospitalName','hospitalAddress','contactNumber'].map((name) => <input key={name} name={name} required value={form[name]} onChange={(event) => setForm((previous) => ({ ...previous, [name]:event.target.value }))} placeholder={name} className={input}/>)}<input type="number" min="1" max="20" name="bagsRequired" value={form.bagsRequired} onChange={(event) => setForm((previous) => ({ ...previous, bagsRequired:event.target.value }))} className={input}/><DateTimePicker value={form.neededAt} onChange={(neededAt) => setForm((previous) => ({ ...previous, neededAt }))}/><button className="w-full rounded-xl bg-emerald-600 py-3 font-black">Send Request to {selectedDonors.length} Donor(s)</button></div></form></div>}
  </div></div>;
}

function Select({ label, name, value, onChange, options, disabled }) { return <div><label className="text-xs uppercase text-slate-400">{label}</label><select disabled={disabled} name={name} value={value} onChange={onChange} className={`${input} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}>{options.map((option) => <option key={option} value={option}>{option || 'All'}</option>)}</select></div>; }
function donorAddress(donor) { return [donor.city, donor.thana, donor.district, donor.division].filter(Boolean).filter((value, index, array) => array.indexOf(value) === index).join(', ') || 'Address not provided'; }
function getLiveGps() { return new Promise((resolve, reject) => { if (!navigator.geolocation) return reject(new Error('Your browser does not support GPS location.')); navigator.geolocation.getCurrentPosition((position) => resolve({ lat:position.coords.latitude, lng:position.coords.longitude }), (error) => { const messages = { 1:'Location permission was denied. Please allow location access and try again.', 2:'Your current location is unavailable. Please turn on GPS and try again.', 3:'GPS request timed out. Please try again.' }; reject(new Error(messages[error.code] || 'Could not access your live GPS location.')); }, { enableHighAccuracy:true, timeout:12000, maximumAge:0 }); }); }
