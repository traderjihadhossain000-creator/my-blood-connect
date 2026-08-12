import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Search, ClipboardList, LogOut, UserRound, LayoutDashboard, HandHeart } from 'lucide-react';
import { clearSession, getActiveMode, getStoredUser, setActiveMode } from '../lib/api';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser);
  const [mode, setMode] = useState(getActiveMode);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    const syncMode = () => setMode(getActiveMode());
    window.addEventListener('session-changed', syncUser);
    window.addEventListener('storage', syncUser);
    window.addEventListener('mode-changed', syncMode);
    return () => {
      window.removeEventListener('session-changed', syncUser);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('mode-changed', syncMode);
    };
  }, []);

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  const switchMode = (nextMode) => { setActiveMode(nextMode); setMode(nextMode); navigate('/dashboard'); };
  const navClass = ({ isActive }) => `rounded-xl px-3 py-2 transition-colors ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-950/40' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`;

  return <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 px-4 py-4"><div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center"><Link to="/" className="flex items-center gap-2"><Heart className="text-red-500 fill-red-500"/><span className="font-black tracking-wider">BLOOD CONNECT</span></Link><div className="flex flex-wrap items-center gap-3 text-sm">{user && <div className="flex rounded-xl border border-slate-700 bg-slate-950 p-1"><button onClick={()=>switchMode('recipient')} className={`rounded-lg px-3 py-1.5 font-bold ${mode==='recipient'?'bg-red-600 text-white':'text-slate-400'}`}>Recipient</button><button onClick={()=>switchMode('donor')} className={`rounded-lg px-3 py-1.5 font-bold ${mode==='donor'?'bg-emerald-600 text-white':'text-slate-400'}`}><HandHeart className="mr-1 inline h-4 w-4"/>Donor</button></div>}{mode==='recipient'&&<NavLink to="/search" className={navClass}><Search className="inline w-4 h-4 mr-1"/>Search</NavLink>}<NavLink to="/requests" className={navClass}><ClipboardList className="inline w-4 h-4 mr-1"/>Requests</NavLink>{user?<><NavLink to="/dashboard" className={navClass}><LayoutDashboard className="inline w-4 h-4 mr-1"/>Dashboard</NavLink><NavLink to="/profile" className={navClass}><UserRound className="inline w-4 h-4 mr-1"/>Profile</NavLink><button onClick={logout} className="bg-red-600 px-4 py-2 rounded-xl font-bold"><LogOut className="inline w-4 h-4 mr-1"/>Logout</button></>:<NavLink to="/login" className={navClass}>Login</NavLink>}</div></div></nav>;
}
