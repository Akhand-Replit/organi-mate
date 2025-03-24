
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Message, User, ChatConversation } from '@/lib/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatConversationItem from './ChatConversationItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MessageSquare, Plus } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch conversations on component mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  // Subscribe to new messages when component mounts
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Update messages if this is for the current conversation
          if (selectedUser && selectedUser.id === newMessage.sender_id) {
            setMessages(prev => [...prev, newMessage]);
            markMessageAsRead(newMessage.id);
          } else {
            // Update conversation list to show new message indicator
            fetchConversations();
            // Show toast notification
            toast({
              title: "New message",
              description: `${newMessage.sender_name || 'Someone'} sent you a message`,
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedUser]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      // Get all messages to/from this user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`) as { data: Message[] | null, error: any };
        
      if (messagesError) throw messagesError;
      
      // Get unique user IDs from these messages
      const userIds = new Set<string>();
      messagesData?.forEach(msg => {
        if (msg.sender_id !== user.id) userIds.add(msg.sender_id);
        if (msg.receiver_id !== user.id) userIds.add(msg.receiver_id);
      });
      
      // Get user details for these users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(userIds));
        
      if (usersError) throw usersError;
      
      // Build conversations
      const conversationMap = new Map<string, ChatConversation>();
      
      usersData?.forEach(profile => {
        // Skip the current user
        if (profile.id === user.id) return;
        
        const otherUser: User = {
          id: profile.id,
          email: '', // Email not stored in profiles table
          name: profile.name,
          role: profile.role,
          company_id: profile.company_id,
          branch_id: profile.branch_id
        };
        
        // Find messages with this user
        const conversationMessages = messagesData
          ?.filter(
            msg => (msg.sender_id === profile.id && msg.receiver_id === user.id) || 
                  (msg.sender_id === user.id && msg.receiver_id === profile.id)
          )
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || [];
        
        // Count unread messages
        const unreadCount = messagesData
          ?.filter(
            msg => msg.sender_id === profile.id && msg.receiver_id === user.id && !msg.read
          ).length || 0;
        
        if (conversationMessages.length > 0) {
          conversationMap.set(profile.id, {
            user: otherUser,
            lastMessage: conversationMessages[conversationMessages.length - 1],
            unreadCount
          });
        }
      });
      
      // Convert map to array and sort by last message date
      const sortedConversations = Array.from(conversationMap.values())
        .sort((a, b) => {
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return new Date(b.lastMessage.created_at).getTime() - 
                 new Date(a.lastMessage.created_at).getTime();
        });
      
      setConversations(sortedConversations);
      
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Failed to load conversations",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true }) as { data: Message[] | null, error: any };
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages from other user as read
      const unreadMessages = data?.filter(
        msg => msg.sender_id === otherUserId && msg.receiver_id === user.id && !msg.read
      ) || [];
      
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
      
      // Update conversation list (to update unread counts)
      if (unreadMessages.length > 0) {
        fetchConversations();
      }
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Failed to load messages",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId) as { data: any, error: any };
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  
  const sendMessage = async (content: string) => {
    if (!user || !selectedUser) return;
    
    try {
      setIsLoading(true);
      
      const message = {
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content,
        read: false,
        sender_name: user.name || '',
        receiver_name: selectedUser.name || ''
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single() as { data: Message | null, error: any };
        
      if (error) throw error;
      
      if (data) {
        setMessages(prev => [...prev, data]);
        fetchConversations(); // Update last message in conversation list
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectConversation = (conversation: ChatConversation) => {
    setSelectedUser(conversation.user);
    fetchMessages(conversation.user.id);
  };
  
  return (
    <div className="flex h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
      {/* Conversations sidebar */}
      <div className="w-full max-w-xs border-r hidden md:block">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </h2>
        </div>
        
        <ScrollArea className="h-[calc(100%-61px)]">
          <div className="p-2">
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <ChatConversationItem
                  key={conversation.user.id}
                  conversation={conversation}
                  isActive={selectedUser?.id === conversation.user.id}
                  onClick={() => selectConversation(conversation)}
                />
              ))
            ) : (
              <div className="text-center py-8 px-4">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-1">No conversations yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start a new conversation to connect with your team
                </p>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" /> New Message
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="font-semibold">{selectedUser.name}</h3>
                <span className="text-xs text-muted-foreground ml-2 px-2 py-1 bg-muted rounded-full">
                  {selectedUser.role}
                </span>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length > 0 ? (
                <>
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No messages yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Send a message to start the conversation
                  </p>
                </div>
              )}
            </ScrollArea>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Select a conversation from the list or start a new one to connect with your team members.
            </p>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> New Message
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
