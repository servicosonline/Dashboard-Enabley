
export interface ProspectData {
  Nome: string;
  Sobrenome?: string;
  Empresa: string;
  Cargo?: string;
  Origem?: string;
  'Touch 1'?: string;
  'Touch 2'?: string;
  'Touch 3'?: string;
  'Touch 4'?: string;
  'Touch 5'?: string;
  'Touch 6'?: string;
  'Touch 7'?: string;
  'Data Conexão'?: string;
  'Data de Resposta'?: string;
  'Próximo Touch'?: string;
  'Terceiro Touch'?: string;
  'Quarto Touch'?: string;
  'Quinto Touch'?: string;
  'Sexto Touch'?: string;
  'Sétimo Touch'?: string;
  Resposta?: string;
  Resultado?: string;
  'Touch Vencedor'?: string;
}

export interface PendingTouch {
  date: Date | null;
  dateStr: string;
  label: string;
  num: number;
}
