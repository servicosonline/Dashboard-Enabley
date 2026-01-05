
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { ProspectData } from '../types';
import { safeLower } from '../utils/dataHelpers';

interface Props {
  allData: ProspectData[];
}

const SearchSection: React.FC<Props> = ({ allData }) => {
  const [query, setQuery] = useState('');

  const results = React.useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return allData.filter(item => 
      safeLower(item.Nome).includes(q) || 
      safeLower(item.Sobrenome).includes(q) || 
      safeLower(item.Empresa).includes(q) || 
      safeLower(item.Cargo).includes(q)
    ).slice(0, 12);
  }, [query, allData]);

  return (
    <div className="glass-card p-6 rounded-2xl border-blue-500/40 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Busca Rápida</h3>
      </div>
      
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Digite nome, empresa ou cargo..."
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-blue-500 outline-none text-lg pr-12"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 animate-enter">
          {results.map((item, i) => (
            <div key={i} className="p-3 bg-slate-800/60 border border-white/5 rounded-xl hover:bg-slate-700/60 transition-colors">
              <p className="text-white font-bold text-sm">{item.Nome} {item.Sobrenome}</p>
              <p className="text-slate-400 text-[10px]">{item.Cargo} @ {item.Empresa}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${safeLower(item.Resultado).includes('agend') ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {item.Resultado || (item.Resposta ? 'RESPONDIDO' : 'PROSPECTANDO')}
                </span>
                <span className="text-[8px] text-slate-500 italic">{item.Origem}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {query.length >= 2 && results.length === 0 && (
        <div className="text-center py-8 text-slate-500 italic">
          Nenhum contato encontrado para "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchSection;
