
import React from 'react';
import BranchLayout from '@/components/layout/BranchLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BranchMessages: React.FC = () => {
  // This is a placeholder for when we implement messaging functionality
  const mockConversations = [
    {
      id: '1',
      name: 'Company Admin',
      lastMessage: 'Please submit the monthly reports by Friday',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      name: 'John Smith',
      lastMessage: 'I need to request time off next week',
      time: '5 hours ago',
      unread: false
    },
    {
      id: '3',
      name: 'Maria Garcia',
      lastMessage: 'The inventory system is updated now',
      time: 'Yesterday',
      unread: false
    }
  ];

  return (
    <BranchLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            New Message
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversations
              </CardTitle>
              <CardDescription>
                Your recent message threads
              </CardDescription>
              <div className="pt-2">
                <Input placeholder="Search messages..." />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockConversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      conversation.unread 
                        ? 'bg-primary/10 hover:bg-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className={`font-medium ${conversation.unread ? 'font-semibold' : ''}`}>
                          {conversation.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread && (
                      <div className="flex justify-end">
                        <span className="h-2 w-2 rounded-full bg-primary mt-1"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-center text-muted-foreground">
                Select a conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-center text-muted-foreground">
                Choose a conversation from the list to view and reply to messages.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BranchLayout>
  );
};

export default BranchMessages;
