import { Link } from 'react-router-dom';
import { FiFileText, FiHome, FiDollarSign, FiCreditCard, FiUser, FiArrowRight, FiSearch, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';

const services = [
  {
    id: 'caste_certificate',
    title: 'Caste Certificate',
    titleHi: 'जाति प्रमाण पत्र',
    description: 'Apply for OBC/SC/ST caste certificate online. Required for reservation benefits and government schemes.',
    icon: <FiFileText />,
    color: 'from-primary-500 to-primary-600',
    shadow: 'shadow-primary-500/20',
    bgAccent: 'bg-primary-50',
  },
  {
    id: 'residential_certificate',
    title: 'Residential Certificate',
    titleHi: 'निवास प्रमाण पत्र',
    description: 'Get your residential/domicile certificate. Proof of residence for education and employment purposes.',
    icon: <FiHome />,
    color: 'from-accent-500 to-accent-600',
    shadow: 'shadow-accent-500/20',
    bgAccent: 'bg-accent-50',
  },
  {
    id: 'income_certificate',
    title: 'Income Certificate',
    titleHi: 'आय प्रमाण पत्र',
    description: 'Apply for income certificate online. Essential for scholarship applications and government subsidies.',
    icon: <FiDollarSign />,
    color: 'from-saffron-500 to-saffron-600',
    shadow: 'shadow-saffron-500/20',
    bgAccent: 'bg-saffron-50',
  },
  {
    id: 'pan_card',
    title: 'PAN Card',
    titleHi: 'पैन कार्ड',
    description: 'Apply for new PAN card or corrections. Mandatory for tax filing and financial transactions.',
    icon: <FiCreditCard />,
    color: 'from-violet-500 to-violet-600',
    shadow: 'shadow-violet-500/20',
    bgAccent: 'bg-violet-50',
  },
  {
    id: 'aadhaar_card',
    title: 'Aadhaar Card',
    titleHi: 'आधार कार्ड',
    description: 'Apply for new Aadhaar or update existing. Universal identity for all government services.',
    icon: <FiUser />,
    color: 'from-rose-500 to-rose-600',
    shadow: 'shadow-rose-500/20',
    bgAccent: 'bg-rose-50',
  },
];

const features = [
  { icon: <FiClock />, title: 'Fast Processing', desc: 'Get your documents processed quickly without long queues' },
  { icon: <FiShield />, title: 'Secure & Safe', desc: 'Your data is encrypted and stored securely' },
  { icon: <FiSearch />, title: 'Track Anytime', desc: 'Track your application status 24/7 online' },
  { icon: <FiCheckCircle />, title: 'Easy to Use', desc: 'Simple forms designed for everyone to use easily' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero-bg pattern-overlay overflow-hidden min-h-[520px] flex items-center">
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-soft" />
              <span className="text-white/90 text-sm font-medium">Government Digital Service Centre</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-surface-900 mb-4 animate-slide-up">
              Pragya Kendra
              <span className="block text-2xl md:text-3xl lg:text-4xl font-bold mt-2 text-surface-900">
                Khera Bera
              </span>
            </h1>

            <p className="text-lg md:text-xl text-surface-900 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Digital Services for Everyone — Apply for important government documents from the comfort of your home
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <a href="#services" className="btn-saffron gap-2 text-lg px-8 py-4">
                Apply Now <FiArrowRight />
              </a>
              <Link to="/track" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300">
                <FiSearch /> Track Application
              </Link>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V100H0V40Z" fill="#f7f7f2"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feat, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-primary flex items-center justify-center text-white text-xl shadow-lg shadow-primary-500/20">
                  {feat.icon}
                </div>
                <h3 className="font-display font-bold text-sm md:text-base text-surface-900 mb-1">{feat.title}</h3>
                <p className="text-xs text-surface-800 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4">Our Services</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-surface-900 mb-3">
              Available Services
            </h2>
            <p className="text-surface-800 max-w-xl mx-auto">
              Select a service below to start your application. All forms are easy to fill and submit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Link
                key={service.id}
                to={`/apply/${service.id}`}
                className="service-card group"
                id={`service-${service.id}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Gradient top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} rounded-t-2xl`} />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-2xl mb-4 shadow-lg ${service.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                <h3 className="font-display font-bold text-lg text-surface-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-primary-500 font-medium mb-2">{service.titleHi}</p>
                <p className="text-sm text-surface-800 mb-4 leading-relaxed">{service.description}</p>

                <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  Apply Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl hero-bg pattern-overlay p-8 md:p-12 text-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="particle" style={{ left: `${25 * i + 10}%`, animationDelay: `${i * 5}s` }} />
            ))}
            <div className="relative z-10">
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white mb-3">
                Already Applied?
              </h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Track your application status using your tracking ID. Get instant updates on your document processing.
              </p>
              <Link to="/track" className="btn-saffron gap-2 text-lg">
                <FiSearch /> Track Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
