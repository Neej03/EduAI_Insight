import { Student, ClassStats } from '../types';

export const mockStudents: Student[] = [
  {
    id: 'STU-001',
    name: 'Aarav Sharma',
    batch: 'Class 10-A',
    attendancePct: 92,
    overallScore: 85,
    riskLevel: 'Low',
    subjects: [
      { subject: 'Maths', score: 88, maxScore: 100 },
      { subject: 'Science', score: 92, maxScore: 100 },
      { subject: 'English', score: 78, maxScore: 100 },
      { subject: 'History', score: 82, maxScore: 100 },
    ],
    history: [
      { examName: 'Unit Test 1', date: '2023-07-15', score: 80 },
      { examName: 'Term 1', date: '2023-09-20', score: 82 },
      { examName: 'Unit Test 2', date: '2023-11-10', score: 85 },
      { examName: 'Pre-Board', date: '2024-01-25', score: 88 },
    ],
  },
  {
    id: 'STU-002',
    name: 'Diya Patel',
    batch: 'Class 10-A',
    attendancePct: 74,
    overallScore: 62,
    riskLevel: 'Medium',
    subjects: [
      { subject: 'Maths', score: 55, maxScore: 100 },
      { subject: 'Science', score: 68, maxScore: 100 },
      { subject: 'English', score: 72, maxScore: 100 },
      { subject: 'History', score: 53, maxScore: 100 },
    ],
    history: [
      { examName: 'Unit Test 1', date: '2023-07-15', score: 70 },
      { examName: 'Term 1', date: '2023-09-20', score: 65 },
      { examName: 'Unit Test 2', date: '2023-11-10', score: 60 },
      { examName: 'Pre-Board', date: '2024-01-25', score: 62 },
    ],
  },
  {
    id: 'STU-003',
    name: 'Kabir Singh',
    batch: 'Class 10-A',
    attendancePct: 60,
    overallScore: 45,
    riskLevel: 'High',
    subjects: [
      { subject: 'Maths', score: 35, maxScore: 100 },
      { subject: 'Science', score: 48, maxScore: 100 },
      { subject: 'English', score: 55, maxScore: 100 },
      { subject: 'History', score: 42, maxScore: 100 },
    ],
    history: [
      { examName: 'Unit Test 1', date: '2023-07-15', score: 55 },
      { examName: 'Term 1', date: '2023-09-20', score: 50 },
      { examName: 'Unit Test 2', date: '2023-11-10', score: 48 },
      { examName: 'Pre-Board', date: '2024-01-25', score: 45 },
    ],
  },
  {
    id: 'STU-004',
    name: 'Ananya Gupta',
    batch: 'Class 10-A',
    attendancePct: 98,
    overallScore: 94,
    riskLevel: 'Low',
    subjects: [
      { subject: 'Maths', score: 98, maxScore: 100 },
      { subject: 'Science', score: 95, maxScore: 100 },
      { subject: 'English', score: 90, maxScore: 100 },
      { subject: 'History', score: 93, maxScore: 100 },
    ],
    history: [
      { examName: 'Unit Test 1', date: '2023-07-15', score: 90 },
      { examName: 'Term 1', date: '2023-09-20', score: 92 },
      { examName: 'Unit Test 2', date: '2023-11-10', score: 93 },
      { examName: 'Pre-Board', date: '2024-01-25', score: 95 },
    ],
  },
  {
    id: 'STU-005',
    name: 'Rohan Mehta',
    batch: 'Class 10-A',
    attendancePct: 81,
    overallScore: 58,
    riskLevel: 'Medium',
    subjects: [
      { subject: 'Maths', score: 45, maxScore: 100 },
      { subject: 'Science', score: 52, maxScore: 100 },
      { subject: 'English', score: 75, maxScore: 100 },
      { subject: 'History', score: 60, maxScore: 100 },
    ],
    history: [
      { examName: 'Unit Test 1', date: '2023-07-15', score: 62 },
      { examName: 'Term 1', date: '2023-09-20', score: 60 },
      { examName: 'Unit Test 2', date: '2023-11-10', score: 55 },
      { examName: 'Pre-Board', date: '2024-01-25', score: 58 },
    ],
  },
  {
    id: 'STU-006',
    name: 'Shruti Iyer',
    batch: 'Class 10-B',
    attendancePct: 88,
    overallScore: 76,
    riskLevel: 'Low',
    subjects: [
      { subject: 'Maths', score: 70, maxScore: 100 },
      { subject: 'Science', score: 85, maxScore: 100 },
      { subject: 'English', score: 80, maxScore: 100 },
      { subject: 'History', score: 69, maxScore: 100 },
    ],
    history: [
      { examName: 'Unit Test 1', date: '2023-07-15', score: 70 },
      { examName: 'Term 1', date: '2023-09-20', score: 73 },
      { examName: 'Unit Test 2', date: '2023-11-10', score: 75 },
      { examName: 'Pre-Board', date: '2024-01-25', score: 80 },
    ],
  },
  {
    id: 'STU-007',
    name: 'Nikhil Verma',
    batch: 'Class 10-B',
    attendancePct: 55,
    overallScore: 38,
    riskLevel: 'High',
    subjects: [
      { subject: 'Maths', score: 30, maxScore: 100 },
      { subject: 'Science', score: 40, maxScore: 100 },
      { subject: 'English', score: 45, maxScore: 100 },
      { subject: 'History', score: 37, maxScore: 100 },
    ],
    history: [
      { examName: 'Unit Test 1', date: '2023-07-15', score: 45 },
      { examName: 'Term 1', date: '2023-09-20', score: 40 },
      { examName: 'Unit Test 2', date: '2023-11-10', score: 35 },
      { examName: 'Pre-Board', date: '2024-01-25', score: 38 },
    ],
  }
];

export const classStats: ClassStats = {
  totalStudents: mockStudents.length,
  avgScore: Math.round(mockStudents.reduce((acc, curr) => acc + curr.overallScore, 0) / mockStudents.length),
  passRate: Math.round((mockStudents.filter(s => s.overallScore >= 40).length / mockStudents.length) * 100),
  highRiskCount: mockStudents.filter(s => s.riskLevel === 'High').length
};

export const classTrends = [
  { term: 'Unit Test 1', maths: 68, science: 70, english: 71 },
  { term: 'Term 1', maths: 66, science: 68, english: 70 },
  { term: 'Unit Test 2', maths: 64, science: 65, english: 69 },
  { term: 'Pre-Board', maths: 67, science: 69, english: 72 },
];
