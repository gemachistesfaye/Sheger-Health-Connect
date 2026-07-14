import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Activity, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[a-z]/.test(formData.password)) newErrors.password = 'Password must contain at least one lowercase letter';
    else if (!/\d/.test(formData.password)) newErrors.password = 'Password must contain at least one number';
    else if (!/[@$!%*?&#]/.test(formData.password)) newErrors.password = 'Password must contain at least one special character (@$!%*?&#)';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const data = await api.post('/api/auth/register', {
        full_name: formData.full_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'Patient'
      }, { requireAuth: false });

      if (data.success) {
        login(data.data, data.data.token);
        navigate('/patient/dashboard');
      } else {
        setServerError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setServerError('Network error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'full_name', label: t('auth.fullName'), type: 'text', placeholder: 'Abebe Bekele', required: true },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'abebeke26', required: true },
    { name: 'email', label: t('auth.email'), type: 'email', placeholder: 'name@example.com', required: false },
    { name: 'phone', label: t('auth.phone'), type: 'tel', placeholder: '+251...', required: true },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/5 px-4 py-12">
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
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{t('auth.createAccount')}</h1>
            <p className="text-gray-500 text-sm">{t('auth.join')}</p>
          </div>

          {serverError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 text-center font-bold border border-red-100" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10" noValidate>
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={`reg-${field.name}`} className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                <input
                  id={`reg-${field.name}`}
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-sm ${
                    errors[field.name] ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-emerald-500'
                  }`}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">
                {t('auth.password')} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={8}
                  className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-sm pr-12 ${
                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-emerald-500'
                  }`}
                  placeholder="Min. 8 characters (A-Z, a-z, 0-9, @#$!%*?&#)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-lg p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-bold mt-1 px-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">
                {t('auth.confirmPassword')} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm_password"
                  required
                  minLength={8}
                  className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-sm pr-12 ${
                    errors.confirm_password ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-emerald-500'
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-lg p-1"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs font-bold mt-1 px-1">{errors.confirm_password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : t('auth.register')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 relative z-10">
            {t('auth.alreadyAccount')}{' '}
            <Link to="/login" className="text-emerald-600 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-lg px-2 py-0.5">
              {t('auth.signInLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
