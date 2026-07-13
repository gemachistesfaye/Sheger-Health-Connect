import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import api from '../lib/api';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await api.post('/api/auth/forgotpassword', { email }, { requireAuth: false });

      if (data.success) {
        setMessage('Email sent successfully. Please check your inbox for reset instructions.');
      } else {
        setError(data.message || 'Failed to send email. Please try again.');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
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
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive a password reset link.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-6 text-center font-medium">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm mb-6 text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
            <input
              type="email"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Remembered your password? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
