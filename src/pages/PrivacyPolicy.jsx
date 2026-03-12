import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans p-6 md:p-12 selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Assistant
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <header className="space-y-4">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">Privacy Policy</h1>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </header>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            <p className="text-slate-400 leading-relaxed">
              To provide your personal assistant services, we collect information you provide directly through chat, including reminders, expenses, and notes. We also collect basic account information via Google OAuth.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Data</h2>
            <p className="text-slate-400 leading-relaxed">
              Your data is used solely to provide and improve the assistant's performance. We do not sell your personal data. Your messages are parsed to identify intents like "create reminder" or "log expense" to help you manage your life more efficiently.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">3. Data Security</h2>
            <p className="text-slate-400 leading-relaxed">
              We implement industry-standard security measures to protect your data. This includes encrypted sessions and secure database storage. Access to your assistant is protected by your personal Google account.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">4. Control Over Your Data</h2>
            <p className="text-slate-400 leading-relaxed">
              You have full control over your assistant's history. You can view, edit, or delete your reminders and logs at any time through the dashboard or by asking your assistant directly.
            </p>
          </section>

          <footer className="pt-20 border-t border-white/5 text-slate-500 text-sm italic py-12">
            "Your privacy is the foundation of our assistant service."
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
