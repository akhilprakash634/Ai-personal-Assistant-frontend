import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Activity, 
  Settings, 
  LogOut, 
  Bot,
  Menu,
  X,
  IndianRupee,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Your Reminders', path: '/tasks', icon: CheckSquare },
    { name: 'Expenses', path: '/expenses', icon: IndianRupee },
    { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
    { name: 'Assistant History', path: '/activity', icon: Activity },
    { name: 'Assistant Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl md:hidden shadow-xl active:scale-95 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[55] transition-transform duration-300
        w-64 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo & Actions Header */}
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center premium-shadow shrink-0">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base md:text-lg font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight leading-none">Personal</span>
                  <span className="text-[10px] md:text-[11px] font-bold font-outfit text-indigo-600 dark:text-indigo-400 tracking-wide">Assistant</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <NotificationCenter />
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 md:px-4 space-y-1 md:space-y-2 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm
                    ${isActive(item.path) 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.email[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.email.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-all text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
