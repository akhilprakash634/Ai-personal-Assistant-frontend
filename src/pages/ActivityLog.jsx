import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { format, parseISO } from 'date-fns';
import { Activity, PlusCircle, CheckCircle, Clock, Trash2, Edit3, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActivityLog() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/dashboard/activity');
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activity log", err);
    } finally {
      setLoading(false);
    }
  };

  const getLogDetails = (log) => {
    const action = log.action.toLowerCase();
    if (action.includes('create')) return { icon: PlusCircle, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/30' };
    if (action.includes('complete')) return { icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/30' };
    if (action.includes('snooze')) return { icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/30' };
    if (action.includes('delete')) return { icon: Trash2, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-900/30' };
    if (action.includes('update')) return { icon: Edit3, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/30' };
    if (action.includes('sent') || action.includes('notification')) return { icon: MessageSquare, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-900/30' };
    return { icon: Activity, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-100 dark:border-slate-800' };
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tight mb-2">
            Assistant History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">This is everything your assistant has helped you manage.</p>
        </div>
        
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Timeline Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 min-h-[500px] transition-colors duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-100 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-outfit mb-2">No activities yet</h3>
            <p className="text-slate-400 dark:text-slate-500 font-medium">Manage your reminders to see your history here.</p>
          </div>
        ) : (
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-50 dark:bg-slate-800 hidden sm:block"></div>
            
            <div className="space-y-8">
              {activities.map((log) => {
                const { icon: Icon, color, bg, border } = getLogDetails(log);
                return (
                  <div key={log.id} className="relative flex flex-col sm:flex-row items-start sm:items-center group">
                    {/* Circle Icon */}
                    <div className={`
                      z-10 w-12 h-12 rounded-2xl flex items-center justify-center 
                      ${bg} ${color} border ${border} mb-4 sm:mb-0 sm:mr-6 shrink-0
                      group-hover:scale-110 transition-transform duration-300 shadow-sm
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {/* Log Card */}
                    <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/20 group-hover:bg-white dark:group-hover:bg-slate-800 rounded-3xl p-5 border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-700 group-hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{log.action}</p>
                          <h4 className="text-base font-bold text-slate-800 dark:text-white">{log.description}</h4>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm self-start sm:self-auto">
                          {format(parseISO(log.timestamp), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
