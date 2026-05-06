/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { StudentProfile } from './components/StudentProfile';
import { ChatTutor } from './components/ChatTutor';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'profile'>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleNavigate = (view: 'dashboard' | 'students' | 'profile') => {
    setActiveView(view);
    if (view !== 'profile') {
      setSelectedStudentId(null);
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setActiveView('profile');
  };

  return (
    <Layout activeView={activeView} onNavigate={handleNavigate}>
      {activeView === 'dashboard' && <Dashboard onSelectStudent={handleSelectStudent} />}
      {activeView === 'students' && <StudentList onSelectStudent={handleSelectStudent} />}
      {activeView === 'profile' && selectedStudentId && (
        <StudentProfile 
          studentId={selectedStudentId} 
          onBack={() => handleNavigate('students')} 
        />
      )}
      <ChatTutor selectedStudentId={selectedStudentId} />
    </Layout>
  );
}
