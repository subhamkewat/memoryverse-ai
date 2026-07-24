import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Cpu, Shield, Download, Trash2, Check, RefreshCw, Key } from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onExportData: () => void;
  apiKey: string;
  onUpdateApiKey: (key: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  onToggleTheme,
  onExportData,
  apiKey,
  onUpdateApiKey
}) => {
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'gpt4' | 'local'>('gemini');
  const [customApiKey, setCustomApiKey] = useState(apiKey);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    setCustomApiKey(apiKey);
  }, [apiKey]);

  const handleSaveSettings = () => {
    onUpdateApiKey(customApiKey);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
            SYSTEM PREFERENCES
          </span>
        </div>
        <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
          System Settings & AI Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure AI LLM engines, dark mode theme, OCR confidence thresholds, and data export parameters.
        </p>
      </div>

      {/* SETTINGS CARD 1: THEME & DISPLAY */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center space-x-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Appearance & Theme Mode</span>
        </h3>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-sm font-bold text-slate-200">Dark Glassmorphism UI</div>
            <p className="text-xs text-slate-400">High contrast dark theme tailored for futuristic AI platforms.</p>
          </div>

          <button
            onClick={onToggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>{darkMode ? 'Dark Mode Active' : 'Light Mode Active'}</span>
          </button>
        </div>
      </div>

      {/* SETTINGS CARD 2: AI ENGINE SELECTOR */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>AI LLM & RAG Engine Selection</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'gemini', name: 'Google Gemini 1.5 Pro', speed: 'Sub-50ms', desc: 'Recommended for deep reasoning and multi-document synthesis.' },
            { id: 'gpt4', name: 'OpenAI GPT-4o', speed: 'Sub-80ms', desc: 'High accuracy entity extraction and resume optimization.' },
            { id: 'local', name: 'Local Ollama / Llama3', speed: 'Offline', desc: 'Private offline RAG execution on local hardware.' }
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedModel(m.id as any)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedModel === m.id
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">{m.name}</span>
                <span className="text-[10px] font-mono text-emerald-400">{m.speed}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Custom API Key Input */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optional Custom Gemini / OpenAI API Key</span>
          </label>
          <input
            type="password"
            placeholder="AIzaSy... (Leave empty to use built-in free sandbox AI server)"
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* SETTINGS CARD 3: DATA PRIVACY & EXPORT */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Data Ownership & Export Controls</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-sm font-bold text-slate-200">Export Complete Digital Identity JSON</div>
            <p className="text-xs text-slate-400">Download all extracted named entities, knowledge graph links, and career metrics.</p>
          </div>

          <button
            onClick={onExportData}
            className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Dataset</span>
          </button>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center space-x-2 cursor-pointer"
        >
          {saveToast ? (
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4" />
              <span>Settings Saved</span>
            </div>
          ) : (
            <span>Save System Settings</span>
          )}
        </button>
      </div>

    </div>
  );
};
