import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Plus, LayoutDashboard, Calendar, CalendarClock, AlertCircle, ChevronRight, Activity, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Link, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Refs for scrolling
  const sectionRefs = {
    today: useRef(null),
    overdue: useRef(null),
    upcoming: useRef(null)
  };

  const location = useLocation();

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam && sectionRefs[filterParam]?.current) {
      setTimeout(() => {
        sectionRefs[filterParam].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [location.search, loading]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/complete`);
      fetchDashboard();
    } catch (err) {
      console.error("Failed to complete task", err);
    }
  };

  const snoozeTask = async (taskId, days = 0, hours = 0) => {
    try {
      await api.post(`/tasks/${taskId}/snooze?days=${days}&hours=${hours}`);
      fetchDashboard();
    } catch (err) {
      console.error("Failed to snooze task", err);
    }
  };

  const duplicateTask = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/duplicate`);
      fetchDashboard();
    } catch (err) {
      console.error("Failed to duplicate task", err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchDashboard();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const filterTasks = (tasks) => {
    if (!tasks) return [];
    if (filter === 'All') return tasks;
    return tasks.filter(t => t.category.toLowerCase() === filter.toLowerCase());
  };

  if (loading || !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold font-outfit uppercase tracking-widest text-xs">Loading Workspace...</p>
      </div>
    );
  }

  const { counts } = summary;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Section: Header & Quick Add */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tight mb-2 break-words">
            Hey, {user.email.split('@')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">
            {counts.overdue > 0 ? (
              <span className="text-red-500 font-bold">Attention required! You have {counts.overdue} overdue tasks.</span>
            ) : counts.today > 0 ? (
              <>You've got <span className="text-indigo-600 dark:text-indigo-400 font-bold">{counts.today} tasks</span> due today.</>
            ) : (
              "Your schedule looks clear for today. Ready for something new?"
            )}
          </p>
        </div>
        
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center space-x-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold premium-shadow group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Quick Task</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mb-12">
        <StatCard 
          label="Overdue" 
          count={counts.overdue} 
          icon={AlertCircle} 
          color="red" 
          trend="Urgent attention" 
        />
        <StatCard 
          label="Due Today" 
          count={counts.today} 
          icon={Calendar} 
          color="indigo" 
          trend="Scheduled today"
        />
        <StatCard 
          label="High Priority" 
          count={counts.high_priority} 
          icon={AlertTriangle} 
          color="amber" 
          trend="Critical tasks"
        />
        <StatCard 
          label="Upcoming" 
          count={counts.upcoming} 
          icon={CalendarClock} 
          color="emerald" 
          trend="Next 7 days"
        />
        <StatCard 
          label="Completed" 
          count={counts.recently_completed} 
          icon={CheckCircle2} 
          color="blue" 
          trend="Past 24 hours"
        />
      </div>

      {/* Main Content: Tasks & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 min-h-[600px] transition-colors duration-300">
        {/* Filters Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide max-w-full">
            {['All', 'Work', 'Personal', 'Health', 'Finance', 'General'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all
                  ${filter === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <Link to="/activity" className="group flex items-center text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest pl-2">
            View Activity <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Task Sections */}
        <div className="space-y-12">
          {/* Overdue */}
          {filterTasks(summary.overdue).length > 0 && (
            <div ref={sectionRefs.overdue}>
              <TaskSection 
                title="Overdue" 
                icon={AlertCircle} 
                color="text-red-500" 
                tasks={filterTasks(summary.overdue)}
                type="overdue"
                actions={{ completeTask, snoozeTask, duplicateTask, deleteTask, handleEdit }}
              />
            </div>
          )}

          {/* Today */}
          {filterTasks(summary.today).length > 0 && (
            <div ref={sectionRefs.today}>
              <TaskSection 
                title="Today" 
                icon={Calendar} 
                color="text-indigo-500" 
                tasks={filterTasks(summary.today)}
                type="today"
                actions={{ completeTask, snoozeTask, duplicateTask, deleteTask, handleEdit }}
              />
            </div>
          )}

          {/* Upcoming */}
          {filterTasks(summary.upcoming).length > 0 && (
            <div ref={sectionRefs.upcoming}>
              <TaskSection 
                title="Upcoming" 
                icon={CalendarClock} 
                color="text-emerald-500" 
                tasks={filterTasks(summary.upcoming)}
                type="upcoming"
                actions={{ completeTask, snoozeTask, duplicateTask, deleteTask, handleEdit }}
              />
            </div>
          )}
          
          {/* Inbox / No Date */}
          {filterTasks(summary.no_date).length > 0 && (
            <TaskSection 
              title="Inbox" 
              icon={LayoutDashboard} 
              color="text-slate-400" 
              tasks={filterTasks(summary.no_date)}
              type="general"
              actions={{ completeTask, snoozeTask, duplicateTask, deleteTask, handleEdit }}
            />
          )}

          {/* Recently Completed */}
          {filterTasks(summary.recently_completed).length > 0 && (
            <TaskSection 
              title="Recently Completed" 
              icon={CheckCircle2} 
              color="text-blue-500" 
              tasks={filterTasks(summary.recently_completed).slice(0, 5)}
              type="completed"
              actions={{ completeTask, snoozeTask, duplicateTask, deleteTask, handleEdit }}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <TaskModal 
        isOpen={isModalOpen} 
        task={editingTask} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchDashboard} 
      />
    </div>
  );
}

// Internal Stat Card Component
function StatCard({ label, count, icon: Icon, color, trend }) {
  const colors = {
    red: 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/20'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-none hover:border-indigo-500/30 transition-all group">
      <div className="flex justify-between items-start mb-2 md:mb-4">
        <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${colors[color]} border transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-slate-300">Live</span>
      </div>
      <div>
        <p className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white font-outfit mb-1">{count}</p>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
        <div className="hidden md:block mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase">{trend}</p>
        </div>
      </div>
    </div>
  );
}

// Internal Task Section Component
function TaskSection({ title, icon: Icon, color, tasks, type, actions }) {
  return (
    <section>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-outfit uppercase tracking-wider">{title}</h2>
        <span className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-black px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 uppercase">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-slate-50/50 dark:bg-slate-800/20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center">
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Clear for now</p>
          </div>
        ) : tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            type={type} 
            onComplete={() => actions.completeTask(task.id)} 
            onSnooze={(days, hours) => actions.snoozeTask(task.id, days, hours)}
            onDuplicate={() => actions.duplicateTask(task.id)}
            onEdit={() => actions.handleEdit(task)}
            onDelete={() => actions.deleteTask(task.id)}
          />
        ))}
      </div>
    </section>
  );
}
