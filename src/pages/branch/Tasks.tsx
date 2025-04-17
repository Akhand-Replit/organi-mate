
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BranchLayout from '@/components/layout/BranchLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckSquare, Calendar, Clock, User } from 'lucide-react';

const BranchTasks: React.FC = () => {
  const { user } = useAuth();
  
  // This is a placeholder for when we implement tasks functionality
  const mockTasks = [
    {
      id: '1',
      title: 'Complete monthly expense reports',
      deadline: '2025-05-01',
      priority: 'High',
      assignedTo: 'All Staff',
      status: 'In Progress'
    },
    {
      id: '2',
      title: 'Staff meeting preparation',
      deadline: '2025-04-20',
      priority: 'Medium',
      assignedTo: 'Assistant Managers',
      status: 'Not Started'
    },
    {
      id: '3',
      title: 'Inventory check',
      deadline: '2025-04-22',
      priority: 'High',
      assignedTo: 'Store Employees',
      status: 'Not Started'
    }
  ];

  return (
    <BranchLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Branch Tasks</h1>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                Assigned Tasks
              </CardTitle>
              <CardDescription>
                View and manage tasks assigned to your branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockTasks.length > 0 ? (
                <div className="space-y-4">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : task.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Assigned to: {task.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Status: {task.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks have been assigned to your branch yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </BranchLayout>
  );
};

export default BranchTasks;
