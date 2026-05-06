import { useEffect } from 'react';
import { ArrowLeft, User, Activity, TrendingUp } from 'lucide-react';
import { Student } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';

interface StudentProfileProps {
  studentId: string;
  onBack: () => void;
}

export function StudentProfile({ studentId, onBack }: StudentProfileProps) {
  const { students } = useAppContext();

  const student = students.find(s => s.id === studentId);

  if (!student) return <div>Student not found.</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      {/* Header Profile */}
      <div className="card p-6 flex items-start gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-gray-50 opacity-50">
           <User size={200} />
        </div>
        <div className="w-20 h-20 bg-indigo-50 border border-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 z-10">
          <User className="w-10 h-10" />
        </div>
        <div className="flex-1 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">{student.name}</h2>
              <p className="text-gray-500 mt-1 font-mono text-sm uppercase">{student.id} &bull; {student.batch}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border
              ${student.riskLevel === 'High' ? 'risk-red border-red-200' : 
                student.riskLevel === 'Medium' ? 'warning-amber border-amber-200' : 
                'success-green border-emerald-200'}`}>
              Risk: {student.riskLevel}
            </div>
          </div>

          <div className="mt-8 flex gap-12">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Score</p>
              <p className="text-3xl font-light text-gray-900">{student.overallScore}%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Attendance</p>
              <p className={`text-3xl font-light ${student.attendancePct < 75 ? 'text-red-600' : 'text-gray-900'}`}>{student.attendancePct}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Performance Timeline */}
        <div className="card p-6">
           <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Performance Timeline
           </h3>
           <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={student.history}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="examName" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13}} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13}} dx={-10} />
                  <RechartsTooltip filterNull={false} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{r: 6, fill: '#4338ca', strokeWidth: 0}} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Subject Heatmap simplified */}
        <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Subject Breakdown
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {student.subjects.map(sub => (
                 <div key={sub.subject} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{sub.subject}</p>
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-white border-4 shadow-sm" style={{borderColor: sub.score >= 80 ? '#10b981' : sub.score >= 50 ? '#f59e0b' : '#ef4444'}}>
                       <span className="font-bold text-gray-900 text-lg">{sub.score}</span>
                    </div>
                 </div>
               ))}
           </div>
        </div>
      </div>
    </div>
  );
}
