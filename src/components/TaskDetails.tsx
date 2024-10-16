import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash } from 'lucide-react';
import AIInsights from './AIInsights';
import { Task } from '@/types/task';
import { useToast } from "@/components/ui/use-toast";

interface TaskDetailsProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onEdit, onDelete }) => {
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    const updatedTask = { ...task, priority, status };
    onEdit(updatedTask);
    setIsEditing(false);
    toast({
      title: "Task updated",
      description: "The task has been successfully updated.",
    });
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <p className="text-muted-foreground">{task.category}</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleEdit}>Save Changes</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Priority</h3>
              <p>{task.priority}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{task.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Category</h3>
              <p>{task.category}</p>
            </div>
            <div>
              <h3 className="font-semibold">Attached To</h3>
              <p>{`${task.attached_to_type}: ${task.attached_to_name}`}</p>
            </div>
            <div>
              <h3 className="font-semibold">Due Date</h3>
              <p>{new Date(task.due_date).toLocaleDateString()}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <AIInsights type="tasks" showCard={false} showTitle={false} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TaskDetails;