import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDeal } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

const AddDealForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState('');
  const [contact, setContact] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal = { 
      name, 
      company, 
      value: parseFloat(value), 
      stage, 
      contact,
      close_date: closeDate
    };
    const result = await addDeal(newDeal);
    if (result) {
      toast({
        title: "Deal added",
        description: "The deal has been successfully added.",
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to add deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Deal Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="value">Value</Label>
        <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="stage">Stage</Label>
        <Select onValueChange={setStage} required>
          <SelectTrigger>
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pitch">Pitch</SelectItem>
            <SelectItem value="Meet">Meet</SelectItem>
            <SelectItem value="Won">Won</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contact">Contact</Label>
        <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="closeDate">Close Date</Label>
        <Input id="closeDate" type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} required />
      </div>
      <Button type="submit">Add Deal</Button>
    </form>
  );
};

export default AddDealForm;