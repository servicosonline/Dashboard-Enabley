
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';
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
      // Nome do arquivo solicitado
      const targetFileName = 'Ataque Enabley.CSV';
      
      // No GitHub Pages, o fetch precisa ser relativo à raiz do site.
      // './' funciona se o arquivo estiver na mesma pasta que o index.html
      const pathsToTry = [
        `./${encodeURIComponent(targetFileName)}`,
        `./${targetFileName.replace(/ /g, '%20')}`,
        `./Ataque%20Enabley.csv` // Fallback minúsculo
      ];

      let response = null;
      let lastTried = '';

      for (const path of pathsToTry) {
        try {
          lastTried = path;
          const res = await fetch(path, { cache: 'no-cache' });
          if (res.ok) {
            response = res;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Não foi possível carregar o arquivo "${targetFileName}". Verifique se ele foi enviado para a raiz do repositório.`);
      }

      const arrayBuffer = await response.arrayBuffer();
      
      // @ts-ignore
      if (!window.XLSX) {
        throw new Error("Biblioteca XLSX não carregada. Verifique sua conexão.");
      }

      // @ts-ignore
      const workbook = window.XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // @ts-ignore
      const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as ProspectData[];
      
      if (!jsonData || jsonData.length === 0) {
        throw new Error("O arquivo está vazio ou o formato é inválido.");
      }

      setData(jsonData);
    } catch (err: any) {
      console.error('Erro no processamento:', err);
      setError(err.message || "Erro desconhecido.");
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
          <img src="https://github.com/servicosonline/enabley/blob/main/essa.png?raw=true" alt="Enabley" className="h-20 w-auto brightness-110" />
          <div className="relative">
             <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
             <BarChart3 className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Carregando Dados</h2>
            <p className="text-slate-500 text-xs mt-2 animate-pulse">Sincronizando com "Ataque Enabley.CSV"...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a]">
        <div className="max-w-md w-full glass-card p-10 rounded-3xl border-red-500/30 text-center space-y-6">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Falha na Sincronização</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
          </div>
          <div className="pt-4">
            <button 
              onClick={fetchData}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all border border-white/5"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
            <p className="text-[10px] text-slate-600 mt-6 uppercase tracking-widest">
              Verifique se o arquivo está na raiz do GitHub
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={fetchData}
          className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl hover:bg-purple-500/20 text-slate-300 hover:text-purple-400 border border-white/10 px-5 py-2.5 rounded-2xl transition-all shadow-2xl group"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-bold text-[10px] tracking-widest uppercase">
            {loading ? 'Sincronizando...' : 'Sincronizar'}
          </span>
        </button>
      </div>
      {data && <DashboardContent rawData={data} />}
    </div>
  );
};

export default App;
