export interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  attached_to_type: string;
  attached_to_name: string;
  status: 'Open' | 'Done';
  due_date: string;
}