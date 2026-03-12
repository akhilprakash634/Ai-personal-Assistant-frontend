import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, AlignLeft, AlertTriangle } from 'lucide-react';
import api from '../api';

import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';

export default function TaskModal({ task, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium',
    due_date: '',
    recurrence: 'none',
    recurrence_interval: 1
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'General',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.substring(0, 16) : '',
        recurrence: task.recurrence || 'none',
        recurrence_interval: task.recurrence_interval || 1
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'General',
        priority: 'medium',
        due_date: '',
        recurrence: 'none',
        recurrence_interval: 1
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (data.due_date === '') data.due_date = null;
      
      if (task) {
        await api.put(`/tasks/${task.id}`, data);
      } else {
        await api.post('/tasks/', data);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  if (!isOpen) return null;

  const categories = ['General', 'Work', 'Personal', 'Health', 'Finance', 'Shopping', 'Renewal'];
  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  const recurrenceOptions = [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl premium-shadow transform transition-all border border-transparent dark:border-slate-800 relative">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold font-outfit text-slate-800 dark:text-white">
            {task ? 'Edit Reminder' : 'New Reminder'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
            <X className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">What should I remember?</label>
            <input 
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition font-medium dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Add some details..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition font-medium text-sm dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <CustomSelect 
              label="Category"
              icon={Tag}
              value={formData.category}
              options={categories}
              onChange={val => setFormData({...formData, category: val})}
            />

            {/* Priority */}
            <CustomSelect 
              label="Priority"
              icon={AlertTriangle}
              value={formData.priority}
              options={priorities}
              onChange={val => setFormData({...formData, priority: val})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <CustomDatePicker 
              label="Due Date"
              icon={Calendar}
              value={formData.due_date}
              onChange={val => setFormData({...formData, due_date: val})}
            />

            {/* Recurrence */}
            <CustomSelect 
              label="Recurrence"
              icon={Clock}
              value={formData.recurrence}
              options={recurrenceOptions}
              onChange={val => setFormData({...formData, recurrence: val})}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-slate-50 dark:border-slate-800">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition font-bold"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3.5 bg-indigo-600 dark:bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40"
            >
              {task ? 'Update Reminder' : 'Tell Assistant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
