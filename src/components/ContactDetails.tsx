import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Mail, MessageSquare, Edit, Trash } from 'lucide-react';
import AIInsights from './AIInsights';
import { Contact } from '@/types/contact';
import { useToast } from "@/components/ui/use-toast";

interface ContactDetailsProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit(contact);
  };

  const handleDelete = () => {
    onDelete(contact.id);
    toast({
      title: "Contact deleted",
      description: "The contact has been successfully deleted.",
    });
  };

  const personalInsights = [
    `${contact.name} has been a contact for 6 months.`,
    `Last interaction was 2 weeks ago via email.`,
    `${contact.name} showed interest in our new product line.`,
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{contact.name}</h2>
          <p className="text-muted-foreground">{contact.company}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Industry</h3>
          <p>{contact.industry}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location</h3>
          <p>{contact.location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Email</h3>
          <p className="truncate" title={contact.email}>{contact.email}</p>
        </div>
        <div>
          <h3 className="font-semibold">Phone</h3>
          <p>{contact.phone}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => window.location.href = `mailto:${contact.email}`}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button variant="outline" onClick={() => window.open(`https://wa.me/${contact.phone.replace(/\D/g,'')}`, '_blank')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        <Button variant="outline" onClick={() => window.open(`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(contact.name)}`, '_blank')}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <AIInsights insights={personalInsights} showCard={false} showTitle={false} />
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-2 mt-4">
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
  );
};

export default ContactDetails;