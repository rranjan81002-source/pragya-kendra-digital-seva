import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCheckCircle, FiClock, FiXCircle, FiFileText, FiHome, FiDollarSign, FiCreditCard, FiUser, FiArrowLeft, FiCalendar, FiPhone, FiMapPin, FiLoader } from 'react-icons/fi';
import insforge from '../lib/insforge';

const serviceInfo = {
  caste_certificate: { title: 'Caste Certificate', titleHi: 'जाति प्रमाण पत्र', icon: <FiFileText />, color: 'from-primary-500 to-primary-600' },
  residential_certificate: { title: 'Residential Certificate', titleHi: 'निवास प्रमाण पत्र', icon: <FiHome />, color: 'from-accent-500 to-accent-600' },
  income_certificate: { title: 'Income Certificate', titleHi: 'आय प्रमाण पत्र', icon: <FiDollarSign />, color: 'from-saffron-500 to-saffron-600' },
  pan_card: { title: 'PAN Card', titleHi: 'पैन कार्ड', icon: <FiCreditCard />, color: 'from-violet-500 to-violet-600' },
  aadhaar_card: { title: 'Aadhaar Card', titleHi: 'आधार कार्ड', icon: <FiUser />, color: 'from-rose-500 to-rose-600' },
};

const statusConfig = {
  pending: { label: 'Pending Review', icon: <FiClock />, color: 'text-saffron-600', bg: 'bg-saffron-50', border: 'border-saffron-200', badge: 'status-pending' },
  approved: { label: 'Approved', icon: <FiCheckCircle />, color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-200', badge: 'status-approved' },
  rejected: { label: 'Rejected', icon: <FiXCircle />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', badge: 'status-rejected' },
};

export default function TrackStatus() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setApplication(null);
    setSearched(true);

    try {
      const { data, error: fetchError } = await insforge.database
        .from('applications')
        .select()
        .eq('tracking_id', trackingId.trim().toUpperCase())
        .maybeSingle();

      if (fetchError) throw new Error(fetchError.message);

      if (!data) {
        setError('No application found with this tracking ID. Please check and try again.');
      } else {
        setApplication(data);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const service = application ? serviceInfo[application.service_type] : null;
  const status = application ? statusConfig[application.status] || statusConfig.pending : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeline = () => {
    if (!application) return [];
    const steps = [
      { label: 'Application Submitted', date: application.created_at, completed: true },
      { label: 'Under Review', date: null, completed: application.status !== 'pending' },
      {
        label: application.status === 'rejected' ? 'Rejected' : 'Approved & Processing',
        date: application.status !== 'pending' ? application.updated_at : null,
        completed: application.status !== 'pending',
        isRejected: application.status === 'rejected',
      },
    ];
    if (application.status !== 'rejected') {
      steps.push({
        label: 'Ready for Collection',
        date: null,
        completed: false,
      });
    }
    return steps;
  };

  return (
    <div className="py-8 md:py-12 bg-surface-100 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-surface-800 hover:text-primary-600 transition-colors mb-4">
            <FiArrowLeft /> Back to Home
          </Link>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl shadow-lg shadow-primary-500/20">
              <FiSearch />
            </div>
            <h1 className="font-display font-extrabold text-3xl text-surface-900 mb-2">
              Track Application
            </h1>
            <p className="text-surface-800">
              Enter your tracking ID to check the status of your application
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="glass-card rounded-3xl p-6 md:p-8 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-700" />
              <input
                type="text"
                id="tracking-id-input"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="e.g. PK-CC-XXXXXX-XXXX"
                className="input-field pl-11 font-mono tracking-wider uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !trackingId.trim()}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              id="track-btn"
            >
              {loading ? (
                <FiLoader className="animate-spin text-lg" />
              ) : (
                'Track'
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="glass-card rounded-3xl p-6 text-center animate-slide-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <FiXCircle className="text-red-400 text-3xl" />
            </div>
            <h3 className="font-display font-bold text-lg text-surface-900 mb-2">Not Found</h3>
            <p className="text-sm text-surface-800 mb-4">{error}</p>
            <p className="text-xs text-surface-700">
              Make sure you've entered the correct tracking ID that was provided at the time of application.
            </p>
          </div>
        )}

        {/* Result */}
        {application && service && status && (
          <div className="space-y-6 animate-slide-up">
            {/* Status Banner */}
            <div className={`glass-card rounded-3xl overflow-hidden`}>
              <div className={`${status.bg} ${status.border} border-b px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl ${status.color}`}>{status.icon}</span>
                  <div>
                    <p className="text-xs text-surface-800 uppercase tracking-wider font-semibold">Application Status</p>
                    <p className={`font-display font-bold text-lg ${status.color}`}>{status.label}</p>
                  </div>
                </div>
                <span className={`status-badge ${status.badge}`}>{application.status}</span>
              </div>

              {/* Application Details */}
              <div className="p-6 space-y-4">
                {/* Service Type */}
                <div className="flex items-center gap-3 pb-4 border-b border-surface-200">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-xl shadow-md`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-surface-900">{service.title}</h3>
                    <p className="text-sm text-primary-500 font-medium">{service.titleHi}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-300 flex items-center justify-center text-surface-800 mt-0.5 shrink-0">
                      <FiUser className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">Applicant</p>
                      <p className="text-sm font-medium text-surface-900">{application.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-300 flex items-center justify-center text-surface-800 mt-0.5 shrink-0">
                      <FiUser className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">Father's Name</p>
                      <p className="text-sm font-medium text-surface-900">{application.father_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-300 flex items-center justify-center text-surface-800 mt-0.5 shrink-0">
                      <FiCalendar className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">Date of Birth</p>
                      <p className="text-sm font-medium text-surface-900">{formatDate(application.date_of_birth)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-300 flex items-center justify-center text-surface-800 mt-0.5 shrink-0">
                      <FiPhone className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">Mobile</p>
                      <p className="text-sm font-medium text-surface-900">{application.mobile_number}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-300 flex items-center justify-center text-surface-800 mt-0.5 shrink-0">
                    <FiMapPin className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">Address</p>
                    <p className="text-sm font-medium text-surface-900">{application.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-surface-200">
                  <div className="w-8 h-8 rounded-lg bg-surface-300 flex items-center justify-center text-surface-800 mt-0.5 shrink-0">
                    <FiCalendar className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-700 uppercase tracking-wider font-semibold">Applied On</p>
                    <p className="text-sm font-medium text-surface-900">{formatDate(application.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-display font-bold text-lg text-surface-900 mb-5">Application Timeline</h3>
              <div className="space-y-0">
                {getTimeline().map((step, i, arr) => (
                  <div key={i} className="flex gap-4">
                    {/* Timeline dot & line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.isRejected
                          ? 'bg-red-100 text-red-500'
                          : step.completed
                            ? 'bg-accent-100 text-accent-600'
                            : 'bg-surface-300 text-surface-700'
                      }`}>
                        {step.isRejected ? (
                          <FiXCircle className="text-sm" />
                        ) : step.completed ? (
                          <FiCheckCircle className="text-sm" />
                        ) : (
                          <FiClock className="text-sm" />
                        )}
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`w-0.5 h-8 ${step.completed ? 'bg-accent-200' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-4 ${i < arr.length - 1 ? '' : ''}`}>
                      <p className={`text-sm font-semibold ${
                        step.isRejected ? 'text-red-700' : step.completed ? 'text-surface-900' : 'text-surface-700'
                      }`}>{step.label}</p>
                      {step.date && (
                        <p className="text-xs text-surface-700 mt-0.5">{formatDate(step.date)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State (before search) */}
        {!searched && !loading && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
              <FiSearch className="text-primary-300 text-4xl" />
            </div>
            <p className="text-surface-700 text-sm">
              Enter your tracking ID above to view your application status
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
