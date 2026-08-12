import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { X, Bell } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/SearchPage';
import EmergencyBoard from './pages/EmergencyBoard';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import { API_URL, getStoredUser, getToken } from './lib/api';

function ProtectedRoute({ children }) {
 const user = getStoredUser();
 if (!getToken() || !user) return <Navigate to="/login" replace />;
 return children;
}

export default function App(){
 const [alert,setAlert]=useState(null); const [show,setShow]=useState(false);
 useEffect(()=>{const token=getToken();if(!token)return undefined;const socket=io(API_URL,{auth:{token},transports:['websocket','polling']});const onRequest=(data)=>{setAlert(data);setShow(true);};socket.on('blood_request_received',onRequest);socket.on('request_response_updated',onRequest);socket.on('blood_request_cancelled',onRequest);return()=>{socket.off('blood_request_received',onRequest);socket.off('request_response_updated',onRequest);socket.off('blood_request_cancelled',onRequest);socket.disconnect();};},[]);
 return <Router><Navbar/>{show&&alert&&<div className="fixed top-20 right-4 z-50 w-[min(380px,calc(100%-2rem))] bg-slate-900 border border-red-500 rounded-2xl p-5 shadow-2xl"><button onClick={()=>setShow(false)} className="absolute top-3 right-3"><X className="w-4 h-4"/></button><Bell className="text-red-400 mb-2"/><p className="font-black">Blood Connect Update</p><p className="text-sm text-slate-300 mt-1">{alert.message||`Blood request ${alert.type||'updated'}.`}</p></div>}<Routes><Route path="/" element={<Home/>}/><Route path="/search" element={<ProtectedRoute><SearchPage/></ProtectedRoute>}/><Route path="/requests" element={<ProtectedRoute><EmergencyBoard/></ProtectedRoute>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/><Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Router>;
}
