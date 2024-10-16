import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import ContactDetails from './ContactDetails';
import AddContactForm from './AddContactForm';
import EmptyState from './EmptyState';
import { Contact } from '@/types/contact';
import { getContacts, addContact, deleteContact } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
    window.addEventListener('openAddForm', handleAddContact);
    return () => {
      window.removeEventListener('openAddForm', handleAddContact);
    };
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const fetchedContacts = await getContacts();
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsAddingContact(false);
    setIsSheetOpen(true);
  };

  const handleAddContact = () => {
    setIsAddingContact(true);
    setSelectedContact(null);
    setIsSheetOpen(true);
  };

  const handleAddContactSubmit = async (newContact: Partial<Contact>) => {
    setIsLoading(true);
    const tempId = Date.now().toString();
    const tempContact = { ...newContact, id: tempId } as Contact;
    setContacts(prevContacts => [...prevContacts, tempContact]);
    setIsSheetOpen(false);

    try {
      const addedContact = await addContact(newContact);
      if (addedContact) {
        setContacts(prevContacts => prevContacts.map(contact => contact.id === tempId ? addedContact : contact));
        toast({
          title: "Contact added",
          description: "The contact has been successfully added.",
        });
      } else {
        throw new Error("Failed to add contact");
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== tempId));
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    setIsLoading(true);
    const contactToDelete = contacts.find(contact => contact.id === id);
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));

    try {
      await deleteContact(id);
      toast({
        title: "Contact deleted",
        description: "The contact has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      if (contactToDelete) {
        setContacts(prevContacts => [...prevContacts, contactToDelete]);
      }
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && contacts.length === 0 ? (
            <EmptyState
              title="No contacts yet"
              description="Get started by adding your first contact."
              actionLabel="Add Contact"
              onAction={handleAddContact}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedContacts.map((contact) => (
                  <TableRow key={contact.id} onClick={() => handleContactClick(contact)} className="cursor-pointer">
                    <TableCell className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{contact.name}</span>
                    </TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>{contact.industry}</TableCell>
                    <TableCell>{contact.location}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          {isAddingContact ? (
            <AddContactForm onClose={() => setIsSheetOpen(false)} onAdd={handleAddContactSubmit} />
          ) : (
            selectedContact && <ContactDetails contact={selectedContact} onDelete={handleDeleteContact} onEdit={fetchContacts} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Contacts;