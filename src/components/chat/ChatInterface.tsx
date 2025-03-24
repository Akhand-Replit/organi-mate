
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { messagesTable } from '@/integrations/supabase/custom-client';
import { MessageRow, MessageInsert } from '@/lib/supabase-types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { 
  ArrowLeft, 
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  userId: string;
  conversationUser: {
    id: string;
    name: string;
  } | null;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  userId, 
  conversationUser,
  onBack
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages between the two users
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !conversationUser?.id) return;
      
      try {
        setLoading(true);

        // Fetch messages sent by current user to the conversation user
        const { data: sentMessages, error: sentError } = await supabase
          .from('messages')
          .select('*')
          .eq('sender_id', userId)
          .eq('receiver_id', conversationUser.id)
          .order('created_at');

        if (sentError) throw sentError;

        // Fetch messages received by current user from the conversation user
        const { data: receivedMessages, error: receivedError } = await supabase
          .from('messages')
          .select('*')
          .eq('sender_id', conversationUser.id)
          .eq('receiver_id', userId)
          .order('created_at');

        if (receivedError) throw receivedError;
        
        // Combine and sort messages
        const allMessages = [...(sentMessages || []), ...(receivedMessages || [])].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        setMessages(allMessages as Message[]);
        
        // Mark messages as read
        const unreadMessages = receivedMessages?.filter(msg => 
          msg.receiver_id === userId && 
          msg.sender_id === conversationUser.id && 
          !msg.read
        );
        
        if (unreadMessages && unreadMessages.length > 0) {
          await Promise.all(unreadMessages.map(msg => {
            return supabase
              .from('messages')
              .update({ read: true })
              .eq('id', msg.id);
          }));
        }
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error loading messages',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${conversationUser?.id},receiver_id=eq.${userId}`
        },
        (payload) => {
          // Add new message to the state
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          
          // Mark the message as read
          supabase
            .from('messages')
            .update({ read: true })
            .eq('id', newMessage.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, conversationUser?.id, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !conversationUser || !user) return;
    
    try {
      setSending(true);
      
      const newMessage: MessageInsert = {
        sender_id: userId,
        receiver_id: conversationUser.id,
        content: content.trim(),
        read: false,
        sender_name: user.name || null,
        receiver_name: conversationUser.name || null
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select();
      
      if (error) throw error;
      
      // Add new message to the state
      if (data && data[0]) {
        setMessages((prev) => [
          ...prev, 
          data[0] as Message
        ]);
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  if (!conversationUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-4">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{conversationUser.name}</h2>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.sender_id === userId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t p-4">
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={loading}
          disabled={sending}
          sending={sending}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
