import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

const Help: React.FC = () => {
  const { toast } = useToast();
  const faqs = [
    {
      question: "How do I add a new contact?",
      answer: "To add a new contact, go to the Contacts page and click the 'Add Contact' button. Fill in the required information and click 'Save'."
    },
    {
      question: "Can I export my data?",
      answer: "Currently, data export is not available. We're working on implementing this feature in a future update."
    },
    {
      question: "How do I upgrade my subscription?",
      answer: "To upgrade your subscription, go to the Subscription page from the sidebar and choose the plan that best fits your needs."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All data is encrypted and stored securely. We never share your information with third parties."
    }
  ];

  const handleReportBug = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'Unknown';
    const version = '1.0.0'; // Replace with your actual version number
    const browserInfo = navigator.userAgent;
    const subject = encodeURIComponent('Bug Report for ChilledCRM');
    const body = encodeURIComponent(`User ID: ${userId}\nVersion: ${version}\nBrowser: ${browserInfo}\n\nPlease describe the bug you encountered:`);
    window.location.href = `mailto:support@chilledcrm.com?subject=${subject}&body=${body}`;
    toast({
      title: "Bug Report",
      description: "Your email client should now open with a pre-filled bug report. Please add details about the bug you encountered.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Complete your profile setup to personalize your experience.</li>
            <li>Add your first contact or company from the respective pages.</li>
            <li>Create a deal and associate it with a contact or company.</li>
            <li>Set up tasks to keep track of your follow-ups and activities.</li>
            <li>Explore the AI insights to get valuable information about your CRM data.</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">If you need further assistance, please don't hesitate to contact our support team:</p>
          <p><strong>Email:</strong> support@chilledcrm.com</p>
          <p><strong>Hours:</strong> Monday to Friday, 9 AM - 5 PM EST</p>
          <div className="mt-4 flex space-x-4">
            <Button onClick={() => window.open('https://twitter.com/messages/compose?recipient_id=chilled_tools', '_blank')} className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              DM us on X
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report a Bug</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Encountered a bug? We'd love to hear from you so we can improve ChilledCRM!</p>
          <Button onClick={handleReportBug} className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Email Bug Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;