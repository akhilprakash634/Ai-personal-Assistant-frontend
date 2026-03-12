import { useState, useEffect } from 'react';
import api from '../api';
import { TrendingUp, PieChart, IndianRupee, Plus, ShoppingBag, Coffee, Car, Home, Phone, MoreHorizontal } from 'lucide-react';

export default function Expenses() {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sumRes, expRes] = await Promise.all([
        api.get('/expenses/summary'),
        api.get('/expenses/')
      ]);
      setSummary(sumRes.data);
      setExpenses(expRes.data.reverse());
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('food') || c.includes('coffee')) return Coffee;
    if (c.includes('shop')) return ShoppingBag;
    if (c.includes('travel') || c.includes('car')) return Car;
    if (c.includes('bill') || c.includes('home') || c.includes('rent')) return Home;
    if (c.includes('phone') || c.includes('recharge')) return Phone;
    return MoreHorizontal;
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading expenses...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tight mb-2">Expense Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Assistant is watching your spends.</p>
        </div>
        <div className="bg-indigo-600 text-white px-6 py-4 rounded-3xl premium-shadow flex items-center space-x-3">
          <TrendingUp className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none">Monthly Total</span>
            <span className="text-2xl font-black font-outfit leading-tight">₹{summary?.monthly_total || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-indigo-500" />
              By Category
            </h3>
          </div>
          <div className="space-y-4">
            {Object.entries(summary?.categories || {}).map(([cat, total]) => (
              <div key={cat} className="flex items-center group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {(() => { const Icon = getCategoryIcon(cat); return <Icon className="w-5 h-5" />; })()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{cat}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">₹{total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(100, (total / (summary.monthly_total || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div className="md:col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider text-sm flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
            Recently Tracked
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
            {expenses.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No expenses logged yet</p>
                <p className="text-slate-500 text-sm mt-2">Try saying "I spent 500 on dinner" in the chat.</p>
              </div>
            ) : expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 rounded-2xl transition-all group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center mr-4 text-indigo-500 group-hover:scale-110 transition-transform shadow-sm">
                    {(() => { const Icon = getCategoryIcon(exp.category); return <Icon className="w-5 h-5" />; })()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{exp.note || exp.category}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">₹{exp.amount}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100/50 dark:border-indigo-900/20">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center max-w-md">
          Pro Tip: Log expenses directly through the **AI Assistant** in the corner. I'll automatically categorize and sum them for you!
        </p>
      </div>
    </div>
  );
}
