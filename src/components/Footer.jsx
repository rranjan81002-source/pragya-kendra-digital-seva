import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Tricolor stripe */}
      <div className="tricolor-stripe" />

      {/* Main Footer */}
      <div className="bg-white border-t border-gray-200 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Creator Section */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-gray-200 shadow-2xl">
                  <img
                    src="/creator-photo.png"
                    alt="Manoj Kumar Mahto"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center shadow-lg">
                  <span className="text-xs">✨</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-1">Manoj Kumar Mahto</h3>
              <p className="text-gray-500 text-sm mb-3">App Creator &amp; Developer</p>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100">
                <FiHeart className="text-red-500 text-xs" />
                <span className="text-xs text-gray-600">Made with love for Khera Bera</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Our Services</h3>
              <ul className="space-y-2.5">
                {['Caste Certificate', 'Residential Certificate', 'Income Certificate', 'PAN Card', 'Aadhaar Card'].map((service) => (
                  <li key={service} className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    <span className="text-gray-600 text-sm hover:text-primary-600 transition-colors cursor-pointer">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Contact Us</h3>
              <div className="space-y-3">
                <a href="tel:+919876543210" className="flex items-center gap-3 justify-center md:justify-start text-gray-600 hover:text-primary-600 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                    <FiPhone className="text-sm" />
                  </div>
                  <span className="text-sm">+91 98765 43210</span>
                </a>
                <a href="mailto:contact@pragyakendra.com" className="flex items-center gap-3 justify-center md:justify-start text-gray-600 hover:text-primary-600 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                    <FiMail className="text-sm" />
                  </div>
                  <span className="text-sm">contact@pragyakendra.com</span>
                </a>
                <div className="flex items-center gap-3 justify-center md:justify-start text-gray-600">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                    <FiMapPin className="text-sm" />
                  </div>
                  <span className="text-sm">Khera Bera, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Pragya Kendra Khera Bera. All rights reserved. | Digital Services for Everyone
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
