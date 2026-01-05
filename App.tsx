
import React, { useState, useEffect, useCallback } from 'react';
import { FileSpreadsheet, AlertCircle, RefreshCw, BarChart3, ChevronRight } from 'lucide-react';
import { ProspectData } from './types.ts';
import DashboardContent from './components/DashboardContent.tsx';

const App: React.FC = () => {
  const [data, setData] = useState<ProspectData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Usando exatamente o nome solicitado pelo usuário: "Ataque Enabley.CSV"
      // Tentaremos buscar o arquivo. Em servidores como GitHub Pages, a diferenciação entre maiúsculas/minúsculas é rigorosa.
      const fileName = 'Ataque Enabley.CSV';
      const fileUrl = `./${fileName.replace(/ /g, '%20')}`;
      
      let response = await fetch(fileUrl, { cache: 'no-store' });
      
      // Caso falhe com .CSV (maiúsculo), tentamos com .csv (minúsculo) como fallback
      if (!response.ok && response.status === 404) {
        const fallbackName = 'Ataque Enabley.csv';
        const fallbackUrl = `./${fallbackName.replace(/ /g, '%20')}`;
        response = await fetch(fallbackUrl, { cache: 'no-store' });
      }

      if (!response.ok) {
        throw new Error(`Arquivo "${fileName}" não encontrado. Certifique-se de que o arquivo está na raiz do seu repositório GitHub com o nome exato.`);
      }

      const arrayBuffer = await response.arrayBuffer();
      
      // @ts-ignore - XLSX is loaded from CDN in index.html
      if (!window.XLSX) {
        throw new Error("A biblioteca de processamento (XLSX) não foi carregada. Tente recarregar a página.");
      }

      // @ts-ignore
      const workbook = window.XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // @ts-ignore
      const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as ProspectData[];
      
      if (jsonData.length === 0) {
        throw new Error("O arquivo foi encontrado, mas parece não conter dados válidos.");
      }

      setData(jsonData);
    } catch (err: any) {
      console.error('Erro de busca:', err);
      setError(err.message || "Erro desconhecido ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a]">
        <div className="flex flex-col items-center gap-8 animate-enter">
          <img src="https://github.com/servicosonline/enabley/blob/main/essa.png?raw=true" alt="Enabley Logo" className="h-24 w-auto brightness-125 mb-4" />
          <div className="relative">
             <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
             <BarChart3 className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sincronizando Dashboard</h2>
            <p className="text-slate-500 text-sm animate-pulse">Buscando "Ataque Enabley.CSV" no repositório...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a]">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl border-red-500/30 text-center space-y-6">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Arquivo não encontrado</h2>
            <p className="text-slate-400 text-sm">{error}</p>
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg text-left">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Dica técnica:</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Verifique se o arquivo está na raiz do seu repositório GitHub com o nome:<br/>
                <code className="text-blue-400">Ataque Enabley.CSV</code> ou <code className="text-blue-400">Ataque Enabley.csv</code>
              </p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all border border-white/5"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button 
          onClick={fetchData}
          className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl hover:bg-purple-500/20 text-slate-300 hover:text-purple-400 border border-white/10 px-6 py-3 rounded-2xl transition-all shadow-2xl group"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`} />
          <span className="font-bold text-xs tracking-wider uppercase">
            {loading ? 'Atualizando...' : 'Sincronizar Dados'}
          </span>
        </button>
      </div>
      {data && <DashboardContent rawData={data} />}
      
      <footer className="py-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
        © 2024 Enabley Prospecção Inteligente
      </footer>
    </div>
  );
};

export default App;
