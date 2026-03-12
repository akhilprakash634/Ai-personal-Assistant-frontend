import { Link } from 'react-router-dom';
import { Bell, Shield, Zap, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center premium-shadow">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black font-outfit text-slate-800 tracking-tight">Antigravity</span>
        </div>
        <div className="flex items-center space-x-8">
          <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Sign In</Link>
          <Link to="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 mr-2" /> Powered by AI
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 font-outfit leading-[1.1] tracking-tighter">
            Never miss a <span className="text-indigo-600">reminder</span> again.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The smart, minimalist assistant that manages your life naturally. Talk to it like a friend, and stay ahead of your schedule.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all premium-shadow">
              Start for Free
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
              Watch Demo <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="lg:w-1/2 relative animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full"></div>
          <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl premium-shadow overflow-hidden group">
            <div className="bg-slate-800 rounded-2xl p-6 py-12 text-center border border-slate-700">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 animate-float">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Workspace Preview</h3>
              <p className="text-slate-400 font-medium text-sm">Sign up to see your personalized dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={MessageSquare} 
              title="Natural Language" 
              desc="Just tell the assistant what you need. 'Remind me next Tuesday to pay rent' - it just works."
            />
            <FeatureCard 
              icon={Shield} 
              title="Secure Isolation" 
              desc="Your data is yours alone. We use military-grade encryption and multi-user isolation."
            />
            <FeatureCard 
              icon={Zap} 
              title="Instant Alerts" 
              desc="Timely notifications and smart snooze features help you manage reminders gracefully."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 font-outfit">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
