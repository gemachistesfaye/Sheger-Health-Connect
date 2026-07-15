import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import usePageTitle from '../hooks/usePageTitle';
import { Activity, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';

const Login = () => {
  usePageTitle('Sign In');
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const data = await api.post('/api/auth/login', { username: username.trim(), password }, { requireAuth: false });

      if (data.success) {
        login(data.data, data.data.token);
        const role = data.data.role?.toLowerCase();
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'doctor') navigate('/doctor/dashboard');
        else navigate('/patient/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/5 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-[32px] shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity size={120} />
          </div>
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity size={32} className="text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{t('auth.welcome')}</h1>
            <p className="text-gray-500 text-sm">{t('auth.signInSubtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 text-center font-bold border border-red-100" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10" noValidate>
            <div>
              <label htmlFor="login-username" className="block text-sm font-semibold text-gray-600 mb-2 px-1">Username</label>
              <input
                id="login-username"
                type="text"
                required
                autoComplete="username"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-gray-600 mb-2 px-1">{t('auth.password')}</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-sm pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-lg p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : t('auth.signIn')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 space-y-2 relative z-10">
            <Link to="/forgot-password" className="text-emerald-600 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-lg px-2 py-0.5">
              Forgot your password?
            </Link>
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-lg px-2 py-0.5">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
