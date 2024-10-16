export interface Activity {
  id: string;
  user_id: string;
  type: string;
  description: string;
  related_to_type?: string;
  related_to_id?: string;
  created_at: string;
}