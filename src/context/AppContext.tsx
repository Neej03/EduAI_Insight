import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Student } from '../types';
import { mockStudents } from '../data/mock';

interface AppState {
  teacherName: string;
  setTeacherName: (name: string) => void;
  
  classes: string[];
  activeClass: string;
  setActiveClass: (name: string) => void;
  addClass: (name: string) => void;
  removeClass: (name: string) => void;

  students: Student[];
  activeStudents: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Student) => void;
  deleteStudent: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [teacherName, setTeacherName] = useState('Dr. Ananya Sharma');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [classes, setClasses] = useState<string[]>(['Class 10-A', 'Class 10-B']);
  const [activeClass, setActiveClass] = useState<string>('Class 10-A');

  const addClass = (name: string) => {
    if (!classes.includes(name)) {
      setClasses(prev => [...prev, name]);
      setActiveClass(name);
    }
  };

  const removeClass = (name: string) => {
    setClasses(prev => prev.filter(c => c !== name));
    if (activeClass === name) {
      setActiveClass(classes.find(c => c !== name) || '');
    }
  };

  const activeStudents = useMemo(() => {
    return students.filter(s => s.batch === activeClass);
  }, [students, activeClass]);

  const addStudent = (student: Student) => setStudents(prev => [...prev, student]);
  const updateStudent = (id: string, updated: Student) => setStudents(prev => prev.map(s => s.id === id ? updated : s));
  const deleteStudent = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));

  return (
    <AppContext.Provider value={{
      teacherName, setTeacherName,
      classes, activeClass, setActiveClass, addClass, removeClass,
      students, activeStudents, addStudent, updateStudent, deleteStudent
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
