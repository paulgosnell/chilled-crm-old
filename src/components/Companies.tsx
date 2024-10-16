import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import CompanyDetails from './CompanyDetails';
import AddCompanyForm from './AddCompanyForm';
import EmptyState from './EmptyState';
import { Company } from '@/types/company';
import { getCompanies, addCompany, deleteCompany } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
    window.addEventListener('openAddForm', handleAddCompany);
    return () => {
      window.removeEventListener('openAddForm', handleAddCompany);
    };
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const fetchedCompanies = await getCompanies();
      setCompanies(fetchedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsAddingCompany(false);
    setIsSheetOpen(true);
  };

  const handleAddCompany = () => {
    setIsAddingCompany(true);
    setSelectedCompany(null);
    setIsSheetOpen(true);
  };

  const handleAddCompanySubmit = async (newCompany: Partial<Company>) => {
    setIsLoading(true);
    const tempId = Date.now().toString();
    const tempCompany = { ...newCompany, id: tempId } as Company;
    setCompanies(prevCompanies => [...prevCompanies, tempCompany]);
    setIsSheetOpen(false);

    try {
      const addedCompany = await addCompany(newCompany);
      if (addedCompany) {
        setCompanies(prevCompanies => prevCompanies.map(company => company.id === tempId ? addedCompany : company));
        toast({
          title: "Company added",
          description: "The company has been successfully added.",
        });
      } else {
        throw new Error("Failed to add company");
      }
    } catch (error) {
      console.error('Error adding company:', error);
      setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== tempId));
      toast({
        title: "Error",
        description: "Failed to add company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    setIsLoading(true);
    const companyToDelete = companies.find(company => company.id === id);
    setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== id));

    try {
      await deleteCompany(id);
      toast({
        title: "Company deleted",
        description: "The company has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      if (companyToDelete) {
        setCompanies(prevCompanies => [...prevCompanies, companyToDelete]);
      }
      toast({
        title: "Error",
        description: "Failed to delete company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && companies.length === 0 ? (
            <EmptyState
              title="No companies yet"
              description="Get started by adding your first company."
              actionLabel="Add Company"
              onAction={handleAddCompany}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCompanies.map((company) => (
                  <TableRow key={company.id} onClick={() => handleCompanyClick(company)} className="cursor-pointer">
                    <TableCell className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={company.logo} alt={company.name} />
                        <AvatarFallback>{company.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{company.name}</span>
                    </TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell>{company.contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] bg-background">
          {isAddingCompany ? (
            <AddCompanyForm onClose={() => setIsSheetOpen(false)} onAdd={handleAddCompanySubmit} />
          ) : (
            selectedCompany && (
              <CompanyDetails
                company={selectedCompany}
                onEdit={fetchCompanies}
                onDelete={handleDeleteCompany}
              />
            )
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Companies;