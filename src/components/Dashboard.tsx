import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, DollarSign, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIInsights from './AIInsights';
import ActivityFeed from './ActivityFeed';
import Calendar from './Calendar';
import { UserProfile } from '@/types/user';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';
import { Deal } from '@/types/deal';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { getContacts, getCompanies, getDeals, getTasks } from '@/lib/api';

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedContacts, fetchedCompanies, fetchedDeals, fetchedTasks] = await Promise.all([
        getContacts(),
        getCompanies(),
        getDeals(),
        getTasks()
      ]);
      setContacts(fetchedContacts);
      setCompanies(fetchedCompanies);
      setDeals(fetchedDeals);
      setTasks(fetchedTasks);
    };

    fetchData();

    setIsProfileComplete(
      !!userProfile.name &&
      !!userProfile.role &&
      !!userProfile.company &&
      !!userProfile.industry &&
      !!userProfile.product_or_service &&
      !!userProfile.location &&
      !!userProfile.target_market
    );
  }, [userProfile]);

  const morningBrief = (
    <span>
      You have <Link to="/tasks" className="text-primary hover:underline">{tasks.filter(task => task.status === 'Open').length} open tasks</Link>. 
      {deals.length > 0 && (
        <>
          {' '}
          <Link to="/deals" className="text-primary hover:underline">
            You have {deals.length} active deal{deals.length !== 1 ? 's' : ''}
          </Link>
          .
        </>
      )}
      {' '}
      You have <Link to="/contacts" className="text-primary hover:underline">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</Link> in your network.
    </span>
  );

  return (
    <div className="space-y-6">
      {!isProfileComplete && (
        <Card className="bg-yellow-100 border-yellow-300">
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-yellow-800">
              Complete your profile to get personalized AI insights and improve your CRM experience.
            </p>
            <Link to="/settings/profile">
              <Button variant="outline">Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      )}
      <Card className="panel-bg">
        <CardHeader>
          <CardTitle>Welcome back, {userProfile.name || 'User'}! Here's your morning brief</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{morningBrief}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(task => task.status === 'Open').length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsights 
          userProfile={userProfile}
          contacts={contacts}
          companies={companies}
          deals={deals}
          tasks={tasks}
        />
        <ActivityFeed />
      </div>

      <Calendar />
    </div>
  );
};

export default Dashboard;