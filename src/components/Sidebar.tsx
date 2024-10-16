import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MdDashboard, MdContacts, MdBusiness, MdAttachMoney, MdAssignment, MdChevronLeft, MdChevronRight, MdLogout, MdPayment, MdPerson } from 'react-icons/md';
import { UserProfile } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { useTheme } from './theme-provider';

interface SidebarProps {
  userProfile: UserProfile | null;
}

const Sidebar: React.FC<SidebarProps> = ({ userProfile }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { icon: MdDashboard, label: 'Dashboard', path: '/' },
    { icon: MdContacts, label: 'Contacts', path: '/contacts' },
    { icon: MdBusiness, label: 'Companies', path: '/companies' },
    { icon: MdAttachMoney, label: 'Deals', path: '/deals' },
    { icon: MdAssignment, label: 'Tasks', path: '/tasks' },
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card text-card-foreground transition-all duration-300 relative border-r border-border",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        <img
          src="https://chilledcrm.com/assets/images/image07.png"
          alt="ChilledCRM Logo"
          className={cn("transition-all duration-300", collapsed ? "w-8" : "w-24")}
        />
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center p-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <Link
          to="/subscription"
          className={cn(
            "flex items-center p-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            location.pathname === '/subscription' ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          )}
        >
          <MdPayment className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
          {!collapsed && <span>Subscription</span>}
        </Link>
        {!collapsed && (
          <div className="mt-2 text-xs text-muted-foreground">
            Status: Beta Trial (Pro)
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={userProfile?.avatar} />
                <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              {!collapsed && <span className="truncate">{userProfile?.name || 'User'}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <MdPerson className="mr-2 h-4 w-4" />
              <span>Update Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              Toggle theme
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <MdLogout className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;