import React, { useState } from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, User, Send } from 'lucide-react';

const EmployeeMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // Mocked conversations/messages removed
  const mockConversations: any[] = [];
  const mockMessages: any[] = [];
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessageText('');
  };
  
  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversations
              </CardTitle>
              <CardDescription>
                Your message threads with managers
              </CardDescription>
              <div className="pt-2">
                <Input placeholder="Search messages..." />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockConversations.length > 0 ? (
                  mockConversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id 
                          ? 'bg-primary/20' 
                          : conversation.unread 
                            ? 'bg-primary/10 hover:bg-primary/15' 
                            : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className={`font-medium block ${conversation.unread ? 'font-semibold' : ''}`}>
                              {conversation.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.role}
                            </span>
                          </div>
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
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    No conversations yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle>
                        {mockConversations.find(c => c.id === selectedConversation)?.name}
                      </CardTitle>
                      <CardDescription>
                        {mockConversations.find(c => c.id === selectedConversation)?.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {mockMessages.length > 0 ? (
                      mockMessages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.senderId === 'current-user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 'current-user' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-10">
                        No messages yet.
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Type your message..." 
                        className="min-h-10 resize-none"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage} 
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-center text-muted-foreground">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeMessages;
