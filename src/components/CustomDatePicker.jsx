import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  X, 
  Check 
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  parse,
  setHours,
  setMinutes,
  getHours,
  getMinutes
} from 'date-fns';

export default function CustomDatePicker({ label, value, onChange, icon: Icon, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Parse current value or default to now
  const selectedDate = value ? new Date(value) : new Date();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (day) => {
    const newDate = setMinutes(setHours(day, getHours(selectedDate)), getMinutes(selectedDate));
    onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
  };

  const handleTimeChange = (type, val) => {
    let newDate = new Date(selectedDate);
    if (type === 'hours') newDate = setHours(newDate, parseInt(val));
    if (type === 'minutes') newDate = setMinutes(newDate, parseInt(val));
    onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
      <button 
        type="button"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
      >
        <ChevronLeft className="w-5 h-5 text-slate-400" />
      </button>
      <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest font-outfit">
        {format(currentMonth, 'MMMM yyyy')}
      </span>
      <button 
        type="button"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
      >
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2 px-2">
        {days.map(day => (
          <div key={day} className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase text-center py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-1 px-2 pb-4">
        {calendarDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`
                h-9 w-full rounded-xl flex items-center justify-center text-xs font-bold transition-all relative
                ${!isCurrentMonth ? 'text-slate-300 dark:text-slate-700 hover:text-slate-400' : ''}
                ${isSelected 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 z-10' 
                  : isCurrentMonth ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''}
                ${isCurrentDay && !isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}
              `}
            >
              {format(day, 'd')}
              {isCurrentDay && !isSelected && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderTimePicker = () => (
    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Time
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={getHours(selectedDate)}
              onChange={(e) => handleTimeChange('hours', e.target.value)}
              className="bg-white dark:bg-slate-800 border-none rounded-lg text-sm font-bold p-2 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-white appearance-none text-center flex-1"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <span className="font-bold text-slate-400">:</span>
            <select
              value={getMinutes(selectedDate)}
              onChange={(e) => handleTimeChange('minutes', e.target.value)}
              className="bg-white dark:bg-slate-800 border-none rounded-lg text-sm font-bold p-2 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-white appearance-none text-center flex-1"
            >
              {Array.from({ length: 60 }).map((_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="mt-6 p-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center">
          {Icon && <Icon className="w-3 h-3 mr-1" />} {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200
          bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800
          hover:border-slate-200 dark:hover:border-slate-700
          ${isOpen ? 'ring-4 ring-indigo-100 dark:ring-indigo-900/20 border-indigo-400 dark:border-indigo-500 bg-white dark:bg-slate-800' : ''}
          text-sm font-medium text-slate-700 dark:text-slate-200
        `}
      >
        <span className="truncate">{value ? format(new Date(value), 'PPP p') : 'Pick a date...'}</span>
        <CalendarIcon className={`w-4 h-4 text-slate-400 transition-colors ${value ? 'text-indigo-500' : ''}`} />
      </button>

      {/* Dropdown Menu - Centered Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[2px] animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Calendar Card */}
          <div className="relative w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 overflow-hidden">
            {renderHeader()}
            <div className="p-2">
              {renderDays()}
              {renderCells()}
            </div>
            {renderTimePicker()}
            
            {/* Close Button for mobile/convenience */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
