import { useState } from 'react';
import { Search, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StudentEditor } from './StudentEditor';

interface StudentListProps {
  onSelectStudent: (id: string) => void;
}

export function StudentList({ onSelectStudent }: StudentListProps) {
  const { activeStudents, deleteStudent, activeClass } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const filteredStudents = activeStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{activeClass}</span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Student Directory</h1>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
            />
          </div>
          <button 
            onClick={() => { setEditingStudentId(null); setIsEditorOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 font-semibold tracking-wider">Student Name</th>
                <th className="px-6 py-5 font-semibold tracking-wider">ID</th>
                <th className="px-6 py-5 font-semibold tracking-wider">Attendance</th>
                <th className="px-6 py-5 font-semibold tracking-wider">Avg Score</th>
                <th className="px-6 py-5 font-semibold tracking-wider">Risk Level</th>
                <th className="px-6 py-5 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                   <td colSpan={6} className="text-center py-8 text-gray-500">No students found</td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  <td 
                    className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap group-hover:text-indigo-600 transition-colors cursor-pointer"
                    onClick={() => onSelectStudent(student.id)}
                  >
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs cursor-pointer" onClick={() => onSelectStudent(student.id)}>
                    {student.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                              className={`h-full rounded-full ${student.attendancePct < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{width: `${student.attendancePct}%`}} 
                          />
                       </div>
                       <span className={`text-xs font-bold ${student.attendancePct < 75 ? 'text-red-600' : 'text-gray-600'}`}>{student.attendancePct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {student.overallScore}%
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                      ${student.riskLevel === 'High' ? 'risk-red' : 
                        student.riskLevel === 'Medium' ? 'warning-amber' : 
                        'success-green'}`}>
                      {student.riskLevel === 'High' ? 'Critical' : student.riskLevel === 'Medium' ? 'Warning' : 'Stable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingStudentId(student.id); setIsEditorOpen(true); }}
                          className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        >
                           <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteStudent(student.id); }}
                          className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                           onClick={() => onSelectStudent(student.id)}
                           className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isEditorOpen && (
        <StudentEditor 
          studentId={editingStudentId} 
          onClose={() => setIsEditorOpen(false)} 
        />
      )}
    </div>
  );
}
