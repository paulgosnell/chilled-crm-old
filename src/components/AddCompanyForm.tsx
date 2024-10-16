import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addCompany } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

const AddCompanyForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany = { name, industry, location, contact };
    const result = await addCompany(newCompany);
    if (result) {
      toast({
        title: "Company added",
        description: "The company has been successfully added.",
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to add company. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Company Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="contact">Primary Contact</Label>
        <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
      </div>
      <Button type="submit">Add Company</Button>
    </form>
  );
};

export default AddCompanyForm;