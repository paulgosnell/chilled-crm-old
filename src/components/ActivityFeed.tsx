import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, DollarSign, CheckSquare, Mail, Phone, Globe } from 'lucide-react';
import { Activity, getActivities } from '@/lib/api';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

const activityIcons = {
  contact_created: Users,
  company_created: Building2,
  deal_created: DollarSign,
  task_created: CheckSquare,
  email_sent: Mail,
  call_logged: Phone,
  login: Globe,
};

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const fetchedActivities = await getActivities(5);
    setActivities(fetchedActivities);
  };

  useRealtimeSubscription<Activity>('activities', (payload) => {
    if (payload.new) {
      setActivities(prev => [payload.new, ...prev.slice(0, 4)]);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type as keyof typeof activityIcons] || Globe;
            return (
              <li key={activity.id} className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;