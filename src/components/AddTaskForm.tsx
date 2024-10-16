import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addTask } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

const AddTaskForm = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [attachedToType, setAttachedToType] = useState('');
  const [attachedToName, setAttachedToName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = { 
      title, 
      priority, 
      category, 
      attached_to_type: attachedToType, 
      attached_to_name: attachedToName, 
      status: 'Open',
      due_date: dueDate
    };
    const result = await addTask(newTask);
    if (result) {
      toast({
        title: "Task added",
        description: "The task has been successfully added.",
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select onValueChange={setPriority} required>
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
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="attachedToType">Attached To Type</Label>
        <Select onValueChange={setAttachedToType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Contact">Contact</SelectItem>
            <SelectItem value="Company">Company</SelectItem>
            <SelectItem value="Deal">Deal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="attachedToName">Attached To Name</Label>
        <Input id="attachedToName" value={attachedToName} onChange={(e) => setAttachedToName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  );
};

export default AddTaskForm;