import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';

export default function App() { return <Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /></Route><Route path="/404" element={<NotFound />} /><Route path="*" element={<Navigate to="/404" replace />} /></Routes>; }