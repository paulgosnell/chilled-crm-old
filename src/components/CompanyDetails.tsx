import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIInsights from './AIInsights';
import { Company } from '@/types/company';
import { useToast } from "@/components/ui/use-toast";

interface CompanyDetailsProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit(company);
  };

  const handleDelete = () => {
    onDelete(company.id);
    toast({
      title: "Company deleted",
      description: "The company has been successfully deleted.",
    });
  };

  const companyInsights = [
    `${company.name} has been a client for 2 years.`,
    `Recent growth of 15% in the ${company.industry} sector.`,
    `Potential for upselling our premium services.`,
  ];

  const companyNews = [
    `${company.name} announces new product launch next month.`,
    `Industry report: ${company.industry} sector expected to grow by 20% this year.`,
    `${company.name} featured in "Top 10 Companies to Watch" list.`,
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={company.logo} alt={company.name} />
            <AvatarFallback>{company.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{company.name}</h2>
            <p className="text-muted-foreground">{company.industry}</p>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Industry</h3>
          <p>{company.industry}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location</h3>
          <p>{company.location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Primary Contact</h3>
          <p>{company.contact}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button onClick={() => window.open(`https://www.linkedin.com/company/${encodeURIComponent(company.name)}`, '_blank')}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
        <Button variant="outline" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(company.name)}`, '_blank')}>
          Search
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <AIInsights insights={companyInsights} showCard={false} showTitle={false} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company News</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {companyNews.map((news, index) => (
              <li key={index}>{news}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Related Deals</h3>
        <p>Implement a list of related deals here</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Related Contacts</h3>
        <p>Implement a list of related contacts here</p>
      </div>
    </div>
  );
};

export default CompanyDetails;