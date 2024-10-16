import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import TaskDetails from './TaskDetails';
import AddTaskForm from './AddTaskForm';
import EmptyState from './EmptyState';
import { Task } from '@/types/task';
import { getTasks, addTask, deleteTask } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    window.addEventListener('openAddForm', handleAddTask);
    return () => {
      window.removeEventListener('openAddForm', handleAddTask);
    };
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsAddingTask(false);
    setIsSheetOpen(true);
  };

  const handleAddTask = () => {
    setIsAddingTask(true);
    setSelectedTask(null);
    setIsSheetOpen(true);
  };

  const handleAddTaskSubmit = async (newTask: Partial<Task>) => {
    setIsLoading(true);
    const tempId = Date.now().toString();
    const tempTask = { ...newTask, id: tempId } as Task;
    setTasks(prevTasks => [...prevTasks, tempTask]);
    setIsSheetOpen(false);

    try {
      const addedTask = await addTask(newTask);
      if (addedTask) {
        setTasks(prevTasks => prevTasks.map(task => task.id === tempId ? addedTask : task));
        toast({
          title: "Task added",
          description: "The task has been successfully added.",
        });
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== tempId));
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setIsLoading(true);
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

    try {
      await deleteTask(id);
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      if (taskToDelete) {
        setTasks(prevTasks => [...prevTasks, taskToDelete]);
      }
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Get started by adding your first task."
              actionLabel="Add Task"
              onAction={handleAddTask}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Attached To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTasks.map((task) => (
                  <TableRow key={task.id} onClick={() => handleTaskClick(task)} className="cursor-pointer">
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.category}</TableCell>
                    <TableCell>{`${task.attached_to_type}: ${task.attached_to_name}`}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] bg-background">
          {isAddingTask ? (
            <AddTaskForm onClose={() => setIsSheetOpen(false)} onAdd={handleAddTaskSubmit} />
          ) : (
            selectedTask && (
              <TaskDetails
                task={selectedTask}
                onEdit={fetchTasks}
                onDelete={handleDeleteTask}
              />
            )
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tasks;