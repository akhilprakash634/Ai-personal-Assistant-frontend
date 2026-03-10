import { format, parseISO } from 'date-fns';
import { Clock, Bell, Check, Edit3, Trash2, AlertTriangle, Copy, Timer } from 'lucide-react';

export default function TaskCard({ task, type, onComplete, onSnooze, onDuplicate, onEdit, onDelete }) {
  let borderClass = 'border-l-indigo-400';
  let badgeClass = 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300';
  let iconColor = 'text-indigo-600 dark:text-indigo-400';
  
  if (type === 'overdue') {
    borderClass = 'border-l-red-500';
    badgeClass = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    iconColor = 'text-red-600 dark:text-red-400';
  } else if (type === 'upcoming') {
    borderClass = 'border-l-emerald-500';
    badgeClass = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
    iconColor = 'text-emerald-600 dark:text-emerald-400';
  }

  const categoryColors = {
    'Work': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
    'Personal': 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30',
    'Health': 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
    'Finance': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
    'Shopping': 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    'Renewal': 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
    'General': 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'
  };

  const catClass = categoryColors[task.category] || categoryColors['General'];

  const dueDateStr = task.due_date ? format(parseISO(task.due_date), 'MMM d, yyyy') : 'No date';
  
  return (
    <div className={`
      relative group bg-white dark:bg-slate-900 rounded-xl border ${borderClass} border-l-4 p-4 md:p-5 
      hover:shadow-xl dark:hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300
      flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 dark:border-slate-800
    `}>
      <div className="space-y-2 flex-1">
        <div className="flex items-center space-x-2">
          <h3 className={`font-bold text-slate-800 dark:text-white text-lg tracking-tight ${type === 'overdue' ? 'text-red-900 dark:text-red-400' : ''}`}>
            {task.title}
          </h3>
          {task.priority === 'high' && (
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] uppercase font-black px-1.5 py-0.5 rounded flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Urgent
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <span className={`px-2.5 py-1 rounded-lg ${badgeClass}`}>
            {dueDateStr}
          </span>
          {task.recurrence !== 'none' && (
            <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg flex items-center">
              <Clock className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1 md:mr-1.5 text-indigo-400 dark:text-indigo-500" />
              <span className="hidden xs:inline">{task.recurrence}</span>
              <span className="xs:hidden">Repeat</span>
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-lg border ${catClass} transition-colors uppercase tracking-wider`}>
            {task.category}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 self-end sm:self-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
        <button 
          onClick={() => onSnooze(0, 1)}
          className="p-3 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors"
          title="Snooze 1 hour"
        >
          <Timer className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onSnooze(1, 0)}
          className="p-3 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors"
          title="Snooze to Tomorrow"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button 
          onClick={onDuplicate}
          className="p-3 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors"
          title="Duplicate Task"
        >
          <Copy className="w-5 h-5" />
        </button>
        <button 
          onClick={onEdit}
          className="p-3 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-colors"
          title="Edit / Reschedule"
        >
          <Edit3 className="w-5 h-5" />
        </button>
        <button 
          onClick={onDelete}
          className="p-3 text-red-400 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300 rounded-xl transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button 
          onClick={onComplete}
          className="p-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
          title="Mark Done"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
