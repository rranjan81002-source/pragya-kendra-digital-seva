import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiShield, FiMail, FiLock, FiArrowLeft, FiAlertCircle, FiLoader } from 'react-icons/fi';
import insforge from '../lib/insforge';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  // Check if already logged in as admin
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          // Verify admin status
          const { data: adminData } = await insforge.database
            .from('admin_users')
            .select()
            .eq('email', data.user.email)
            .maybeSingle();

          if (adminData) {
            navigate('/admin', { replace: true });
            return;
          }
        }
      } catch {
        // Not logged in, show login form
      }
      setChecking(false);
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with InsForge auth
      const { data, error: authError } = await insforge.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        throw new Error(authError.message || 'Invalid email or password');
      }

      if (!data?.user) {
        throw new Error('Login failed. Please try again.');
      }

      // Verify admin privileges
      const { data: adminData, error: adminError } = await insforge.database
        .from('admin_users')
        .select()
        .eq('email', data.user.email)
        .maybeSingle();

      if (adminError) throw new Error('Could not verify admin status');

      if (!adminData) {
        // Not an admin — sign them out
        await insforge.auth.signOut();
        throw new Error('Access denied. This account does not have admin privileges.');
      }

      // Admin verified, redirect to panel
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface-100">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-surface-700 text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative overflow-hidden bg-surface-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-100/50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-saffron-100/30 blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10 animate-slide-up">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-surface-800 hover:text-primary-600 transition-colors mb-6">
          <FiArrowLeft /> Back to Home
        </Link>

        {/* Login Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl hero-bg flex items-center justify-center shadow-xl shadow-primary-500/25">
              <FiShield className="text-white text-3xl" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-surface-900 mb-1">
              Admin Login
            </h1>
            <p className="text-surface-800 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-up">
              <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="admin-email">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-700" />
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@pragyakendra.com"
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-700" />
                <input
                  type="password"
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="input-field pl-11"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              id="admin-login-btn"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <FiLoader className="animate-spin text-xl" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FiShield /> Sign In
                </span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-xs text-surface-700 text-center mt-6">
            Only authorized administrators can access this portal.
            <br />Contact the system administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
