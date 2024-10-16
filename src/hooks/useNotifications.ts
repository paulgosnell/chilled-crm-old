import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch initial notifications
    fetchNotifications();

    // Set up real-time subscription
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, handleNotificationChange)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data);
    }
  };

  const handleNotificationChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setNotifications(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setNotifications(prev => prev.map(notif => notif.id === payload.new.id ? payload.new : notif));
    } else if (payload.eventType === 'DELETE') {
      setNotifications(prev => prev.filter(notif => notif.id !== payload.old.id));
    }
  };

  return notifications;
}