
import React, { useState } from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckSquare, Calendar, Clock, User, CheckCheck, MessageSquare } from 'lucide-react';

const EmployeeTasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  
  // Mocked tasks for display
  const mockTasks = [
    {
      id: '1',
      title: 'Complete daily inventory check',
      description: 'Count inventory in aisle 3-5 and update the system',
      assignedBy: 'Sarah Johnson (Assistant Manager)',
      deadline: '2025-05-10',
      priority: 'High',
      status: 'In Progress'
    },
    {
      id: '2',
      title: 'Customer follow-up calls',
      description: 'Contact customers from the list about their recent purchases',
      assignedBy: 'Michael Chen (Branch Manager)',
      deadline: '2025-05-12',
      priority: 'Medium',
      status: 'Not Started'
    },
    {
      id: '3',
      title: 'Restock promotional displays',
      description: 'Update front-of-store displays with new promotional items',
      assignedBy: 'Sarah Johnson (Assistant Manager)',
      deadline: '2025-05-08',
      priority: 'Low',
      status: 'Completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Find the currently selected task
  const currentTask = mockTasks.find(t => t.id === selectedTask);

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Task Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{mockTasks.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{mockTasks.filter(t => t.status === 'Completed').length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{mockTasks.filter(t => t.status !== 'Completed').length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Assigned Tasks
                </CardTitle>
                <CardDescription>
                  Tasks assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        selectedTask === task.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedTask(task.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>From: {task.assignedBy.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              {selectedTask ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle>{currentTask?.title}</CardTitle>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(currentTask?.priority || '')}`}>
                            {currentTask?.priority} Priority
                          </span>
                        </div>
                        <CardDescription>
                          Assigned by {currentTask?.assignedBy}
                        </CardDescription>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(currentTask?.status || '')}`}>
                        {currentTask?.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentTask?.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Due Date</h3>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{new Date(currentTask?.deadline || '').toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Assigned By</h3>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{currentTask?.assignedBy}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex space-x-2">
                        {currentTask?.status !== 'Completed' && (
                          <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="flex items-center gap-2">
                                <CheckCheck className="h-4 w-4" />
                                Update Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Task Status</DialogTitle>
                                <DialogDescription>
                                  Provide an update on your progress with this task
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="status">Status</Label>
                                  <Select defaultValue={currentTask?.status}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Not Started">Not Started</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="update">Status Update</Label>
                                  <Textarea id="update" placeholder="Provide details about your progress..." rows={4} />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                                <Button onClick={() => setUpdateDialogOpen(false)}>Submit Update</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        <Button variant="outline" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Message Manager
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <CheckSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-center text-muted-foreground">
                    Select a task to see details
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTasks;
