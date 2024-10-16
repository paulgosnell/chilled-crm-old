export interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: 'unread' | 'read' | 'archived';
}