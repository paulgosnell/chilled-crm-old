import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationList: React.FC = () => {
  const notifications = useNotifications();

  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-4">
      <div className="space-y-4 mt-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-card rounded-lg p-4 shadow-sm"
          >
            <h3 className="font-semibold text-sm">{notification.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.description}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  notification.status === 'unread'
                    ? 'bg-blue-100 text-blue-800'
                    : notification.status === 'read'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {notification.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationList;