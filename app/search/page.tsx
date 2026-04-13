"use client";

import { useState } from "react";
import Link from "next/link";
import { BrainCircuit, ChevronRight, Settings, Briefcase, BookOpen } from "lucide-react";

function formatTimestamp(ts: string | null): string | null {
  if (!ts) return null;
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return ts;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

type SearchResult = {
  input: unknown;
  recommendation: string;
  signature?: string | null;
  integrity_valid?: boolean;
  health_status?: string | null;
  actionable_advice?: string | null;
  timestamp: string | null;
};

type SearchResponse = { results: SearchResult[] } | SearchResult;

export default function SearchPage() {
  const [studentNo, setStudentNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = studentNo.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setSelectedIndex(null);

    try {
      const res = await fetch(`/api/search?student_no=${encodeURIComponent(trimmed)}`, {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (res.status === 404) {
        setError("Not found");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        setError(text || `Request failed (${res.status})`);
        return;
      }

      const data = (await res.json()) as SearchResponse;
      const normalized = "results" in (data as any) ? (data as any).results : [data as SearchResult];
      setResults(normalized);
      setSelectedIndex(normalized.length > 0 ? 0 : null);
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  };

  const selected = selectedIndex !== null && results ? results[selectedIndex] : null;
  const isHighRisk = selected?.health_status?.includes("High Risk") ?? false;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight uppercase">AdvisorAI Search</h1>
              <p className="text-slate-500 font-bold text-sm">Audit log lookup • Read-only</p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-800 hover:bg-slate-50"
          >
            Back
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* INPUTS COLUMN */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <form onSubmit={handleSearch} className="space-y-8">
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Student Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2024-000123"
                        value={studentNo}
                        onChange={(e) => setStudentNo(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {results && (
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                          Results
                        </h3>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          {results.length} found
                        </span>
                      </div>

                      <div className="space-y-2">
                        {results.map((r, idx) => {
                          const isSelected = idx === selectedIndex;
                          const label = formatTimestamp(r.timestamp) ?? `Result ${idx + 1}`;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedIndex(idx)}
                              className={
                                "w-full text-left rounded-2xl px-4 py-3 border font-black " +
                                (isSelected
                                  ? "bg-white border-blue-200 text-slate-900"
                                  : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white")
                              }
                            >
                              <span>{label}</span>
                              {typeof r.integrity_valid === "boolean" && (
                                <span
                                  className={
                                    "ml-2 text-[10px] uppercase tracking-wider " +
                                    (r.integrity_valid ? "text-emerald-700" : "text-amber-700")
                                  }
                                >
                                  {r.integrity_valid ? "Valid" : "Tampered"}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-6 rounded-3xl border border-red-200 bg-red-50 text-red-700">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-2">Search Error</h3>
                      <p className="text-sm font-bold leading-relaxed">{error}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group disabled:bg-slate-300"
                >
                  {loading ? (
                    "SEARCHING AUDIT LOG..."
                  ) : (
                    <>
                      RUN SEARCH
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* OUTPUT COLUMN */}
          <div className="lg:col-span-5">
            {!selected ? (
              <div className="h-full border-4 border-dotted border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-4 bg-white/50">
                <div className="bg-slate-100 p-5 rounded-full text-slate-400">
                  <Settings size={40} className="animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">System Ready</h3>
                  <p className="text-xs text-slate-400 font-bold max-w-[220px] mx-auto">
                    Enter a student number to view matching audit records.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div
                  className={
                    "p-8 rounded-[2.5rem] border-b-[8px] shadow-2xl " +
                    (isHighRisk
                      ? "bg-red-600 text-white border-red-800 shadow-red-100"
                      : "bg-emerald-600 text-white border-emerald-800 shadow-emerald-100")
                  }
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                      Predictive Diagnostic
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                      {formatTimestamp(selected.timestamp) ?? "—"}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black leading-tight italic uppercase tracking-tighter">
                    {selected.health_status ? selected.health_status.split(":")[1] || selected.health_status : "—"}
                  </h2>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Briefcase size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Recommended Track</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{selected.recommendation}</p>
                  {typeof selected.integrity_valid === "boolean" && (
                    <p
                      className={
                        "mt-3 text-xs font-black uppercase tracking-wider " +
                        (selected.integrity_valid ? "text-emerald-700" : "text-amber-700")
                      }
                    >
                      {selected.integrity_valid ? "Valid" : "Tampered"}
                    </p>
                  )}
                </div>

                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-100 relative overflow-hidden">
                  <BookOpen className="absolute -right-4 -bottom-4 text-blue-500/30" size={120} />
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">
                      Prescriptive Expert Advice
                    </h4>
                    <p className="text-lg font-bold leading-relaxed">
                      {selected.actionable_advice ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <ChevronRight size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Decrypted Input</span>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap break-words text-sm bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-x-auto">
                    {JSON.stringify(selected.input, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
