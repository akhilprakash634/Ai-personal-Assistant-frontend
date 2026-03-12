import { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, Activity, X, Trash2, Edit3, MessageSquare, ExternalLink } from 'lucide-react';
import api from '../api';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      localStorage.setItem('notificationsLastViewed', Date.now());
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  const getLogDetails = (log) => {
    const action = log.action.toLowerCase();
    if (action.includes('create')) return { icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' };
    if (action.includes('complete')) return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
    if (action.includes('snooze')) return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' };
    if (action.includes('delete')) return { icon: Trash2, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (action.includes('update')) return { icon: Edit3, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    return { icon: Bell, color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800' };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className={`relative p-2 rounded-xl transition-all ${isOpen ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`
          fixed md:absolute top-20 md:top-0 left-4 right-4 md:left-full md:right-auto md:ml-4 
          md:w-80 lg:w-96 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 
          z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 md:slide-in-from-left-4 duration-200
        `}>
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-black text-slate-800 dark:text-white font-outfit uppercase tracking-wider text-sm">Notifications</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Stay up to date</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-bold text-slate-400">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notif) => {
                  return (
                    <div 
                      key={notif.id} 
                      onClick={() => !notif.is_read && markAsRead(notif.id)}
                      className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors flex items-start space-x-3 group cursor-pointer ${!notif.is_read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center shrink-0`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-start">
                          <p className={`text-xs font-bold truncate group-hover:whitespace-normal ${!notif.is_read ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-white'}`}>
                            {notif.title}
                          </p>
                          {!notif.is_read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1 shrink-0" />}
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {format(parseISO(notif.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button 
              onClick={markAllAsRead}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Mark all read
            </button>
            <Link 
              to="/activity" 
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
            >
              See Full History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
