
import React, { useMemo } from 'react';
import { ProspectData } from '../types';
import { safeStr, safeLower, getLastTouch, getChannelFromText, getNextPendingTouch, formatDate } from '../utils/dataHelpers';
import { MessageSquare, Calendar, CheckCircle, Linkedin, Mail, Phone, Info, Target } from 'lucide-react';

interface Props {
  data: ProspectData[];
}

const ContactCard: React.FC<{ item: ProspectData; status: string; color: string; isLate?: boolean }> = ({ item, status, color, isLate }) => {
  const lastTouch = getLastTouch(item);
  const pending = getNextPendingTouch(item);
  
  const renderIcon = () => {
    const ch = getChannelFromText(item[lastTouch as keyof ProspectData] as string);
    if (ch === 'linkedin') return <Linkedin className="w-3 h-3 text-blue-400" />;
    if (ch === 'email') return <Mail className="w-3 h-3 text-red-400" />;
    if (ch === 'whatsapp') return <Phone className="w-3 h-3 text-green-400" />;
    return <Info className="w-3 h-3 text-slate-400" />;
  };

  return (
    <div className={`p-3 rounded-xl border ${isLate ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-slate-800/40'} hover:bg-slate-700/60 transition-all mb-3 group`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="text-xs font-bold text-white truncate w-32">{item.Nome} {item.Sobrenome}</h5>
          <p className="text-[10px] text-slate-500 truncate w-32">{item.Empresa}</p>
        </div>
        <div className="p-1.5 bg-slate-900/50 rounded-lg">
          {renderIcon()}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
        <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>{status}</span>
        <div className="text-right">
          <p className="text-[9px] text-slate-500">{lastTouch}</p>
          {isLate && pending?.date && (
            <p className="text-[9px] text-red-400 font-bold">⚠️ {formatDate(pending.date).substring(0, 5)}</p>
          )}
        </div>
      </div>
      
      {safeStr(item.Resposta) && (
        <div className="mt-2 p-1.5 bg-purple-500/10 rounded text-[9px] text-purple-300 italic border border-purple-500/20">
          "{item.Resposta.substring(0, 60)}..."
        </div>
      )}
    </div>
  );
};

const KanbanSection: React.FC<Props> = ({ data }) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const stages = useMemo(() => {
    return {
      prospeccao: data.filter(d => !safeStr(d.Resultado) && !safeStr(d.Resposta)),
      responderam: data.filter(d => safeStr(d.Resposta) && !safeStr(d.Resultado)),
      agendados: data.filter(d => safeLower(d.Resultado).includes('agend')),
      finalizados: data.filter(d => safeStr(d.Resultado) && !safeLower(d.Resultado).includes('agend'))
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-purple-400" />
        Kanban de Prospecção
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Coluna 1 */}
        <div className="flex flex-col h-[600px] glass-card rounded-2xl p-4 border-yellow-500/20">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Em Prospecção
            </h4>
            <span className="text-[10px] px-2 py-0.5 bg-yellow-400/10 rounded-full text-yellow-400">{stages.prospeccao.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {stages.prospeccao.map((item, i) => (
              <ContactCard key={i} item={item} status="AGUARDANDO" color="text-yellow-400" isLate={getNextPendingTouch(item)?.date ? (getNextPendingTouch(item)!.date! < today) : false} />
            ))}
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="flex flex-col h-[600px] glass-card rounded-2xl p-4 border-purple-500/20">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Responderam
            </h4>
            <span className="text-[10px] px-2 py-0.5 bg-purple-400/10 rounded-full text-purple-400">{stages.responderam.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {stages.responderam.map((item, i) => (
              <ContactCard key={i} item={item} status="RESPONDIDO" color="text-purple-400" />
            ))}
          </div>
        </div>

        {/* Coluna 3 */}
        <div className="flex flex-col h-[600px] glass-card rounded-2xl p-4 border-teal-500/20">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2">
              <Target className="w-4 h-4" /> Agendados
            </h4>
            <span className="text-[10px] px-2 py-0.5 bg-teal-400/10 rounded-full text-teal-400">{stages.agendados.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {stages.agendados.map((item, i) => (
              <ContactCard key={i} item={item} status="META BATIDA" color="text-teal-400" />
            ))}
          </div>
        </div>

        {/* Coluna 4 */}
        <div className="flex flex-col h-[600px] glass-card rounded-2xl p-4 border-slate-500/20">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Finalizados
            </h4>
            <span className="text-[10px] px-2 py-0.5 bg-slate-400/10 rounded-full text-slate-400">{stages.finalizados.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {stages.finalizados.map((item, i) => (
              <ContactCard key={i} item={item} status="CONCLUÍDO" color="text-slate-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanSection;
