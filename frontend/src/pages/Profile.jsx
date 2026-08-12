import { useEffect, useState } from 'react';
import { Save, MapPin, UserRound, CalendarDays, ShieldCheck } from 'lucide-react';
import api, { API_URL, getStoredUser, saveSession } from '../lib/api';
import { divisions as fallbackDivisions, commonThanas as fallbackThanas } from '../data/bangladeshLocations';

export default function Profile() {
  const [user, setUser] = useState(getStoredUser());
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({});
  const [locations, setLocations] = useState({ divisions:fallbackDivisions, thanas:fallbackThanas });

  useEffect(() => {
    api.get('/api/auth/profile').then(({ data }) => { setUser(data.user); setForm(data.user); saveSession(localStorage.getItem('token'), data.user); }).catch(() => {});
    fetch(`${API_URL}/api/locations/hierarchy`).then((response)=>response.json()).then((data)=>{if(data.divisions&&data.thanas)setLocations({divisions:data.divisions,thanas:data.thanas});}).catch(()=>{});
  }, []);

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const changeDivision = (e) => setForm((p) => ({ ...p, division: e.target.value, district: '', thana: '' }));
  const changeDistrict = (e) => setForm((p) => ({ ...p, district: e.target.value, thana: '' }));
  const getLocation = () => navigator.geolocation?.getCurrentPosition((p) => setForm((v) => ({ ...v, latitude: p.coords.latitude, longitude: p.coords.longitude })));

  const save = async (e) => {
    e.preventDefault(); setError(''); setMessage('');
    try { const { data } = await api.put('/api/auth/profile', form); setUser(data.user); saveSession(localStorage.getItem('token'), data.user); setEditing(false); setMessage('Profile saved successfully.'); }
    catch (err) { setError(err.response?.data?.message || err.message || 'Profile update failed.'); }
  };

  if (!user) return <div className="min-h-screen bg-slate-950 text-white p-10 text-center">Please log in first.</div>;

  return <div className="min-h-screen bg-slate-950 text-white p-6"><div className="max-w-4xl mx-auto pt-10">
    <div className="flex justify-between items-center mb-8"><div><p className="text-red-400 text-xs font-black uppercase tracking-widest">Shared Profile</p><h1 className="text-4xl font-black">My Account Profile</h1><p className="mt-2 text-slate-400">Changes apply to both Donor and Recipient modes.</p></div><button onClick={() => setEditing(!editing)} className="px-5 py-3 rounded-xl bg-red-600 font-bold">{editing ? 'Cancel' : 'Edit Profile'}</button></div>
    {message && <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">{message}</div>}
    {error && <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{error}</div>}
    <form onSubmit={save} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7 grid md:grid-cols-2 gap-5">
      {['name','phone','age','weight','lastDonationDate','nidDocument','birthCertificateDocument'].map((name) => <div key={name}><label className="block text-xs text-slate-400 uppercase mb-2">{name === 'nidDocument' ? 'NID / Document URL' : name === 'birthCertificateDocument' ? 'Birth Certificate / Document URL' : name === 'lastDonationDate' ? 'Last Donation Date' : name}</label><input disabled={!editing} name={name} max={name === 'lastDonationDate' ? new Date().toISOString().slice(0,10) : undefined} value={name === 'lastDonationDate' && form[name] ? new Date(form[name]).toISOString().slice(0,10) : (form[name] ?? '')} onChange={change} type={['age','weight'].includes(name) ? 'number' : name === 'lastDonationDate' ? 'date' : 'text'} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 disabled:opacity-60 [color-scheme:dark]" /></div>)}
      <div><label className="block text-xs text-slate-400 uppercase mb-2">Blood Group</label><select disabled={!editing} name="bloodGroup" value={form.bloodGroup || ''} onChange={change} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>
      <div><label className="block text-xs text-slate-400 uppercase mb-2">Division</label><select disabled={!editing} name="division" value={form.division || ''} onChange={changeDivision} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"><option value="">Choose</option>{Object.keys(locations.divisions).map((d) => <option key={d}>{d}</option>)}</select></div>
      <div><label className="block text-xs text-slate-400 uppercase mb-2">District</label><select disabled={!editing} name="district" value={form.district || ''} onChange={changeDistrict} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"><option value="">Choose</option>{(locations.divisions[form.division] || []).map((d) => <option key={d}>{d}</option>)}</select></div>
      <div><label className="block text-xs text-slate-400 uppercase mb-2">Thana / Upazila</label><select disabled={!editing} name="thana" value={form.thana || ''} onChange={change} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"><option value="">Choose</option>{(locations.thanas[form.district] || []).map((t) => <option key={t}>{t}</option>)}</select></div>
      <div><label className="block text-xs text-slate-400 uppercase mb-2">City / Area</label><input disabled={!editing} name="city" value={form.city || ''} onChange={change} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" /></div>
      <div className="md:col-span-2 flex flex-wrap gap-3"><button type="button" onClick={getLocation} disabled={!editing} className="px-4 py-3 rounded-xl border border-slate-700 disabled:opacity-40"><MapPin className="inline w-4 h-4 mr-2" />Use Current Location</button>{editing && <button className="px-5 py-3 rounded-xl bg-emerald-600 font-bold"><Save className="inline w-4 h-4 mr-2" />Save Changes</button>}</div>
    </form>
    <div className="grid md:grid-cols-3 gap-4 mt-5"><Info icon={<UserRound />} label="Account" value="Donor + Recipient" /><Info icon={<ShieldCheck />} label="Donor Availability" value={user.isAvailable ? 'Available' : 'Unavailable'} /><Info icon={<CalendarDays />} label="Last Donation" value={user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : 'Never'} /></div>
  </div></div>;
}
function Info({ icon, label, value }) { return <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5"><div className="text-red-400 mb-2">{icon}</div><p className="text-xs uppercase text-slate-500">{label}</p><p className="font-bold mt-1">{value}</p></div>; }
