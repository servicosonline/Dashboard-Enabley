
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { ProspectData } from '../types.ts';
import { safeStr, safeLower, getLastTouch, getChannelFromText, parseDate, formatDate } from '../utils/dataHelpers.ts';

interface Props {
  data: ProspectData[];
}

const COLORS = ['#0077b5', '#ea4335', '#25d366', '#a855f7', '#94a3b8'];

const ChartsSection: React.FC<Props> = ({ data }) => {
  const evolutionData = useMemo(() => {
    const dates: Record<string, { connections: number; responses: number; meetings: number }> = {};
    
    data.forEach(item => {
      const connDate = parseDate(item['Data Conexão']);
      if (connDate) {
        const key = formatDate(connDate).substring(0, 5); 
        if (!dates[key]) dates[key] = { connections: 0, responses: 0, meetings: 0 };
        dates[key].connections++;
      }
      
      const respDate = parseDate(item['Data de Resposta']);
      if (respDate) {
        const key = formatDate(respDate).substring(0, 5);
        if (!dates[key]) dates[key] = { connections: 0, responses: 0, meetings: 0 };
        if (safeStr(item.Resposta)) dates[key].responses++;
        if (safeLower(item.Resultado).includes('agend')) dates[key].meetings++;
      }
    });

    const sortedLabels = Object.keys(dates).sort((a, b) => {
      const [d1, m1] = a.split('/').map(Number);
      const [d2, m2] = b.split('/').map(Number);
      return (m1 * 100 + d1) - (m2 * 100 + d2);
    });

    let accConn = 0, accResp = 0, accMeet = 0;
    return sortedLabels.map(label => {
      accConn += dates[label].connections;
      accResp += dates[label].responses;
      accMeet += dates[label].meetings;
      return { label, total: accConn, resp: accResp, agend: accMeet };
    });
  }, [data]);

  const channelData = useMemo(() => {
    const channels: Record<string, number> = { linkedin: 0, email: 0, whatsapp: 0, outros: 0 };
    data.forEach(item => {
      for (let i = 1; i <= 7; i++) {
        const touch = item[`Touch ${i}` as keyof ProspectData];
        if (safeStr(touch)) {
          const ch = getChannelFromText(safeStr(touch));
          channels[ch] = (channels[ch] || 0) + 1;
        }
      }
    });
    return Object.entries(channels).map(([name, value]) => ({ name, value }));
  }, [data]);

  const efficiencyData = useMemo(() => {
    const channels: Record<string, number> = { linkedin: 0, email: 0, whatsapp: 0, outros: 0 };
    data.filter(d => safeLower(d.Resultado).includes('agend')).forEach(d => {
      const last = getLastTouch(d);
      const touchContent = d[last as keyof ProspectData];
      const ch = getChannelFromText(safeStr(touchContent));
      channels[ch] = (channels[ch] || 0) + 1;
    });
    return Object.entries(channels).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 rounded-2xl border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-6">Evolução Cumulativa</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAgend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="total" name="Total Contatos" stroke="#64748b" fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="resp" name="Respostas" stroke="#a855f7" fill="transparent" />
              <Area type="monotone" dataKey="agend" name="Agendados" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorAgend)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl border-purple-500/20">
          <h4 className="text-white font-semibold mb-6 text-center">Volume de Envios por Canal</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="value" name="Volume" radius={[0, 4, 4, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-teal-500/20">
          <h4 className="text-white font-semibold mb-6 text-center">Eficiência de Agendamento por Canal</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
