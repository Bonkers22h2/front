"use client";
import { useState } from "react";
import {
  User,
  BookOpen,
  Briefcase,
  Settings,
  ChevronRight,
  BrainCircuit,
  ShieldAlert,
  LineChart
} from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("academic");

  // --- FULL 36-FEATURE RISK STATE (SVM) ---
  const [riskData, setRiskData] = useState({
    "Marital status": 1,
    "Application mode": 1,
    "Application order": 1,
    "Course": 12,
    "Daytime/evening attendance": 1,
    "Previous qualification": 1,
    "Nacionality": 1,
    "Mother's qualification": 1,
    "Father's qualification": 1,
    "Mother's occupation": 1,
    "Father's occupation": 1,
    "Displaced": 1,
    "Educational special needs": 0,
    "Debtor": 0,
    "Tuition fees up to date": 1,
    "Gender": 1,
    "Scholarship holder": 0,
    "Age at enrollment": 20,
    "International": 0,
    "Curricular units 1st sem (credited)": 0,
    "Curricular units 1st sem (enrolled)": 6,
    "Curricular units 1st sem (evaluations)": 6,
    "Curricular units 1st sem (approved)": 5,
    "Curricular units 1st sem (grade)": 12,
    "Curricular units 1st sem (without evaluations)": 0,
    "Curricular units 2nd sem (credited)": 0,
    "Curricular units 2nd sem (enrolled)": 6,
    "Curricular units 2nd sem (evaluations)": 6,
    "Curricular units 2nd sem (approved)": 5,
    "Curricular units 2nd sem (grade)": 12,
    "Curricular units 2nd sem (without evaluations)": 0,
    "Unemployment rate": 10.8,
    "Inflation rate": 1.4,
    "GDP": 1.74
  });

  // --- CAREER STATE (Decision Tree) ---
  const [careerData, setCareerData] = useState({
    "Gender": "Male",
    "Age": 20,
    "GPA": 3.0,
    "Major": "Computer Science",
    "Interested Domain": "Software Development",
    "Projects": "Academic Project",
    "Python": "Average",
    "SQL": "Average",
    "Java": "Average"
  });

  const updateRisk = (key: string, val: any) => setRiskData({ ...riskData, [key]: val });
  const updateCareer = (key: string, val: any) => setCareerData({ ...careerData, [key]: val });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ risk_features: riskData, career_features: careerData }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Backend Connection Failed. Run uvicorn api:app." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight uppercase">AdvisorAI Dashboard</h1>
              <p className="text-slate-500 font-bold text-sm">Hybrid Expert System • T.I.P. CS 404</p>
            </div>
          </div>

          <nav className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <button onClick={() => setActiveTab("academic")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "academic" ? "bg-slate-900 text-white" : "text-slate-400"}`}>ACADEMIC RISK</button>
            <button onClick={() => setActiveTab("career")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "career" ? "bg-slate-900 text-white" : "text-slate-400"}`}>CAREER PATHWAY</button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* INPUTS COLUMN */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <form onSubmit={handlePredict} className="space-y-8">

                {activeTab === "academic" ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    {/* Academic Performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tuition Status</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" value={riskData["Tuition fees up to date"]} onChange={(e) => {
                          const val = Number(e.target.value);
                          updateRisk("Tuition fees up to date", val);
                          updateRisk("Debtor", val === 0 ? 1 : 0);
                        }}>
                          <option value={1}>Paid & Up to Date</option>
                          <option value={0}>Unpaid / Overdue</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Scholarship</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" value={riskData["Scholarship holder"]} onChange={(e) => updateRisk("Scholarship holder", Number(e.target.value))}>
                          <option value={0}>Not a Holder</option>
                          <option value={1}>Active Scholar</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2"><LineChart size={16} /> FIRST SEMESTER METRICS</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Units Approved</label>
                          <input type="number" className="w-full border rounded-lg p-2" value={riskData["Curricular units 1st sem (approved)"]} onChange={(e) => updateRisk("Curricular units 1st sem (approved)", Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Average Grade</label>
                          <input type="number" step="0.1" className="w-full border rounded-lg p-2" value={riskData["Curricular units 1st sem (grade)"]} onChange={(e) => updateRisk("Curricular units 1st sem (grade)", Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Age at Enrollment</label>
                          <input type="number" className="w-full border rounded-lg p-2" value={riskData["Age at enrollment"]} onChange={(e) => updateRisk("Age at enrollment", Number(e.target.value))} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2"><Settings size={16} /> SOCIO-ECONOMIC FACTORS</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <select className="border rounded-lg p-2 text-xs" value={riskData["Displaced"]} onChange={(e) => updateRisk("Displaced", Number(e.target.value))}>
                          <option value={1}>Displaced Student</option><option value={0}>Non-Displaced</option>
                        </select>
                        <select className="border rounded-lg p-2 text-xs" value={riskData["Educational special needs"]} onChange={(e) => updateRisk("Educational special needs", Number(e.target.value))}>
                          <option value={1}>Special Needs: Yes</option><option value={0}>Special Needs: No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Domain</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={careerData["Interested Domain"]} onChange={(e) => updateCareer("Interested Domain", e.target.value)}>
                          <option>Software Development</option>
                          <option>Artificial Intelligence</option>
                          <option>Cybersecurity</option>
                          <option>Data Science</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Technical GPA</label>
                        <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={careerData["GPA"]} onChange={(e) => updateCareer("GPA", Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
                      <h3 className="text-sm font-black text-blue-800 flex items-center gap-2 uppercase tracking-tighter">Current Skill Proficiency</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {["Python", "SQL", "Java"].map((skill) => (
                          <div key={skill} className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">{skill}</label>
                            <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm" value={(careerData as any)[skill]} onChange={(e) => updateCareer(skill, e.target.value)}>
                              <option>Strong</option><option>Average</option><option>Weak</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group disabled:bg-slate-300">
                  {loading ? "CONSULTING HYBRID ENGINE..." : (
                    <>RUN DIAGNOSTIC <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* OUTPUT COLUMN */}
          <div className="lg:col-span-5">
            {!result ? (
              <div className="h-full border-4 border-dotted border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-4 bg-white/50">
                <div className="bg-slate-100 p-5 rounded-full text-slate-400"><Settings size={40} className="animate-spin-slow" /></div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">System Ready</h3>
                  <p className="text-xs text-slate-400 font-bold max-w-[200px] mx-auto">Please complete the student profile to generate the analysis.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                {/* Risk Card */}
                <div className={`p-8 rounded-[2.5rem] border-b-[8px] shadow-2xl ${result.health_status.includes('High Risk') ? 'bg-red-600 text-white border-red-800 shadow-red-100' : 'bg-emerald-600 text-white border-emerald-800 shadow-emerald-100'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Predictive Diagnostic</span>
                    <ShieldAlert size={24} />
                  </div>
                  <h2 className="text-3xl font-black leading-tight italic uppercase tracking-tighter">
                    {result.health_status.split(':')[1] || result.health_status}
                  </h2>
                </div>

                {/* Track Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Briefcase size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Recommended Track</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{result.recommended_track}</p>
                </div>

                {/* Expert Advice Card */}
                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-100 relative overflow-hidden">
                  <BookOpen className="absolute -right-4 -bottom-4 text-blue-500/30" size={120} />
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">Prescriptive Expert Advice</h4>
                    <p className="text-lg font-bold leading-relaxed">{result.actionable_advice}</p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button onClick={() => setResult(null)} className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Clear Diagnostics</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
