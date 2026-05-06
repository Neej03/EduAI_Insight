export interface SubjectMarks {
  subject: string;
  score: number;
  maxScore: number;
}

export interface ExamRecord {
  examName: string;
  date: string;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  batch: string;
  attendancePct: number;
  overallScore: number;
  subjects: SubjectMarks[];
  history: ExamRecord[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ClassStats {
  totalStudents: number;
  avgScore: number;
  passRate: number;
  highRiskCount: number;
}
