import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, LineChart, CheckSquare, PieChart } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-0">
        <img src="/images/chilled-logo.png" alt="Chilled CRM Logo" className="h-10" />
        <div>
          <Button variant="ghost" className="mr-2">Contact us</Button>
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 sm:px-0 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl font-bold mb-6">Less stress, more sales with AI-Powered CRM</h1>
          <p className="text-xl mb-8">Save time, reduce stress, and boost sales by discovering leads and winning opportunities with AI-powered insights.</p>
          <Link to="/login">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Get Started Today
            </Button>
          </Link>
        </div>
        <div className="lg:w-1/2">
          <video 
            src="https://chilledcrm.com/assets/videos/video01.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 sm:px-0">
          <h2 className="text-3xl font-bold text-center mb-12">Transform Your Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="Instant Lead Capture"
              description="Quickly add new leads to your CRM with our Chrome extension."
              imageSrc="/images/lead-capture.png"
            />
            <FeatureCard
              title="Seamless Integrations"
              description="Integrate with your favorite tools and automate your workflow."
              imageSrc="/images/integrations.png"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-0">
          <h2 className="text-3xl font-bold text-center mb-12">Why Chilled CRM?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BenefitCard
              title="AI Smart Suggestions"
              description="Get real-time, data-driven suggestions on the best next steps. Improve follow-up and close more deals with AI-powered decision support."
              icon={Brain}
            />
            <BenefitCard
              title="AI-Powered Insights"
              description="Instantly access key insights and company data, helping you craft personalized communication strategies and close deals faster with data-driven engagement."
              icon={LineChart}
            />
            <BenefitCard
              title="Tasks & Follow-ups"
              description="Never miss a beat with automated task tracking and follow-up reminders. Stay organized and close more deals with smart task management."
              icon={CheckSquare}
            />
            <BenefitCard
              title="Enhanced Sales Pipeline"
              description="Visualize your sales process at a glance. Track deals, identify bottlenecks, and take action to close more deals with ease."
              icon={PieChart}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto text-center px-4 sm:px-0">
          <h2 className="text-3xl font-bold mb-6">Ready to Chill with Us?</h2>
          <p className="text-xl mb-8">Be one of the first to experience Chilled CRM for free!<br />We're rolling out new seats (and ice cubes) every week.<br />Sign up now and we'll email you an exclusive invite!</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input type="email" placeholder="Your Email" className="max-w-xs w-full" />
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
              Send Invite
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10">
        <div className="container mx-auto text-center px-4 sm:px-0">
          <p className="text-sm text-gray-600">© Chilled CRM is part of Chilled Tools. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center space-x-4 mt-4">
            <img src="/images/stackblitz.jpg" alt="StackBlitz" className="h-6 mb-2" />
            <img src="/images/resend.jpg" alt="Resend" className="h-6 mb-2" />
            <img src="/images/netlify.jpg" alt="Netlify" className="h-6 mb-2" />
            <img src="/images/supabase.jpg" alt="Supabase" className="h-6 mb-2" />
            <img src="/images/openai.jpg" alt="OpenAI" className="h-6 mb-2" />
            <img src="/images/stripe.jpg" alt="Stripe" className="h-6 mb-2" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string; imageSrc: string }> = ({ title, description, imageSrc }) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-64 overflow-hidden">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const BenefitCard: React.FC<{ title: string; description: string; icon: React.ElementType }> = ({ title, description, icon: Icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Icon className="h-8 w-8 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default HomePage;