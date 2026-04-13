import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiShield, FiLogOut, FiSearch, FiFilter, FiCheckCircle, FiXCircle, FiClock,
  FiFileText, FiHome, FiDollarSign, FiCreditCard, FiUser, FiChevronDown,
  FiChevronUp, FiExternalLink, FiRefreshCw, FiLoader, FiInbox, FiCalendar,
  FiPhone, FiMapPin, FiHash, FiBarChart2, FiDownload
} from 'react-icons/fi';
import insforge from '../lib/insforge';

const serviceInfo = {
  caste_certificate: { title: 'Caste Certificate', titleHi: 'जाति प्रमाण पत्र', icon: <FiFileText />, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', text: 'text-primary-600' },
  residential_certificate: { title: 'Residential Certificate', titleHi: 'निवास प्रमाण पत्र', icon: <FiHome />, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50', text: 'text-accent-600' },
  income_certificate: { title: 'Income Certificate', titleHi: 'आय प्रमाण पत्र', icon: <FiDollarSign />, color: 'from-saffron-500 to-saffron-600', bg: 'bg-saffron-50', text: 'text-saffron-600' },
  pan_card: { title: 'PAN Card', titleHi: 'पैन कार्ड', icon: <FiCreditCard />, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
  aadhaar_card: { title: 'Aadhaar Card', titleHi: 'आधार कार्ड', icon: <FiUser />, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
};

const statusConfig = {
  pending: { label: 'Pending', icon: <FiClock />, color: 'text-saffron-600', bg: 'bg-saffron-50', border: 'border-saffron-200', badge: 'status-pending' },
  approved: { label: 'Approved', icon: <FiCheckCircle />, color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-200', badge: 'status-approved' },
  rejected: { label: 'Rejected', icon: <FiXCircle />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', badge: 'status-rejected' },
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  // Check admin auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (!data?.user) {
          navigate('/admin/login', { replace: true });
          return;
        }

        // Verify admin
        const { data: adminData } = await insforge.database
          .from('admin_users')
          .select()
          .eq('email', data.user.email)
          .maybeSingle();

        if (!adminData) {
          await insforge.auth.signOut();
          navigate('/admin/login', { replace: true });
          return;
        }

        setAdminUser(data.user);
      } catch {
        navigate('/admin/login', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      const { data, error } = await insforge.database
        .from('applications')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;

      const apps = data || [];
      setApplications(apps);

      // Calculate stats
      setStats({
        total: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
        approved: apps.filter(a => a.status === 'approved').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
      });
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (adminUser) fetchApplications();
  }, [adminUser, fetchApplications]);

  // Filter applications
  useEffect(() => {
    let result = [...applications];

    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }

    if (serviceFilter !== 'all') {
      result = result.filter(a => a.service_type === serviceFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.full_name?.toLowerCase().includes(term) ||
        a.tracking_id?.toLowerCase().includes(term) ||
        a.mobile_number?.includes(term) ||
        a.father_name?.toLowerCase().includes(term)
      );
    }

    setFilteredApps(result);
  }, [applications, statusFilter, serviceFilter, searchTerm]);

  // Update application status
  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      const { error } = await insforge.database
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: newStatus, updated_at: new Date().toISOString() } : app
        )
      );
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const handleLogout = async () => {
    await insforge.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading || !adminUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface-100">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-surface-700 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-surface-100">
      {/* Admin Header */}
      <div className="hero-bg pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-2xl">
                <FiShield />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white">
                  Admin Dashboard
                </h1>
                <p className="text-white/60 text-sm">
                  Welcome, {adminUser.profile?.name || adminUser.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50"
                id="refresh-btn"
              >
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} /> Refresh
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 text-sm font-medium hover:bg-red-500/30 transition-all"
                id="logout-btn"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 -mt-10 md:-mt-12 relative z-10">
          {[
            { label: 'Total Applications', value: stats.total, icon: <FiBarChart2 />, gradient: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/20' },
            { label: 'Pending Review', value: stats.pending, icon: <FiClock />, gradient: 'from-saffron-500 to-saffron-600', shadow: 'shadow-saffron-500/20' },
            { label: 'Approved', value: stats.approved, icon: <FiCheckCircle />, gradient: 'from-accent-500 to-accent-600', shadow: 'shadow-accent-500/20' },
            { label: 'Rejected', value: stats.rejected, icon: <FiXCircle />, gradient: 'from-red-500 to-red-600', shadow: 'shadow-red-500/20' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white text-lg mb-3 shadow-lg ${stat.shadow}`}>
                {stat.icon}
              </div>
              <p className="font-display font-extrabold text-2xl md:text-3xl text-surface-900">{stat.value}</p>
              <p className="text-xs text-surface-800 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="glass-card rounded-2xl p-4 md:p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-700" />
              <input
                type="text"
                id="admin-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, tracking ID, or mobile..."
                className="input-field pl-11"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-700 pointer-events-none" />
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-11 pr-10 appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-700 pointer-events-none" />
            </div>

            {/* Service Filter */}
            <div className="relative">
              <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-700 pointer-events-none" />
              <select
                id="service-filter"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="input-field pl-11 pr-10 appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="all">All Services</option>
                {Object.entries(serviceInfo).map(([key, info]) => (
                  <option key={key} value={key}>{info.title}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-700 pointer-events-none" />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-surface-700">
              Showing {filteredApps.length} of {applications.length} applications
            </p>
            {(statusFilter !== 'all' || serviceFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => { setStatusFilter('all'); setServiceFilter('all'); setSearchTerm(''); }}
                className="text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-surface-300 flex items-center justify-center">
              <FiInbox className="text-gray-300 text-4xl" />
            </div>
            <h3 className="font-display font-bold text-lg text-gray-600 mb-2">
              {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
            </h3>
            <p className="text-sm text-surface-700">
              {applications.length === 0
                ? 'Applications submitted by villagers will appear here.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const service = serviceInfo[app.service_type] || {
                title: app.service_type, icon: <FiFileText />, color: 'from-gray-500 to-gray-600', bg: 'bg-surface-200', text: 'text-gray-600'
              };
              const status = statusConfig[app.status] || statusConfig.pending;
              const isExpanded = expandedId === app.id;
              const isUpdating = updating === app.id;

              return (
                <div
                  key={app.id}
                  className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-xl ring-1 ring-primary-200' : 'hover:shadow-lg'}`}
                >
                  {/* Collapsed Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-surface-200/50 transition-colors"
                    id={`app-row-${app.tracking_id}`}
                  >
                    {/* Service icon */}
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-lg shadow-md shrink-0`}>
                      {service.icon}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-display font-bold text-surface-900 truncate">{app.full_name}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-700">
                        <span className="font-mono text-primary-500 font-semibold">{app.tracking_id}</span>
                        <span>{service.title}</span>
                        <span className="hidden sm:inline">{formatDateShort(app.created_at)}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`status-badge ${status.badge} shrink-0`}>
                      <span className="flex items-center gap-1.5">
                        {status.icon} {status.label}
                      </span>
                    </span>

                    {/* Expand icon */}
                    <div className="text-surface-700 shrink-0">
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-surface-200 animate-slide-up">
                      <div className="p-5 md:p-6">
                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          <DetailItem icon={<FiUser />} label="Full Name" value={app.full_name} />
                          <DetailItem icon={<FiUser />} label="Father's Name" value={app.father_name} />
                          <DetailItem icon={<FiCalendar />} label="Date of Birth" value={formatDateShort(app.date_of_birth)} />
                          <DetailItem icon={<FiPhone />} label="Mobile" value={app.mobile_number} />
                          <DetailItem icon={<FiHash />} label="Tracking ID" value={app.tracking_id} mono />
                          <DetailItem icon={<FiCalendar />} label="Applied On" value={formatDate(app.created_at)} />
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3 mb-6 p-3 rounded-xl bg-surface-200">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-surface-800 shrink-0 shadow-sm">
                            <FiMapPin className="text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">Address</p>
                            <p className="text-sm text-gray-700">{app.address}</p>
                          </div>
                        </div>

                        {/* Document Link */}
                        {app.document_url && (
                          <div className="mb-6">
                            <a
                              href={app.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors"
                              id={`doc-link-${app.tracking_id}`}
                            >
                              <FiDownload /> View Uploaded Document <FiExternalLink className="text-xs" />
                            </a>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-surface-200">
                          <span className="text-xs text-surface-700 font-medium mr-2">Update Status:</span>

                          {app.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(app.id, 'approved')}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-semibold shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                              id={`approve-${app.tracking_id}`}
                            >
                              {isUpdating ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                              Approve
                            </button>
                          )}

                          {app.status !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(app.id, 'rejected')}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                              id={`reject-${app.tracking_id}`}
                            >
                              {isUpdating ? <FiLoader className="animate-spin" /> : <FiXCircle />}
                              Reject
                            </button>
                          )}

                          {app.status !== 'pending' && (
                            <button
                              onClick={() => updateStatus(app.id, 'pending')}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-saffron-300 text-saffron-600 text-sm font-semibold hover:bg-saffron-50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                              id={`reset-${app.tracking_id}`}
                            >
                              {isUpdating ? <FiLoader className="animate-spin" /> : <FiClock />}
                              Reset to Pending
                            </button>
                          )}

                          {/* Last updated */}
                          {app.updated_at && app.updated_at !== app.created_at && (
                            <span className="ml-auto text-xs text-surface-700">
                              Last updated: {formatDate(app.updated_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable detail item component
function DetailItem({ icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-surface-300 flex items-center justify-center text-surface-800 mt-0.5 shrink-0">
        <span className="text-sm">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-sm font-medium text-surface-900 truncate ${mono ? 'font-mono text-primary-600' : ''}`}>{value}</p>
      </div>
    </div>
  );
}
