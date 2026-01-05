
import { ProspectData, PendingTouch } from '../types';

export const safeStr = (val: any): string => (val ? String(val).trim() : '');
export const safeLower = (val: any): string => safeStr(val).toLowerCase();

export const parseDate = (dateStr: any): Date | null => {
  const s = safeStr(dateStr);
  if (!s) return null;

  // Handle common spreadsheet date serial numbers
  if (!isNaN(Number(s)) && Number(s) > 40000) {
    const d = new Date((Number(s) - 25569) * 86400 * 1000);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  if (s.includes('/')) {
    const parts = s.split('/');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      d.setHours(0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const d = new Date(s);
  d.setHours(0, 0, 0, 0);
  return isNaN(d.getTime()) ? null : d;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

export const getChannelFromText = (text: string): string => {
  if (!text) return 'outros';
  const t = text.toLowerCase();
  if (t.includes('linkedin')) return 'linkedin';
  if (t.includes('email') || t.includes('assunto:')) return 'email';
  if (t.includes('whatsapp') || t.match(/\[\d{2}:\d{2}, \d{2}\/\d{2}\/\d{4}\]/)) return 'whatsapp';
  return 'outros';
};

export const getLastTouch = (item: ProspectData): string => {
  for (let i = 7; i >= 1; i--) {
    const key = `Touch ${i}` as keyof ProspectData;
    if (safeStr(item[key])) return `Touch ${i}`;
  }
  return 'Sem Touch';
};

export const getNextPendingTouch = (item: ProspectData): PendingTouch | null => {
  if (safeStr(item.Resposta) !== '' || safeStr(item.Resultado) !== '') return null;
  
  const sequence = [
    { statusKey: 'Touch 2' as keyof ProspectData, dateKey: 'Próximo Touch' as keyof ProspectData, label: 'Touch 2', num: 2 },
    { statusKey: 'Touch 3' as keyof ProspectData, dateKey: 'Terceiro Touch' as keyof ProspectData, label: 'Touch 3', num: 3 },
    { statusKey: 'Touch 4' as keyof ProspectData, dateKey: 'Quarto Touch' as keyof ProspectData, label: 'Touch 4', num: 4 },
    { statusKey: 'Touch 5' as keyof ProspectData, dateKey: 'Quinto Touch' as keyof ProspectData, label: 'Touch 5', num: 5 },
    { statusKey: 'Touch 6' as keyof ProspectData, dateKey: 'Sexto Touch' as keyof ProspectData, label: 'Touch 6', num: 6 },
    { statusKey: 'Touch 7' as keyof ProspectData, dateKey: 'Sétimo Touch' as keyof ProspectData, label: 'Touch 7', num: 7 }
  ];

  for (const step of sequence) {
    if (safeStr(item[step.statusKey]) === '') {
      const dateVal = item[step.dateKey];
      const parsed = parseDate(dateVal);
      return { date: parsed, dateStr: safeStr(dateVal) || 'Data N/D', label: step.label, num: step.num };
    }
  }
  return null;
};
