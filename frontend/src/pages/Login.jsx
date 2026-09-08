import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError('');
    if (!form.email || !form.password) return setError('Enter your email and password to continue.');
    setLoading(true);
    try { const data = await api.login(form.email, form.password); if (!data?.access_token) throw new Error(typeof data === 'string' ? data : 'Unable to sign in.'); localStorage.setItem('access_token', data.access_token); navigate('/dashboard'); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return <div className="min-h-screen bg-ink text-white"><Navbar /><main className="mx-auto flex max-w-md px-5 py-16 sm:py-24"><div className="w-full animate-rise"><div className="mb-10"><div className="icon-badge"><LockKeyhole size={19} /></div><h1 className="mt-6 font-display text-3xl font-bold">Welcome back</h1><p className="mt-2 text-slate-400">Sign in to manage your short links.</p></div><form onSubmit={submit} className="space-y-5"><label className="field-label">Email<input className="field" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><Mail className="field-icon" size={17} /></label><label className="field-label">Password<input className="field" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /><LockKeyhole className="field-icon" size={17} /></label>{error && <p className="error-box">{error}</p>}<button className="button-primary w-full py-3.5" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowRight size={18} />} {loading ? 'Signing in...' : 'Sign in'}</button></form><p className="mt-8 text-center text-sm text-slate-400">New to URL Shortener? <Link className="font-semibold text-electric hover:text-white" to="/register">Create an account</Link></p></div></main></div>;
}