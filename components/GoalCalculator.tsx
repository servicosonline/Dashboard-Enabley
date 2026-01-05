
import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, Users, Activity } from 'lucide-react';
import { ProspectData } from '../types';
import { safeStr, safeLower } from '../utils/dataHelpers';

interface Props {
  data: ProspectData[];
}

const GoalCalculator: React.FC<Props> = ({ data }) => {
  const [goal, setGoal] = useState<number>(20);
  const [touches, setTouches] = useState<number>(7);
  const [days, setDays] = useState<number>(20);

  const results = useMemo(() => {
    const total = data.length;
    const agendados = data.filter(d => safeLower(d.Resultado).includes('agend')).length;
    const responderam = data.filter(d => safeStr(d.Resposta) !== '').length;
    
    const remaining = Math.max(0, goal - agendados);
    const rateResp = responderam > 0 ? (agendados / responderam) : 0.2; // default 20%
    const rateTotal = total > 0 ? (agendados / total) : 0.05; // default 5%

    const needResp = rateResp > 0 ? Math.ceil(remaining / rateResp) : remaining * 5;
    const needContact = rateTotal > 0 ? Math.ceil(remaining / rateTotal) : remaining * 20;
    
    // Simulação diária
    const dailyNew = Math.ceil(needContact / days);
    const totalTouches = needContact * (touches / 2); // Estimativa de esforço médio

    return { remaining, needResp, needContact, dailyNew, totalTouches };
  }, [data, goal, touches, days]);

  return (
    <div className="glass-card p-6 rounded-2xl border-green-500/20 space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">Calculadora de Metas</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Meta de Agendamentos</label>
          <input 
            type="number" 
            value={goal}
            onChange={e => setGoal(Number(e.target.value))}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-green-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Touches por Ciclo</label>
          <input 
            type="number" 
            value={touches}
            onChange={e => setTouches(Number(e.target.value))}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Dias Úteis</label>
          <input 
            type="number" 
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none"
          />
        </div>
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
          <p className="text-[10px] text-green-400 uppercase font-bold">Faltam</p>
          <p className="text-2xl font-black text-white">{results.remaining}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-full">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Novas Respostas Necessárias</p>
            <p className="text-xl font-bold text-white">+{results.needResp}</p>
          </div>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Novos Contatos na Base</p>
            <p className="text-xl font-bold text-white">+{results.needContact}</p>
          </div>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-full">
            <Activity className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Esforço Diário (Novos)</p>
            <p className="text-xl font-bold text-white">+{results.dailyNew}/dia</p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/20 p-4 rounded-xl border border-white/5">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          *Baseado na sua taxa histórica de conversão. Se você adicionar <strong>{results.dailyNew}</strong> novos contatos por dia útil, espera-se bater a meta em <strong>{days} dias</strong>.
        </p>
      </div>
    </div>
  );
};

export default GoalCalculator;
