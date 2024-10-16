import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import AIInsights from './AIInsights';
import { Deal } from '@/types/deal';
import { useToast } from "@/components/ui/use-toast";

interface DealDetailsProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

const DealDetails: React.FC<DealDetailsProps> = ({ deal, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit(deal);
  };

  const handleDelete = () => {
    onDelete(deal.id);
    toast({
      title: "Deal deleted",
      description: "The deal has been successfully deleted.",
    });
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Meet': return 'bg-blue-500';
      case 'Pitch': return 'bg-yellow-500';
      case 'Won': return 'bg-green-500';
      case 'Lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{deal.name}</h2>
          <p className="text-muted-foreground">{deal.company}</p>
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
          <h3 className="font-semibold">Value</h3>
          <p>${deal.value.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Stage</h3>
          <Badge className={`${getStageColor(deal.stage)} text-white`}>{deal.stage}</Badge>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <p>{deal.contact}</p>
        </div>
        <div>
          <h3 className="font-semibold">Close Date</h3>
          <p>{new Date(deal.close_date).toLocaleDateString()}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <AIInsights type="deals" showCard={false} showTitle={false} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DealDetails;