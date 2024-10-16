import { supabase } from './supabase';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';
import { Deal } from '@/types/deal';
import { Task } from '@/types/task';
import { Activity } from '@/types/activity';

export const getContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
};

export const getCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
};

export const getDeals = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date');
  if (error) throw error;
  return data || [];
};

export const getActivities = async (limit: number = 10): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const addContact = async (contact: Partial<Contact>): Promise<Contact | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No authenticated user found');
    return null;
  }
  
  const { data, error } = await supabase
    .from('contacts')
    .insert({ ...contact, user_id: user.id })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding contact:', error);
    return null;
  }
  return data;
};

export const updateContact = async (contact: Contact): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from('contacts')
    .update(contact)
    .eq('id', contact.id)
    .select()
    .single();
  if (error) {
    console.error('Error updating contact:', error);
    return null;
  }
  return data;
};

export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

export const addCompany = async (company: Partial<Company>): Promise<Company | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No authenticated user found');
    return null;
  }
  
  const { data, error } = await supabase
    .from('companies')
    .insert({ ...company, user_id: user.id })
    .select()
    .single();
  if (error) {
    console.error('Error adding company:', error);
    return null;
  }
  return data;
};

export const updateCompany = async (company: Company): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .update(company)
    .eq('id', company.id)
    .select()
    .single();
  if (error) {
    console.error('Error updating company:', error);
    return null;
  }
  return data;
};

export const deleteCompany = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

export const addDeal = async (deal: Partial<Deal>): Promise<Deal | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No authenticated user found');
    return null;
  }
  
  const { data, error } = await supabase
    .from('deals')
    .insert({ ...deal, user_id: user.id })
    .select()
    .single();
  if (error) {
    console.error('Error adding deal:', error);
    return null;
  }
  return data;
};

export const updateDeal = async (deal: Deal): Promise<Deal | null> => {
  const { data, error } = await supabase
    .from('deals')
    .update(deal)
    .eq('id', deal.id)
    .select()
    .single();
  if (error) {
    console.error('Error updating deal:', error);
    return null;
  }
  return data;
};

export const deleteDeal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};

export const addTask = async (task: Partial<Task>): Promise<Task | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No authenticated user found');
    return null;
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...task, user_id: user.id })
    .select()
    .single();
  if (error) {
    console.error('Error adding task:', error);
    return null;
  }
  return data;
};

export const updateTask = async (task: Task): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', task.id)
    .select()
    .single();
  if (error) {
    console.error('Error updating task:', error);
    return null;
  }
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const checkSubscription = async (): Promise<'free_trial' | 'standard' | 'pro' | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('subscription_plan, trial_ends_at')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error checking subscription:', error);
    return null;
  }

  if (data.subscription_plan === 'free_trial' && new Date(data.trial_ends_at) < new Date()) {
    // Trial has ended, update to null subscription
    await supabase
      .from('users')
      .update({ subscription_plan: null })
      .eq('id', user.id);
    return null;
  }

  return data.subscription_plan;
};