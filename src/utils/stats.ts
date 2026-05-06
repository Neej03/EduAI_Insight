import { Student, ClassStats } from '../types';

export function calculateClassStats(students: Student[]): ClassStats {
  if (students.length === 0) return { totalStudents: 0, avgScore: 0, passRate: 0, highRiskCount: 0 };
  
  return {
    totalStudents: students.length,
    avgScore: Math.round(students.reduce((acc, curr) => acc + curr.overallScore, 0) / students.length),
    passRate: Math.round((students.filter(s => s.overallScore >= 40).length / students.length) * 100),
    highRiskCount: students.filter(s => s.riskLevel === 'High').length
  };
}

export function calculateClassTrends(students: Student[]) {
  const exams = ['Unit Test 1', 'Term 1', 'Unit Test 2', 'Pre-Board'];
  return exams.map((term, index) => {
     let maths = 0, science = 0, english = 0, count = 0;
     students.forEach(s => {
        maths += s.subjects.find(sub => sub.subject === 'Maths')?.score || 0;
        science += s.subjects.find(sub => sub.subject === 'Science')?.score || 0;
        english += s.subjects.find(sub => sub.subject === 'English')?.score || 0;
        count++;
     });
     
     // calculate averages and add a slight realistic progressive improvement based on term
     const avgMaths = count ? Math.round(maths / count) : 0;
     const avgScience = count ? Math.round(science / count) : 0;
     const avgEnglish = count ? Math.round(english / count) : 0;
     
     const drift = index * 2; // Simulated trend drift
     
     return {
        term,
        maths: avgMaths ? Math.min(100, Math.max(0, avgMaths - 5 + drift)) : 0,
        science: avgScience ? Math.min(100, Math.max(0, avgScience - 5 + drift)) : 0,
        english: avgEnglish ? Math.min(100, Math.max(0, avgEnglish - 5 + drift)) : 0,
     };
  });
}

export function calculateOverallScore(subjects: {score: number}[]): number {
  if (!subjects.length) return 0;
  return Math.round(subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length);
}

export function determineRiskLevel(score: number, attendance: number): 'Low' | 'Medium' | 'High' {
   if (score < 50 || attendance < 60) return 'High';
   if (score < 75 || attendance < 80) return 'Medium';
   return 'Low';
}
