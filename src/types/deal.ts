export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'Pitch' | 'Meet' | 'Won' | 'Lost';
  contact: string;
  close_date: string;
}