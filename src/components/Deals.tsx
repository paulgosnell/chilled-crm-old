import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import DealDetails from './DealDetails';
import AddDealForm from './AddDealForm';
import EmptyState from './EmptyState';
import { Deal } from '@/types/deal';
import { getDeals, addDeal, deleteDeal } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeals();
    window.addEventListener('openAddForm', handleAddDeal);
    return () => {
      window.removeEventListener('openAddForm', handleAddDeal);
    };
  }, []);

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const fetchedDeals = await getDeals();
      setDeals(fetchedDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsAddingDeal(false);
    setIsSheetOpen(true);
  };

  const handleAddDeal = () => {
    setIsAddingDeal(true);
    setSelectedDeal(null);
    setIsSheetOpen(true);
  };

  const handleAddDealSubmit = async (newDeal: Partial<Deal>) => {
    setIsLoading(true);
    const tempId = Date.now().toString();
    const tempDeal = { ...newDeal, id: tempId } as Deal;
    setDeals(prevDeals => [...prevDeals, tempDeal]);
    setIsSheetOpen(false);

    try {
      const addedDeal = await addDeal(newDeal);
      if (addedDeal) {
        setDeals(prevDeals => prevDeals.map(deal => deal.id === tempId ? addedDeal : deal));
        toast({
          title: "Deal added",
          description: "The deal has been successfully added.",
        });
      } else {
        throw new Error("Failed to add deal");
      }
    } catch (error) {
      console.error('Error adding deal:', error);
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== tempId));
      toast({
        title: "Error",
        description: "Failed to add deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    setIsLoading(true);
    const dealToDelete = deals.find(deal => deal.id === id);
    setDeals(prevDeals => prevDeals.filter(deal => deal.id !== id));

    try {
      await deleteDeal(id);
      toast({
        title: "Deal deleted",
        description: "The deal has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting deal:', error);
      if (dealToDelete) {
        setDeals(prevDeals => [...prevDeals, dealToDelete]);
      }
      toast({
        title: "Error",
        description: "Failed to delete deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedDeals = [...deals].sort((a, b) => new Date(b.close_date).getTime() - new Date(a.close_date).getTime());

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && deals.length === 0 ? (
            <EmptyState
              title="No deals yet"
              description="Get started by adding your first deal."
              actionLabel="Add Deal"
              onAction={handleAddDeal}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Close Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDeals.map((deal) => (
                  <TableRow key={deal.id} onClick={() => handleDealClick(deal)} className="cursor-pointer">
                    <TableCell>{deal.name}</TableCell>
                    <TableCell>{deal.company}</TableCell>
                    <TableCell>${deal.value.toLocaleString()}</TableCell>
                    <TableCell>{deal.stage}</TableCell>
                    <TableCell>{deal.contact}</TableCell>
                    <TableCell>{new Date(deal.close_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] bg-background">
          {isAddingDeal ? (
            <AddDealForm onClose={() => setIsSheetOpen(false)} onAdd={handleAddDealSubmit} />
          ) : (
            selectedDeal && (
              <DealDetails
                deal={selectedDeal}
                onEdit={fetchDeals}
                onDelete={handleDeleteDeal}
              />
            )
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Deals;