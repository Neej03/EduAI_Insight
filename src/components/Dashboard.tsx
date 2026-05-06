import { ArrowUpRight, TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { calculateClassStats, calculateClassTrends } from '../utils/stats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
  onSelectStudent: (id: string) => void;
}

export function Dashboard({ onSelectStudent }: DashboardProps) {
  const { activeStudents, teacherName, activeClass } = useAppContext();
  const classStats = calculateClassStats(activeStudents);
  const classTrends = calculateClassTrends(activeStudents);
  const highRiskStudents = activeStudents.filter(s => s.riskLevel === 'High');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Institutional Analytics</span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{activeClass} Overview</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200">
          <div className="text-right px-2">
            <p className="text-xs font-medium text-gray-500">{teacherName}</p>
            <p className="text-[10px] text-gray-400">Principal Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-400">
             {teacherName.charAt(0)}
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <p className="text-xs font-medium text-gray-500 uppercase">Total Students</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-4xl font-light">{classStats.totalStudents}</h2>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Active enrollments</p>
        </div>

        <div className="card p-6">
          <p className="text-xs font-medium text-gray-500 uppercase">Average Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-4xl font-light">{classStats.avgScore}%</h2>
            <span className="text-xs text-green-600 font-bold font-mono">+2.4%</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">VS Last Semester Target</p>
        </div>

        <div className="card p-6">
          <p className="text-xs font-medium text-gray-500 uppercase">Pass Rate</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-4xl font-light">{classStats.passRate}%</h2>
          </div>
          <div className="w-full bg-gray-100 h-1 rounded-full mt-4">
            <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${classStats.passRate}%` }}></div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-red-500">
          <p className="text-xs font-medium text-gray-500 uppercase">Critical Risk Alerts</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-4xl font-bold text-red-600">{classStats.highRiskCount}</h2>
          </div>
          <p className="text-[10px] text-red-400 mt-2">High dropout/failure probability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Chart */}
        <div className="lg:col-span-2 card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Performance Trends</h3>
            <div className="flex gap-4 text-xs font-medium text-gray-400">
              <span>Historical</span>
              <span className="text-indigo-600">AI Projection</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={classTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dx={-10} domain={[40, 100]} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Line type="monotone" dataKey="maths" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, fill: '#4F46E5', strokeWidth: 0}} />
                <Line type="monotone" dataKey="science" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} />
                <Line type="monotone" dataKey="english" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Alert Panel */}
        <div className="card p-6 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Action Needed
          </h3>
          <div className="flex-1 overflow-hidden space-y-4">
            {highRiskStudents.length > 0 ? (
              highRiskStudents.map(student => (
                <div key={student.id} 
                    onClick={() => onSelectStudent(student.id)}
                    className="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{student.name}</p>
                        <p className="text-[10px] text-gray-400 tracking-wide uppercase font-mono">ID: {student.id}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-red-100 text-red-600 font-bold uppercase">Critical</span>
                  </div>
                  
                  <div className="mt-3 p-3 risk-red rounded-xl flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 shrink-0 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">!</div>
                    <div>
                      <p className="text-xs font-bold">AI Warning: Dropout Risk</p>
                      <p className="text-[11px] opacity-80 mt-1">Attendance dropped to {student.attendancePct}%. Score is {student.overallScore}%. Intervention required.</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No high risk students currently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
