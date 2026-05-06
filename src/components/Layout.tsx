import { GraduationCap, LayoutDashboard, Users, UserCircle, LogOut, Settings, ChevronDown } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { SettingsModal } from './SettingsModal';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: ReactNode;
  activeView: 'dashboard' | 'students' | 'profile';
  onNavigate: (view: 'dashboard' | 'students') => void;
}

export function Layout({ children, activeView, onNavigate }: LayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { classes, activeClass, setActiveClass } = useAppContext();

  return (
    <div className="min-h-screen flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
              EA
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">EduAI Insight</span>
          </div>

          <div className="relative w-full">
            <select
              value={activeClass}
              onChange={(e) => setActiveClass(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 sidebar-item ${
              activeView === 'dashboard' ? 'active-sidebar' : ''
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview Dashboard
          </button>
          
          <button
            onClick={() => onNavigate('students')}
            className={`w-full flex items-center gap-3 sidebar-item ${
              (activeView === 'students' || activeView === 'profile') ? 'active-sidebar' : ''
            }`}
          >
            <Users className="w-5 h-5" />
            Student Directory
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 sidebar-item"
          >
            <Settings className="w-5 h-5" />
            Institute Settings
          </button>
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="bg-indigo-50 p-4 rounded-xl text-center font-medium text-xs text-indigo-700">
            Pro Plan Enabled <br /> (Institute-Wide)
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 flex flex-col gap-6">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}
