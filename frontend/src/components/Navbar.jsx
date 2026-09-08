import { ArrowUpRight, LogOut, Scissors } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ authenticated = false }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('access_token');
    navigate('/login');
  }

  return (
    <header className="relative z-10 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link to={authenticated ? '/dashboard' : '/'} className="flex items-center gap-3 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric text-ink shadow-lg shadow-electric/20"><Scissors size={18} strokeWidth={2.5} /></span>
          <span className="font-display text-lg font-bold tracking-tight">URL Shortener</span>
        </Link>
        {authenticated ? (
          <button onClick={logout} className="button-ghost"><LogOut size={16} /> Log out</button>
        ) : (
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/login" className="button-ghost">Log in</Link>
            <Link to="/register" className="button-primary hidden px-4 py-2.5 sm:inline-flex">Get started <ArrowUpRight size={16} /></Link>
          </nav>
        )}
      </div>
    </header>
  );
}