import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import { calculateOverallScore, determineRiskLevel } from '../utils/stats';
import { Student } from '../types';

interface StudentEditorProps {
  studentId: string | null; // if null, it's add mode
  onClose: () => void;
}

export function StudentEditor({ studentId, onClose }: StudentEditorProps) {
  const { students, addStudent, updateStudent, activeClass } = useAppContext();
  
  const [name, setName] = useState('');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [batch, setBatch] = useState(activeClass);
  const [attendance, setAttendance] = useState<number>(100);
  
  const [subjects, setSubjects] = useState<{subject: string, score: number}[]>([
    { subject: 'Maths', score: 0 },
    { subject: 'Science', score: 0 },
    { subject: 'English', score: 0 },
    { subject: 'History', score: 0 }
  ]);

  useEffect(() => {
    if (studentId) {
      const s = students.find((st) => st.id === studentId);
      if (s) {
        setName(s.name);
        setStudentIdInput(s.id);
        setBatch(s.batch);
        setAttendance(s.attendancePct);
        setSubjects(s.subjects.map(sub => ({ subject: sub.subject, score: sub.score })));
      }
    } else {
        setStudentIdInput(`STU-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [studentId, students]);

  const handleSubjectChange = (index: number, score: number) => {
    setSubjects(prev => {
        const next = [...prev];
        next[index].score = Math.min(100, Math.max(0, score || 0));
        return next;
    });
  };

  const handleSave = () => {
    if (!name.trim() || !studentIdInput.trim()) return;

    const overallScore = calculateOverallScore(subjects);
    const riskLevel = determineRiskLevel(overallScore, attendance);

    const newStudent: Student = {
        id: studentIdInput,
        name,
        batch,
        attendancePct: attendance,
        overallScore,
        riskLevel,
        subjects: subjects.map(s => ({ ...s, maxScore: 100 })),
        history: studentId ? students.find(s => s.id === studentId)?.history || [] : [] // retain history if any
    };

    if (studentId) {
        // update
        updateStudent(studentId, newStudent);
    } else {
        addStudent(newStudent);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{studentId ? 'Edit Student' : 'Add New Student'}</h3>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
              </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={e => setName(e.target.value)}
                   placeholder="e.g. Rahul Kumar"
                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                 />
              </div>
              <div className="flex gap-4">
                  <div className="flex-1">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Student ID</label>
                     <input 
                       type="text" 
                       value={studentIdInput}
                       onChange={e => setStudentIdInput(e.target.value)}
                       disabled={!!studentId}
                       className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-shadow"
                     />
                  </div>
                  <div className="flex-1">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Batch</label>
                     <input 
                       type="text" 
                       value={batch}
                       onChange={e => setBatch(e.target.value)}
                       className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                     />
                  </div>
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Attendance Percentage</label>
                 <div className="flex items-center gap-3">
                     <input 
                        type="range"
                        min="0"
                        max="100"
                        value={attendance}
                        onChange={e => setAttendance(parseInt(e.target.value))}
                        className="flex-1 accent-indigo-600"
                     />
                     <span className="text-sm font-bold w-12 text-right">{attendance}%</span>
                 </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100">
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Subject Scores (Out of 100)</label>
                 <div className="grid grid-cols-2 gap-4">
                     {subjects.map((sub, idx) => (
                         <div key={idx} className="flex flex-col">
                             <span className="text-sm font-medium text-gray-700 mb-1">{sub.subject}</span>
                             <input 
                                type="number" 
                                min="0" 
                                max="100"
                                value={sub.score === 0 ? '' : sub.score} // remove 0 so it's easier to type
                                onChange={e => handleSubjectChange(idx, parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                             />
                         </div>
                     ))}
                 </div>
              </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                 onClick={onClose}
                 className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-colors"
              >
                  Cancel
              </button>
              <button 
                 onClick={handleSave}
                 disabled={!name.trim() || !studentIdInput.trim()}
                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                  <Save className="w-4 h-4" />
                  Save Student
              </button>
          </div>
       </div>
    </div>
  );
}
