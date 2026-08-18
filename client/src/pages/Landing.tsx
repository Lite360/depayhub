import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Phone, Tv, Lightbulb, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Landing = () => {
  const { user } = useAuth();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-primary/30 overflow-x-hidden">
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-full bg-black/40 backdrop-blur-xl z-50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(8,43,114,0.4)]">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                DEPAYHUB
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                    Sign in
                  </Link>
                  <Link to="/register" className="bg-white/10 border border-white/10 text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-all backdrop-blur-md">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Deep Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#0A0A0A] rounded-full mix-blend-multiply filter blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-gray-300 tracking-wide">The future of bill payments</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6">
              Your Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">Command Center.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="mt-6 text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Boost social media, get virtual numbers, buy data & airtime, and more — all from one dashboard.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link to="/dashboard" className="bg-primary text-white font-bold px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(8,43,114,0.4)] hover:bg-secondary transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg">
                  Enter Dashboard <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link to="/register" className="bg-accent text-white font-bold px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(255,122,0,0.3)] hover:bg-orange-600 transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg">
                  Start for free <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Everything you need.</motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-xl text-gray-400">Experience seamless payments across all major networks.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <FeatureCard 
              icon={<Phone className="w-6 h-6 text-primary" />}
              title="Airtime & Data"
              desc="Instant top-ups for MTN, Airtel, Glo, and 9mobile with amazing discounts."
            />
            <FeatureCard 
              icon={<Tv className="w-6 h-6 text-accent" />}
              title="Cable TV"
              desc="Never miss a moment. Instant subscription for DSTV, GOTV, and Startimes."
            />
            <FeatureCard 
              icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}
              title="Electricity"
              desc="Recharge your prepaid meters instantly. Supports all major DisCos."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-purple-500" />}
              title="Fast Processing"
              desc="Transactions are processed and delivered in milliseconds."
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full mix-blend-screen filter blur-[150px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="lg:w-1/2"
            >
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Why thousands choose Depayhub</motion.h2>
              <div className="space-y-8">
                {[
                  'Bank-grade security encryption for all transactions',
                  'Automated wallet funding system',
                  'Earn commissions through our referral program',
                  '24/7 dedicated customer support'
                ].map((item, i) => (
                  <motion.div variants={fadeUp} key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-xl text-gray-300 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="lg:w-1/2 w-full perspective-1000"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 lg:p-14 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 opacity-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                 <h3 className="text-3xl font-extrabold mb-4 text-white">Ready to simplify your payments?</h3>
                 <p className="text-gray-400 mb-10 text-lg">Join the platform that puts convenience and security first. Registration takes less than 2 minutes.</p>
                 {!user && (
                   <Link to="/register" className="inline-block bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                     Create Free Account
                   </Link>
                 )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-black border border-white/10 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xl font-bold text-gray-300 tracking-tight">DEPAYHUB</span>
          </div>
          <p className="text-gray-600 font-medium">© {new Date().getFullYear()} Depayhub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
    >
      <div className="w-14 h-14 bg-black/50 border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
};
