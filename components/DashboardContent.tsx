
import React, { useState, useMemo } from 'react';
import { ProspectData } from '../types.ts';
import { safeStr, safeLower, getNextPendingTouch, getLastTouch, parseDate } from '../utils/dataHelpers.ts';
import KpiCard from './KpiCard.tsx';
import ChartsSection from './ChartsSection.tsx';
import KanbanSection from './KanbanSection.tsx';
import GoalCalculator from './GoalCalculator.tsx';
import SearchSection from './SearchSection.tsx';
import { Filter, FilterX, Users, TrendingUp, CheckCircle2, MessageCircle, AlertCircle, Calendar, Target } from 'lucide-react';

interface Props {
  rawData: ProspectData[];
}

const DashboardContent: React.FC<Props> = ({ rawData }) => {
  const [filters, setFilters] = useState({
    empresa: '',
    touchVencedor: '',
    origem: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const matchesEmpresa = !filters.empresa || item.Empresa === filters.empresa;
      const matchesTouch = !filters.touchVencedor || item['Touch Vencedor'] === filters.touchVencedor;
      const matchesOrigem = !filters.origem || item.Origem === filters.origem;
      return matchesEmpresa && matchesTouch && matchesOrigem;
    });
  }, [rawData, filters]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = filteredData.length;
    const responderam = filteredData.filter(d => safeStr(d.Resposta) !== '').length;
    const agendados = filteredData.filter(d => safeLower(d.Resultado).includes('agend')).length;
    const prospeccao = filteredData.filter(d => safeStr(d.Resultado) === '' && safeStr(d.Resposta) === '');
    const conversasAtivas = filteredData.filter(d => safeStr(d.Resposta) !== '' && safeStr(d.Resultado) === '');
    const finalizados = filteredData.filter(d => safeStr(d.Resultado) !== '').length;
    
    const atrasadosCount = prospeccao.filter(item => {
      const pending = getNextPendingTouch(item);
      return pending && pending.date && pending.date < today;
    }).length;

    return {
      total,
      responderam,
      agendados,
      prospeccao: prospeccao.length,
      conversasAtivas: conversasAtivas.length,
      finalizados,
      atrasados: atrasadosCount,
      pctResp: total > 0 ? (responderam / total) * 100 : 0,
      pctAgendResp: responderam > 0 ? (agendados / responderam) * 100 : 0,
      pctAgendTotal: total > 0 ? (agendados / total) * 100 : 0
    };
  }, [filteredData]);

  const uniqueValues = useMemo(() => ({
    empresas: Array.from(new Set(rawData.map(d => d.Empresa).filter(Boolean))),
    touches: Array.from(new Set(rawData.map(d => d['Touch Vencedor']).filter(Boolean))),
    origens: Array.from(new Set(rawData.map(d => d.Origem).filter(Boolean)))
  }), [rawData]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Dashboard de Prospecção
          </h1>
          <p className="text-slate-400">Acompanhamento estratégico de campanhas em tempo real</p>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/paulocezarbrito/" target="_blank" rel="noopener" className="hover:scale-105 transition-transform">
             <img src="https://github.com/servicosonline/enabley/blob/main/essa.png?raw=true" alt="Logo" className="h-16 w-auto object-contain brightness-110 drop-shadow-xl" />
          </a>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl border-white/5">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-white font-semibold hover:text-purple-400 transition-colors"
        >
          <Filter className="w-5 h-5" />
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 animate-enter">
            <select 
              value={filters.empresa}
              onChange={e => setFilters({...filters, empresa: e.target.value})}
              className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-purple-500 outline-none"
            >
              <option value="">Todas as Empresas</option>
              {uniqueValues.empresas.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select 
              value={filters.touchVencedor}
              onChange={e => setFilters({...filters, touchVencedor: e.target.value})}
              className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-purple-500 outline-none"
            >
              <option value="">Todos os Touches</option>
              {uniqueValues.touches.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select 
              value={filters.origem}
              onChange={e => setFilters({...filters, origem: e.target.value})}
              className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-purple-500 outline-none"
            >
              <option value="">Todas as Origens</option>
              {uniqueValues.origens.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <button 
              onClick={() => setFilters({empresa:'', touchVencedor:'', origem:''})}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <FilterX className="w-4 h-4" /> Limpar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard title="Total de Contatos" value={stats.total} icon={Users} color="blue" />
        <KpiCard title="Em Prospecção" value={stats.prospeccao} icon={Calendar} color="yellow" />
        <KpiCard title="Responderam" value={stats.responderam} icon={MessageCircle} color="purple" />
        <KpiCard title="Conversas Ativas" value={stats.conversasAtivas} icon={TrendingUp} color="cyan" />
        <KpiCard title="Finalizados" value={stats.finalizados} icon={CheckCircle2} color="green" />
        <KpiCard title="Agendados" value={stats.agendados} icon={Target} color="teal" />
        <KpiCard title="Ações Atrasadas" value={stats.atrasados} icon={AlertCircle} color="red" />
        <KpiCard title="% Resp / Total" value={`${stats.pctResp.toFixed(1)}%`} icon={MessageCircle} color="indigo" />
        <KpiCard title="% Agend / Resp" value={`${stats.pctAgendResp.toFixed(1)}%`} icon={Target} color="pink" />
        <KpiCard title="% Agend / Total" value={`${stats.pctAgendTotal.toFixed(1)}%`} icon={Target} color="sky" />
      </div>

      <ChartsSection data={filteredData} />
      <GoalCalculator data={filteredData} />
      <KanbanSection data={filteredData} />
      <SearchSection allData={rawData} />
    </div>
  );
};

export default DashboardContent;
