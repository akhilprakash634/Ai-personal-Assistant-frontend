import { useState, useEffect } from 'react';
import api from '../api';
import { CalendarClock, Plus, CreditCard, ExternalLink, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/subscriptions/');
      setSubscriptions(res.data);
    } catch (err) {
      console.error("Failed to fetch subscriptions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this subscription from tracking?")) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      fetchData();
    } catch (err) {
      console.error("Failed to delete sub", err);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading subscriptions...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tight mb-2">Subscriptions & Renewals</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Assistant will remind you before they renew.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.length === 0 ? (
          <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center transition-colors duration-300">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-3xl mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No subscriptions tracked</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">Add your Netflix, Spotify, or domain renewals to never miss a payment.</p>
          </div>
        ) : subscriptions.map(sub => (
          <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col shadow-sm hover:shadow-md transition-all group overflow-hidden relative transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            
            <div className="flex justify-between items-start mb-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center premium-shadow">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <button 
                onClick={() => handleDelete(sub.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 relative">
              <h3 className="text-xl font-black text-slate-800 dark:text-white font-outfit mb-1">{sub.name}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">{sub.recurrence}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Renewal</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{new Date(sub.renewal_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">₹{sub.cost || '??'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center text-emerald-600 dark:text-emerald-400">
              <CalendarClock className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Assistant Protected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
