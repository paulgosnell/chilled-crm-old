import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 5,
    features: ['Up to 1000 contacts', 'Basic CRM features', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    features: ['Unlimited contacts', 'Advanced CRM features', 'AI insights', 'Priority support', 'API access'],
  },
];

const SubscriptionPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8" role="alert">
        <p className="font-bold">Beta Trial (Pro)</p>
        <p>You are currently on a beta trial with Pro features. Enjoy all features at no cost!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">${plan.price}/month</p>
              <ul className="list-disc list-inside mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button 
                className="w-full"
                disabled={true}
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;