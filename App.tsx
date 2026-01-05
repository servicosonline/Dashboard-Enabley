
import React, { useState, useCallback } from 'react';
import { Upload, FileText, BarChart3, ChevronRight, X } from 'lucide-react';
import { ProspectData } from './types';
import DashboardContent from './components/DashboardContent';

const App: React.FC = () => {
  const [data, setData] = useState<ProspectData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const bstr = e.target?.result;
        // @ts-ignore - XLSX is loaded from CDN
        const workbook = window.XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // @ts-ignore
        const jsonData = window.XLSX.utils.sheet_to_json(worksheet) as ProspectData[];
        
        if (jsonData.length === 0) {
          throw new Error("A planilha parece estar vazia.");
        }

        setData(jsonData);
      } catch (err: any) {
        setError(err.message || "Erro ao processar o arquivo.");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Erro na leitura do arquivo.");
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const resetData = () => {
    setData(null);
    setError(null);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500">
        <div className="max-w-2xl w-full text-center space-y-8 animate-enter">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Prospect Dashboard Pro
            </h1>
            <p className="text-slate-400 text-lg">
              Transforme seus dados de prospecção em insights poderosos instantaneamente.
            </p>
          </div>

          <div className="glass-card p-10 rounded-3xl border-2 border-dashed border-purple-500/30 flex flex-col items-center gap-6 hover:border-purple-400/60 transition-all cursor-pointer relative group">
            <input 
              type="file" 
              accept=".xlsx, .csv" 
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="p-6 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="w-12 h-12 text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-2">Selecione sua Planilha</p>
              <p className="text-slate-500 text-sm">Arraste e solte ou clique para navegar (XLSX ou CSV)</p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 text-purple-400">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processando dados...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
            {[
              { icon: BarChart3, title: 'Análise de Funil', desc: 'KPIs e taxas de conversão' },
              { icon: FileText, title: 'Kanban Ativo', desc: 'Gestão visual de touches' },
              { icon: ChevronRight, title: 'Calculadora', desc: 'Previsão de esforço e metas' }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl text-left border border-white/5">
                <feature.icon className="w-6 h-6 text-blue-400 mb-2" />
                <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                <p className="text-slate-500 text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={resetData}
          className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 px-4 py-2 rounded-full transition-all text-xs font-bold"
        >
          <X className="w-4 h-4" /> Novo Arquivo
        </button>
      </div>
      <DashboardContent rawData={data} />
    </div>
  );
};

export default App;
