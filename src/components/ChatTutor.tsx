import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import { calculateClassStats } from '../utils/stats';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface ChatTutorProps {
  selectedStudentId: string | null;
}

export function ChatTutor({ selectedStudentId }: ChatTutorProps) {
  const { activeStudents, activeClass } = useAppContext();
  const classStats = calculateClassStats(activeStudents);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'initial', 
      role: 'model', 
      content: "Hi there! I'm your AI tutor. You can ask me to analyze performance data, explain difficult concepts, or suggest personalized study strategies." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const student = selectedStudentId ? activeStudents.find(s => s.id === selectedStudentId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (quickMessage?: string) => {
    const textToSend = typeof quickMessage === 'string' ? quickMessage : input;
    if (!textToSend.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: textToSend }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
      
      const ai = new GoogleGenAI({ apiKey });
      
      let contextStr = `Viewing Class Overview for ${activeClass}. Stats: ${JSON.stringify(classStats)}.`;
      if (student) {
        contextStr = `Viewing student profile for ${student.name} in ${activeClass} (Risk: ${student.riskLevel}, Avg: ${student.overallScore}%, Attendance: ${student.attendancePct}%). Subjects: ${JSON.stringify(student.subjects)}.`;
      }

      const systemInstruction = `You are an AI-powered student tutor and teaching assistant. 
      Your goals:
      1. Answer questions about the provided student performance data.
      2. Explain concepts related to students' weak areas.
      3. Offer actionable study strategies and personalized study plans.
      4. When asked to generate a study plan, structure it clearly with daily/weekly schedules, focused topics based on the student's weak areas, and recommended resources. Format using Markdown.
      
      Current Context: ${contextStr}`;

      const chatHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Tutor'}: ${m.content}`).join('\n\n');
      const prompt = `Chat History:\n${chatHistory}\n\nUser: ${textToSend}\nTutor:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      
      const responseText = response.text || 'Sorry, I could not generate a response.';
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Sorry, I'm having trouble connecting to the AI. Please verify your GEMINI_API_KEY." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 z-50 ${isOpen ? 'scale-0' : 'scale-100 hover:scale-105'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 rounded-t-2xl flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Tutor Assistant</h3>
              <p className="text-[10px] text-indigo-100 uppercase tracking-widest">{student ? `Context: ${student.name}` : `Context: ${activeClass}`}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white shadow-sm border border-gray-100 text-indigo-500'}`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div 
                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="markdown-body prose prose-sm prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:text-gray-800 max-w-none">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
               <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white shadow-sm border border-gray-100 text-indigo-500">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-tl-none shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl shrink-0 flex flex-col gap-2">
          {student && messages.length < 3 && (
             <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-hide">
               <button
                 onClick={() => handleSend("Please generate a personalized study plan based on my weak areas and upcoming exams. Include a daily/weekly schedule and recommended resources.")}
                 className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[11px] font-medium hover:bg-indigo-100 transition-colors"
                 disabled={isLoading}
               >
                 ✨ Generate Study Plan
               </button>
             </div>
          )}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1 pl-4"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
