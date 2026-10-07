import { useState } from 'react';
import { ArrowRight, Check, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password || !form.confirm) {
      setError('Complete all fields to create your account.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.register(form.email, form.password);

      if (data?.message !== 'Verification OTP Sent') {
        throw new Error(data?.message || 'Unable to send verification code.');
      }

      setForm((current) => ({ ...current, password: '', confirm: '' }));
      setVerifying(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function verify(event) {
    event.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      await api.verifyRegistration(form.email, otp);
      setOtp('');
      navigate('/login', { state: { registered: true } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink text-white">
      <Navbar />
      <main className="mx-auto flex max-w-md px-5 py-12 sm:py-20">
        <div className="w-full animate-rise">
          <div className="mb-8">
            <div className="icon-badge">
              <Check size={20} />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold">
              {verifying ? 'Verify your email' : 'Create your account'}
            </h1>
            <p className="mt-2 text-slate-400">
              {verifying
                ? `Enter the 6-digit code sent to ${form.email}.`
                : 'Start making every link count.'}
            </p>
          </div>

          {verifying ? (
            <form onSubmit={verify} className="space-y-5">
              <label className="field-label">
                Verification code
                <input
                  className="field"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                />
              </label>

              {error && <p className="error-box">{error}</p>}

              <button
                className="button-primary w-full py-3.5"
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
                {loading ? 'Verifying...' : 'Verify email'}
              </button>
            </form>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <label className="field-label">
                Email
                <input
                  className="field"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                />
                <Mail className="field-icon" size={17} />
              </label>

              <label className="field-label">
                Password
                <input
                  className="field"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                />
                <LockKeyhole className="field-icon" size={17} />
              </label>

              <label className="field-label">
                Confirm password
                <input
                  className="field"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={(event) =>
                    setForm({ ...form, confirm: event.target.value })
                  }
                />
                <LockKeyhole className="field-icon" size={17} />
              </label>

              {error && <p className="error-box">{error}</p>}

              <button
                className="button-primary w-full py-3.5"
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
                {loading ? 'Sending code...' : 'Create account'}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              className="font-semibold text-electric hover:text-white"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}