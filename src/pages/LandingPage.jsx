import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Calendar, 
  Wallet, 
  Bell, 
  Shield, 
  Zap, 
  ChevronRight, 
  Bot,
  History,
  Settings as SettingsIcon,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Typewriter = ({ text, delay = 0, speed = 30 }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  React.useEffect(() => {
    if (!started || displayedText.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [started, displayedText, text, speed]);

  return <span>{displayedText}{started && displayedText.length < text.length && <span className="animate-pulse">|</span>}</span>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden scroll-smooth transition-all duration-700">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Assistant
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/10"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-sm hover:scale-105 transition-all shadow-xl shadow-purple-500/20"
                >
                  Get Early Access
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase mb-6">
              <Zap className="w-3 h-3" />
              Intelligence Reimagined
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
              Your AI Assistant <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                That Remembers Everything
              </span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
              Stop managing lists. Just tell your assistant what you need — reminders, follow-ups, expenses, or subscriptions — and it keeps track of everything for you.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-5">
              <button 
                 onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-2xl shadow-white/10"
              >
                Get Early Access <ChevronRight className="w-5 h-5" />
              </button>
              <a 
                href="#how-it-works"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center"
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-4 shadow-2xl shadow-purple-500/10 overflow-hidden group">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-800/30">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Assistant v1.0</div>
                <div className="w-6 h-6 rounded-full bg-slate-700/50" />
              </div>

              {/* Chat Simulation */}
              <div className="p-6 space-y-8 min-h-[400px]">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-end"
                >
                  <div className="bg-slate-800/80 rounded-2xl rounded-tr-none px-5 py-3 text-sm border border-white/5 max-w-[80%]">
                    <Typewriter text="Remind me to call Sarah tomorrow at 10 AM" delay={1000} />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl rounded-tl-none px-5 py-3 text-sm border border-white/10 max-w-[80%] backdrop-blur-md">
                    <Typewriter text="Got it. I’ll remind you tomorrow at 10 AM. I've added it to your upcoming schedule." delay={3500} />
                  </div>
                </motion.div>

                {/* Floating Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />
              </div>
            </div>

            {/* Background Decorative Blur */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
              <img 
                src="/images/hero-bg.png" 
                alt="bg" 
                className="w-full h-full object-cover opacity-30 blur-sm rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works - Conversations */}
      <section id="how-it-works" className="py-32 px-6 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 italic tracking-tight">Just Talk To Your Assistant</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Your assistant understands natural language. No complex forms, no rigid structures. Just conversational intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                user: "Follow up with the client in 3 days", 
                assistant: "Sure — I’ll remind you in 3 days.",
                icon: <Calendar className="w-6 h-6 text-blue-400" />
              },
              { 
                user: "Spent 450 on lunch", 
                assistant: "Logged ₹450 under Food.",
                icon: <Wallet className="w-6 h-6 text-emerald-400" />
              },
              { 
                user: "Netflix 199 every month", 
                assistant: "Got it — I’ll track that subscription for you.",
                icon: <History className="w-6 h-6 text-purple-400" />
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 overflow-hidden"
              >
                <div className="bg-[#0f1012] rounded-[1.4rem] p-8 h-full min-h-[300px] flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                    {item.icon}
                  </div>
                  <div className="space-y-6 flex-grow">
                    <div className="text-slate-300 text-sm italic opacity-70">User:</div>
                    <div className="text-lg font-medium leading-relaxed">
                      "<Typewriter text={item.user} delay={idx * 1500 + 500} />"
                    </div>
                    <div className="h-px bg-white/5 w-full" />
                    <div className="text-slate-300 text-sm italic opacity-70">Assistant:</div>
                    <div className="text-lg font-semibold text-white">
                      "<Typewriter text={item.assistant} delay={idx * 1500 + 2000} />"
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different - Feature Cards */}
      <section id="features" className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Natural Language", desc: "Understands everyday messages like “remind me tomorrow” or “follow up next week”.", icon: <MessageSquare className="text-purple-400" /> },
              { title: "Remembers Everything", desc: "From reminders to expenses and subscriptions, your assistant quietly keeps track.", icon: <Bot className="text-blue-400" /> },
              { title: "Conversational", desc: "No forms. No lists. Just chat naturally with your assistant.", icon: <Zap className="text-cyan-400" /> },
              { title: "Smart Alerts", desc: "Get reminders exactly when you need them — on web or Telegram.", icon: <Bell className="text-emerald-400" /> }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* A Day With Your Assistant */}
      <section id="storytelling" className="py-32 px-6 bg-gradient-to-b from-[#0a0a0c] to-[#0c0c0e]">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 italic leading-tight">A Day With Your Assistant</h2>
          </div>

          <div className="space-y-12 relative before:absolute before:left-[1.25rem] before:top-4 before:bottom-4 before:w-px before:bg-white/10 md:before:left-1/2 md:before:-translate-x-1/2">
            {[
              { time: "Morning", user: "What’s on my plate today?", assistant: ["Prepare meeting at 10 AM", "Follow up with Sarah", "Electricity bill due"] },
              { time: "Afternoon", user: "Remind me to call the doctor tomorrow.", assistant: ["Sure. I’ll remind you tomorrow."] },
              { time: "Evening", user: "Spent 350 on dinner.", assistant: ["Logged ₹350 under Food."] }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-12 md:pl-0">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 w-10 h-10 -translate-x-0.5 md:left-1/2 md:-translate-x-5 z-10 bg-[#0a0a0c] border-2 border-slate-700 rounded-full flex items-center justify-center p-2 group">
                   <div className="w-full h-full bg-slate-800 rounded-full group-hover:bg-purple-500 transition-colors" />
                </div>
                
                <div className={`md:flex ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                  <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="text-sm font-bold text-purple-400 uppercase tracking-widest block mb-1">{item.time}</span>
                    <h4 className="text-2xl font-bold text-white mb-2 leading-relaxed">"{item.user}"</h4>
                  </div>
                  <div className="md:w-1/2">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                      {item.assistant.map((line, lidx) => (
                        <div key={lidx} className="flex gap-2 items-center text-slate-300">
                          <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </motion.div>
        </section>

      {/* Capabilities Grid */}
      <section id="capabilities" className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold mb-4 italic tracking-tight">Core Capabilities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Smart reminders", "Follow-up tracking", "Expense logging", "Subscription reminders",
              "Telegram integration", "Intelligent dashboard", "Typo tolerant NLP", "Conversation UI"
            ].map((cap, idx) => (
              <div key={idx} className="flex items-center gap-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-slate-300">{cap}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      {/* Security */}
      <section id="security" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-8">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 italic tracking-tight">Your Data Stays Private</h2>
          <div className="grid sm:grid-cols-2 gap-8 text-left">
            {[
              { title: "Secure Authentication", desc: "Industry-standard Google OAuth for worry-free access." },
              { title: "Encrypted Sessions", desc: "Your interactions are protected with end-to-end encryption." },
              { title: "Data Privacy", desc: "We never sell your data. Your assistant is for your eyes only." },
              { title: "Personal Control", desc: "Total control over your reminders, expenses, and history." }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5">
                <div className="text-lg font-bold mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  {item.title}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-purple-600 to-blue-700 p-1"
        >
          <div className="bg-[#0a0a0c] h-full w-full rounded-[2.9rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
            
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] z-10 relative leading-tight italic tracking-tighter">
              Start Using Your <br /> Personal AI Assistant
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto z-10 relative">
              Let your assistant remember things for you so you can focus on what matters. Join the beta today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center z-10 relative">
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-white text-black font-extrabold text-xl rounded-full hover:scale-105 transition-all shadow-2xl shadow-white/20"
              >
                Get Early Access
              </button>
              <button 
                onClick={() => window.open(import.meta.env.VITE_BETA_URL, '_blank')}
                className="px-10 py-5 bg-white/5 border border-white/10 font-extrabold text-xl rounded-full hover:bg-white/10 transition-all"
              >
                Join Beta
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Bot className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Assistant
              </span>
            </div>
            <p className="text-slate-500 text-sm italic">"Your AI assistant for everyday life."</p>
          </div>

          <div className="flex gap-12 text-sm text-slate-400">
            <div className="space-y-4">
              <div className="text-white font-bold">Product</div>
              <a href="#features" className="hover:text-white transition-colors cursor-pointer block">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors cursor-pointer block">How it Works</a>
            </div>
            <div className="space-y-4">
              <div className="text-white font-bold">Legal</div>
              <div onClick={() => navigate('/privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy</div>
              <div onClick={() => navigate('/terms')} className="hover:text-white transition-colors cursor-pointer">Terms & Security</div>
            </div>
            <div className="space-y-4">
              <div className="text-white font-bold">Support</div>
              <a href={import.meta.env.VITE_CONTACT_URL} className="hover:text-white transition-colors cursor-pointer block">Contact</a>
              <div 
                onClick={() => window.open(import.meta.env.VITE_BETA_URL, '_blank')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Beta Program
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Assistant AI. Crafted for quality.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
