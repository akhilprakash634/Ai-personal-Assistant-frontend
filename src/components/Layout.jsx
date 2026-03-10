import Sidebar from './Sidebar';
import ChatPanel from './ChatPanel';

export default function Layout({ children, onRefresh }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-300">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 transition-all md:pl-64 flex flex-col min-h-screen relative overflow-hidden">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:py-8">
          {children}
        </div>
      </main>

      {/* Persistent Chat */}
      <ChatPanel onRefresh={onRefresh} />
    </div>
  );
}
