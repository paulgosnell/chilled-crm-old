import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Stars } from 'lucide-react';
import { generateInsights } from '@/services/openai';
import { generateInsightContext } from '@/services/insightContext';
import { UserProfile } from '@/types/user';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';
import { Deal } from '@/types/deal';
import { Task } from '@/types/task';
import ReactMarkdown from 'react-markdown';
import { checkSubscription } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AIInsightsProps {
  userProfile: UserProfile;
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  showCard?: boolean;
  showTitle?: boolean;
  type?: 'dashboard' | 'contacts' | 'companies' | 'deals' | 'tasks';
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  userProfile,
  contacts,
  companies,
  deals,
  tasks,
  showCard = true, 
  showTitle = true,
  type = 'dashboard'
}) => {
  const [displayedInsights, setDisplayedInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProSubscriber, setIsProSubscriber] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      const subscriptionStatus = await checkSubscription();
      setIsProSubscriber(subscriptionStatus === 'pro' || subscriptionStatus === 'free_trial');
    };

    checkSubscriptionStatus();
  }, []);

  useEffect(() => {
    if (isProSubscriber) {
      fetchInsights();
    } else {
      setLoading(false);
    }
  }, [isProSubscriber, type, userProfile, contacts, companies, deals, tasks]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const context = generateInsightContext(userProfile, contacts, companies, deals, tasks);
      const { insights } = await generateInsights(context, userProfile);
      setDisplayedInsights(insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setDisplayedInsights(['Unable to generate insights at this time.']);
    } finally {
      setLoading(false);
    }
  };

  const InsightsList = () => (
    <ul className="space-y-2">
      {loading ? (
        <li className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Generating AI insights...</span>
        </li>
      ) : isProSubscriber ? (
        displayedInsights.map((insight, index) => (
          <li key={index} className="flex items-start">
            <ReactMarkdown className="prose dark:prose-invert">{insight}</ReactMarkdown>
          </li>
        ))
      ) : (
        <li>
          <p>AI Insights are available for Pro subscribers.</p>
          <Button onClick={() => navigate('/subscription')} className="mt-2">
            Upgrade to Pro
          </Button>
        </li>
      )}
    </ul>
  );

  if (!showCard) {
    return <InsightsList />;
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stars className="mr-2 h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <InsightsList />
      </CardContent>
    </Card>
  );
};

export default AIInsights;