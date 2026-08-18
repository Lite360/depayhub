import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Phone, Tv, Lightbulb, ChevronRight, CheckCircle2 } from 'lucide-react';

export const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-surface/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">Depayhub</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard" className="text-sm font-medium text-primary hover:text-secondary transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-secondary transition-colors shadow-sm">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Background Decorative Blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

          <div className="text-center relative z-10">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
              Your Ultimate <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Bill Payment Partner</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Instantly purchase airtime, data, cable TV subscriptions, and electricity. Fast, secure, and reliable transactions anytime, anywhere.
            </p>
            
            <div className="flex justify-center gap-4">
              {user ? (
                <Link to="/dashboard" className="bg-primary text-white font-medium px-8 py-4 rounded-xl shadow-lg hover:bg-secondary transition-all hover:-translate-y-1 flex items-center gap-2">
                  Go to Dashboard <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link to="/register" className="bg-accent text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all hover:-translate-y-1 flex items-center gap-2">
                  Get Started Now <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need in one place</h2>
            <p className="mt-4 text-gray-600">Experience seamless payments across all major networks and providers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Phone className="w-6 h-6 text-blue-600" />}
              title="Airtime & Data"
              desc="Instant top-ups for MTN, Airtel, Glo, and 9mobile with amazing discounts."
              color="bg-blue-50"
            />
            <FeatureCard 
              icon={<Tv className="w-6 h-6 text-purple-600" />}
              title="Cable TV"
              desc="Never miss a moment. Instant subscription for DSTV, GOTV, and Startimes."
              color="bg-purple-50"
            />
            <FeatureCard 
              icon={<Lightbulb className="w-6 h-6 text-yellow-600" />}
              title="Electricity"
              desc="Recharge your prepaid meters instantly. Supports all major DisCos."
              color="bg-yellow-50"
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-orange-600" />}
              title="Fast Processing"
              desc="Transactions are processed and delivered in milliseconds."
              color="bg-orange-50"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why thousands choose Depayhub</h2>
              <ul className="space-y-6">
                {[
                  'Bank-grade security encryption for all transactions',
                  'Automated wallet funding system',
                  'Earn commissions through our referral program',
                  '24/7 dedicated customer support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
               <h3 className="text-2xl font-bold mb-4">Ready to simplify your payments?</h3>
               <p className="text-blue-100 mb-8">Join the platform that puts convenience and security first. Registration takes less than 2 minutes.</p>
               {!user && (
                 <Link to="/register" className="inline-block bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                   Create Free Account
                 </Link>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">Depayhub</span>
          </div>
          <p className="text-gray-500">© {new Date().getFullYear()} Depayhub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);
