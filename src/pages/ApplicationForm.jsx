import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUpload, FiCheckCircle, FiArrowLeft, FiFileText, FiHome, FiDollarSign, FiCreditCard, FiUser, FiCopy } from 'react-icons/fi';
import insforge from '../lib/insforge';

const serviceInfo = {
  caste_certificate: { title: 'Caste Certificate', titleHi: 'जाति प्रमाण पत्र', icon: <FiFileText />, color: 'from-primary-500 to-primary-600' },
  residential_certificate: { title: 'Residential Certificate', titleHi: 'निवास प्रमाण पत्र', icon: <FiHome />, color: 'from-accent-500 to-accent-600' },
  income_certificate: { title: 'Income Certificate', titleHi: 'आय प्रमाण पत्र', icon: <FiDollarSign />, color: 'from-saffron-500 to-saffron-600' },
  pan_card: { title: 'PAN Card', titleHi: 'पैन कार्ड', icon: <FiCreditCard />, color: 'from-violet-500 to-violet-600' },
  aadhaar_card: { title: 'Aadhaar Card', titleHi: 'आधार कार्ड', icon: <FiUser />, color: 'from-rose-500 to-rose-600' },
};

export default function ApplicationForm() {
  const { serviceType } = useParams();
  const service = serviceInfo[serviceType];

  const [form, setForm] = useState({
    full_name: '',
    father_name: '',
    date_of_birth: '',
    address: '',
    mobile_number: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-surface-900 mb-3">Service Not Found</h2>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateTrackingId = () => {
    const prefix = serviceType.split('_').map(w => w[0].toUpperCase()).join('');
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PK-${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate mobile
      if (!/^[6-9]\d{9}$/.test(form.mobile_number)) {
        throw new Error('Please enter a valid 10-digit Indian mobile number');
      }

      let documentUrl = null;
      let documentKey = null;

      // Upload document if provided
      if (file) {
        const { data: uploadData, error: uploadError } = await insforge.storage
          .from('documents')
          .uploadAuto(file);

        if (uploadError) throw new Error('Failed to upload document: ' + uploadError.message);
        documentUrl = uploadData.url;
        documentKey = uploadData.key;
      }

      const trackingId = generateTrackingId();

      // Insert application
      const { data, error: insertError } = await insforge.database
        .from('applications')
        .insert({
          service_type: serviceType,
          full_name: form.full_name,
          father_name: form.father_name,
          date_of_birth: form.date_of_birth,
          address: form.address,
          mobile_number: form.mobile_number,
          document_url: documentUrl,
          document_key: documentKey,
          tracking_id: trackingId,
          status: 'pending',
        })
        .select();

      if (insertError) throw new Error('Failed to submit application: ' + insertError.message);

      setSuccess({ trackingId, data: data?.[0] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingId = () => {
    if (success?.trackingId) {
      navigator.clipboard.writeText(success.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full glass-card rounded-3xl p-8 text-center animate-slide-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-100 flex items-center justify-center">
            <FiCheckCircle className="text-accent-500 text-4xl" />
          </div>
          <h2 className="font-display font-bold text-2xl text-surface-900 mb-2">Application Submitted!</h2>
          <p className="text-surface-800 mb-6">Your application for {service.title} has been submitted successfully.</p>

          <div className="bg-surface-200 rounded-2xl p-4 mb-6">
            <p className="text-xs text-surface-800 mb-2 uppercase tracking-wider font-semibold">Your Tracking ID</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-bold text-primary-600 font-mono">{success.trackingId}</code>
              <button
                onClick={copyTrackingId}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Copy tracking ID"
              >
                <FiCopy className={copied ? 'text-accent-500' : 'text-surface-700'} />
              </button>
            </div>
            {copied && <p className="text-xs text-accent-500 mt-1">Copied!</p>}
          </div>

          <p className="text-xs text-surface-700 mb-6">Save this ID to track your application status</p>

          <div className="flex flex-col gap-3">
            <Link to="/track" className="btn-primary w-full justify-center">Track Application</Link>
            <Link to="/" className="btn-outline w-full justify-center">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-surface-100 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-surface-800 hover:text-primary-600 transition-colors mb-4">
            <FiArrowLeft /> Back to Services
          </Link>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
              {service.icon}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-surface-900">{service.title}</h1>
              <p className="text-primary-500 font-medium">{service.titleHi}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="full_name">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="father_name">
              Father's Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="father_name"
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              required
              placeholder="Enter father's name"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="date_of_birth">
                Date of Birth <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="mobile_number">
                Mobile Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="mobile_number"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="address">
              Full Address <span className="text-red-400">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter your complete address with village, tehsil, district, state"
              className="input-field resize-none"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Upload Supporting Document
            </label>
            <div className="relative">
              <input
                type="file"
                id="document_upload"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label
                htmlFor="document_upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300"
              >
                {file ? (
                  <div className="text-center">
                    <FiCheckCircle className="mx-auto text-2xl text-accent-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-surface-700 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FiUpload className="mx-auto text-2xl text-surface-700 mb-2" />
                    <p className="text-sm text-surface-800">Click to upload PDF, JPG or PNG</p>
                    <p className="text-xs text-surface-700 mt-1">Max file size: 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            id="submit-application"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>

          <p className="text-xs text-surface-700 text-center">
            By submitting, you confirm that all information provided is accurate.
          </p>
        </form>
      </div>
    </div>
  );
}
