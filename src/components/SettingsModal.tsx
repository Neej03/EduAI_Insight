import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { teacherName, setTeacherName, classes, addClass, removeClass } = useAppContext();
  
  const [tempTeacherName, setTempTeacherName] = useState(teacherName);
  const [newClassName, setNewClassName] = useState('');

  const handleSave = () => {
    if (tempTeacherName.trim()) setTeacherName(tempTeacherName);
    onClose();
  };

  const handleAddClass = () => {
    if (newClassName.trim()) {
      addClass(newClassName.trim());
      setNewClassName('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Institute Settings</h3>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
              </button>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Teacher / Admin Name</label>
                 <input 
                   type="text" 
                   value={tempTeacherName}
                   onChange={e => setTempTeacherName(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Manage Classes / Sections</label>
                 <div className="space-y-2">
                    {classes.map(cls => (
                      <div key={cls} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">{cls}</span>
                        {classes.length > 1 && (
                          <button 
                            onClick={() => removeClass(cls)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-3 flex gap-2">
                    <input 
                      type="text" 
                      value={newClassName}
                      onChange={e => setNewClassName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddClass()}
                      placeholder="Add new class..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                    <button 
                      onClick={handleAddClass}
                      disabled={!newClassName.trim()}
                      className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
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
                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                  <Save className="w-4 h-4" />
                  Save Changes
              </button>
          </div>
       </div>
    </div>
  );
}
