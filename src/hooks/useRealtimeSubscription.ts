import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type SubscriptionCallback<T> = (payload: { new: T, old: T }) => void;

export function useRealtimeSubscription<T>(
  table: string,
  callback: SubscriptionCallback<T>
) {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        (payload) => callback(payload as any)
      )
      .subscribe();

    setSubscription(channel);

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, callback]);

  return subscription;
}