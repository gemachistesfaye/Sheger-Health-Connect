import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.put(`/api/auth/resetpassword/${token}`, { password }, { requireAuth: false });

      if (data.success) {
        login(data.data, data.data.token);
        navigate('/patient/dashboard');
      } else {
        setError(data.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/5 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Set New Password</h1>
          <p className="text-muted-foreground">Please enter your new password below.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              required
              minLength="6"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              minLength="6"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-medium hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
