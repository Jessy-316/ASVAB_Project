export interface Instrument {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  sound?: string | null;
  created_at?: string;
} 
