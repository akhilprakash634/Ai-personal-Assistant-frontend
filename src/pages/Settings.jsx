import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  Bell, 
  Slack, 
  MessageSquare, 
  Phone, 
  Smartphone, 
  Save, 
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
  Tag,
  MessageCircle,
  Settings as SettingsIcon
} from 'lucide-react';

import CustomSelect from '../components/CustomSelect';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    notification_platform: 'web',
    slack_webhook: '',
    teams_webhook: '',
    whatsapp_number: '',
    telegram_chat_id: '',
    timezone: 'UTC',
    email_notifications_enabled: true,
    default_task_category: 'General'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        notification_platform: user.notification_platform || 'web',
        slack_webhook: user.slack_webhook || '',
        teams_webhook: user.teams_webhook || '',
        whatsapp_number: user.whatsapp_number || '',
        telegram_chat_id: user.telegram_chat_id || '',
        timezone: user.timezone || 'UTC',
        email_notifications_enabled: user.email_notifications_enabled ?? true,
        default_task_category: user.default_task_category || 'General'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      await api.put('/settings/', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { id: 'web', name: 'Web Only', icon: Smartphone, color: 'bg-blue-500' },
    { id: 'slack', name: 'Slack', icon: Slack, color: 'bg-[#4A154B]' },
    { id: 'teams', name: 'MS Teams', icon: MessageSquare, color: 'bg-[#6264A7]' },
    { id: 'whatsapp', name: 'WhatsApp', icon: Phone, color: 'bg-[#25D366]' },
    { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: 'bg-[#0088cc]' },
    { id: 'sms', name: 'SMS', icon: Smartphone, color: 'bg-slate-700' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Assistant Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Choose how your assistant should reach you.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden premium-shadow transition-colors duration-300">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Platform Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              How should your assistant reach you?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {platforms.map((p) => {
                const Icon = p.icon;
                const isSelected = formData.notification_platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, notification_platform: p.id })}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all
                      ${isSelected 
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/30 shadow-md' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                    `}
                  >
                    <div className={`w-10 h-10 rounded-xl ${isSelected ? p.color : 'bg-slate-100 dark:bg-slate-800'} flex items-center justify-center mb-2 transition-colors`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500'}`}>
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Platform Specific Config */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Assistant Connections</h2>
            
            <div className={`space-y-2 transition-all duration-300 ${formData.notification_platform === 'slack' ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <Slack className="w-4 h-4 mr-2" />
                Slack Webhook URL
              </label>
              <input
                type="url"
                value={formData.slack_webhook}
                onChange={(e) => setFormData({ ...formData, slack_webhook: e.target.value })}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-400 transition dark:text-white"
                disabled={formData.notification_platform !== 'slack'}
              />
            </div>

            <div className={`space-y-2 transition-all duration-300 ${formData.notification_platform === 'teams' ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                MS Teams Webhook URL
              </label>
              <input
                type="url"
                value={formData.teams_webhook}
                onChange={(e) => setFormData({ ...formData, teams_webhook: e.target.value })}
                placeholder="https://outlook.office.com/webhook/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-400 transition dark:text-white"
                disabled={formData.notification_platform !== 'teams'}
              />
            </div>

            <div className={`space-y-2 transition-all duration-300 ${(formData.notification_platform === 'whatsapp' || formData.notification_platform === 'sms') ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="+1234567890"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-400 transition dark:text-white"
                disabled={formData.notification_platform !== 'whatsapp' && formData.notification_platform !== 'sms'}
              />
            </div>

            <div className={`space-y-2 transition-all duration-300 ${formData.notification_platform === 'telegram' ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Telegram Chat ID
              </label>
              <input
                type="text"
                value={formData.telegram_chat_id}
                onChange={(e) => setFormData({ ...formData, telegram_chat_id: e.target.value })}
                placeholder="e.g. 123456789"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-400 transition dark:text-white"
                disabled={formData.notification_platform !== 'telegram'}
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* General Preferences */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Assistant Behavior
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CustomSelect 
                label="Preferred Timezone"
                icon={Globe}
                value={formData.timezone}
                onChange={(val) => setFormData({ ...formData, timezone: val })}
                options={[
                  { value: "UTC", label: "UTC (Default)" },
                  { value: "America/New_York", label: "Eastern Time (US)" },
                  { value: "America/Los_Angeles", label: "Pacific Time (US)" },
                  { value: "Europe/London", label: "London (GMT/BST)" },
                  { value: "Asia/Kolkata", label: "India (IST)" },
                  { value: "Asia/Tokyo", label: "Tokyo (JST)" }
                ]}
              />

              <CustomSelect 
                label="Default Reminder Category"
                icon={Tag}
                value={formData.default_task_category}
                onChange={(val) => setFormData({ ...formData, default_task_category: val })}
                options={['General', 'Work', 'Personal', 'Health', 'Finance', 'Shopping', 'Renewal']}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Email Reminders</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Receive daily summaries and overdue alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, email_notifications_enabled: !formData.email_notifications_enabled })}
                className={`w-12 h-6 rounded-full transition-all relative ${formData.email_notifications_enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${formData.email_notifications_enabled ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center">
              {success && (
                <span className="flex items-center text-emerald-600 text-sm font-bold animate-in fade-in zoom-in duration-300">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Settings saved successfully!
                </span>
              )}
              {error && (
                <span className="flex items-center text-rose-600 text-sm font-bold animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 disabled:opacity-50 transition-all font-bold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Save Preferences
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
