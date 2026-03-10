import { useState, useEffect } from 'react';
import api from '../api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { 
  Filter, 
  Search, 
  Plus, 
  SortAsc,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filter === 'all' || 
                         (filter === 'completed' && task.is_completed) || 
                         (filter === 'active' && !task.is_completed);
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (sortBy === 'priority') {
      const pMap = { high: 0, medium: 1, low: 2, none: 3 };
      return pMap[a.priority || 'none'] - pMap[b.priority || 'none'];
    }
    if (sortBy === 'created') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
    return 0;
  });

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleComplete = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to complete task", err);
    }
  };

  const handleSnooze = async (taskId, days = 0, hours = 0) => {
    try {
      await api.post(`/tasks/${taskId}/snooze?days=${days}&hours=${hours}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to snooze task", err);
    }
  };

  const handleDuplicate = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/duplicate`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to duplicate task", err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleAddNew = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tight mb-2 break-words text-balance">
            My Tasks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">Manage and organize all your reminders.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 transition-all font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Task
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 premium-shadow">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-400 transition dark:text-white"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-end gap-2 self-end sm:self-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
              {[
                { id: 'all', label: 'All Status', icon: SortAsc },
                { id: 'active', label: 'Active', icon: Clock },
                { id: 'completed', label: 'Completed', icon: CheckCircle2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`
                      flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider
                      ${filter === item.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-t border-slate-50 dark:border-slate-800 pt-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-2">Categories:</span>
            {['All', 'Work', 'Personal', 'Health', 'Finance', 'Shopping', 'Renewal', 'General'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`
                  px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${categoryFilter === cat 
                    ? 'bg-slate-800 dark:bg-indigo-600 text-white shadow-md' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-t border-slate-50 dark:border-slate-800 pt-4">
            <div className="flex items-center space-x-6 mr-4">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Priority:</span>
                <select 
                  value={priorityFilter} 
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 border-none focus:ring-0 cursor-pointer"
                >
                  <option value="All">All Levels</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sort By:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 border-none focus:ring-0 cursor-pointer"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="created">Recently Added</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Loading your tasks...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={() => handleComplete(task.id)}
              onSnooze={(days, hours) => handleSnooze(task.id, days, hours)}
              onDuplicate={() => handleDuplicate(task.id)}
              onEdit={() => handleTaskClick(task)}
              onDelete={() => handleDelete(task.id)}
              onUpdate={fetchTasks}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 dark:shadow-none transform rotate-3">
            <Calendar className="w-10 h-10 text-indigo-500 dark:text-indigo-400 -rotate-3" />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white font-outfit mb-2">Your Task List is Clear</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-xs text-center">Ready to organize your day? Start by adding your first reminder or task.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl px-6">
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Try Chat Prompt</p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">"Remind me to call the doctor tomorrow at 10 AM"</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Recurring Habit</p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">"Pay rent on the 1st of every month"</p>
            </div>
          </div>

          <button
            onClick={handleAddNew}
            className="mt-10 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-indigo-900/40 transition-all font-outfit font-black uppercase tracking-wider text-sm hover:-translate-y-1"
          >
            Create First Reminder
          </button>
        </div>
      )}

      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchTasks}
        task={selectedTask}
      />
    </div>
  );
}
