import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">Terms of Service</h1>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </header>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-400 leading-relaxed">
              By using the Personal AI Assistant, you agree to these terms. This is a beta service designed to help you manage personal information through a conversational interface.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">2. User Responsibilities</h2>
            <p className="text-slate-400 leading-relaxed">
              You are responsible for the content you chat with the assistant. Our service is designed for personal organization and should not be used for illegal activities.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">3. Service Availability</h2>
            <p className="text-slate-400 leading-relaxed">
              As this is a beta project, service availability may vary during development. We strive to provide a stable experience but do not guarantee 100% uptime.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">4. Modifications</h2>
            <p className="text-slate-400 leading-relaxed">
              We may update these terms as the assistant evolves. Continued use of the service constitutes acceptance of any new terms.
            </p>
          </section>

          <footer className="pt-20 border-t border-white/5 text-slate-500 text-sm italic py-12">
            "Empowering your everyday life with intelligence."
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
