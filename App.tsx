
import React, { useState } from 'react';
import { Upload, FileSpreadsheet, BarChart3, ChevronRight, X, AlertCircle } from 'lucide-react';
import { ProspectData } from './types.ts';
import DashboardContent from './components/DashboardContent.tsx';

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
        // @ts-ignore - XLSX is loaded from CDN in index.html
        if (!window.XLSX) {
          throw new Error("Biblioteca de processamento não carregada. Verifique sua conexão.");
        }
        // @ts-ignore
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
      setError("Erro físico na leitura do arquivo.");
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a]">
        <div className="max-w-3xl w-full text-center space-y-12 animate-enter">
          
          <div className="space-y-4">
             <div className="flex justify-center mb-6">
                <img src="https://github.com/servicosonline/enabley/blob/main/essa.png?raw=true" alt="Enabley Logo" className="h-20 w-auto brightness-125" />
             </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Enabley</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium">
              Analise seus dados de prospecção de forma profissional e instantânea.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-card p-12 rounded-3xl border-2 border-dashed border-purple-500/40 flex flex-col items-center gap-8 hover:border-purple-400 transition-all cursor-pointer">
              <input 
                type="file" 
                accept=".xlsx, .csv" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="p-8 bg-purple-500/20 rounded-full group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-16 h-16 text-purple-400" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">Carregue sua Planilha</p>
                <p className="text-slate-500">Arraste um arquivo .xlsx ou .csv aqui</p>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Formatos suportados: XLSX, CSV</span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-4 text-purple-400">
              <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-bold tracking-widest uppercase text-xs">Transformando dados...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="flex flex-col items-center p-6 glass-card rounded-2xl">
              <BarChart3 className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-bold mb-2">KPIs Visuais</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Conversão, volume e eficiência por canal em tempo real.</p>
            </div>
            <div className="flex flex-col items-center p-6 glass-card rounded-2xl">
              <div className="flex -space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30"><ChevronRight className="w-4 h-4 text-purple-400" /></div>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30"><ChevronRight className="w-4 h-4 text-blue-400" /></div>
              </div>
              <h3 className="text-white font-bold mb-2">Pipeline Kanban</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Gestão de contatos por estágio e identificação de atrasos.</p>
            </div>
            <div className="flex flex-col items-center p-6 glass-card rounded-2xl">
              <Upload className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-white font-bold mb-2">Privacidade Total</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Sem banco de dados. Seus dados permanecem seguros no seu navegador.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={resetData}
          className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 px-6 py-3 rounded-2xl transition-all shadow-2xl group"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="font-bold text-xs tracking-wider uppercase">Nova Planilha</span>
        </button>
      </div>
      <DashboardContent rawData={data} />
    </div>
  );
};

export default App;
