import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import NotificationList from './NotificationList';
import { Bell, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();

  const showAddButton = ['/contacts', '/companies', '/deals', '/tasks'].includes(location.pathname);

  const handleAdd = () => {
    window.dispatchEvent(new Event('openAddForm'));
  };

  return (
    <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6 header-bg">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        {showAddButton && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add {title.slice(0, -1)}
          </Button>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <NotificationList />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;