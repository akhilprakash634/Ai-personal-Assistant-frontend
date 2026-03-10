import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ label, value, options, onChange, icon: Icon, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  const selectedOption = options.find(opt => 
    typeof opt === 'string' ? opt === value : opt.value === value
  );

  const displayValue = typeof selectedOption === 'string' 
    ? selectedOption 
    : selectedOption?.label || value;

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
        <span className="truncate">{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[110] w-full mt-2 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 origin-top overflow-hidden">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const optValue = typeof option === 'string' ? option : option.value;
              const optLabel = typeof option === 'string' ? option : option.label;
              const isSelected = optValue === value;

              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => {
                    onChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2.5 flex items-center justify-between text-sm transition-colors
                    ${isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'}
                  `}
                >
                  <span>{optLabel}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
