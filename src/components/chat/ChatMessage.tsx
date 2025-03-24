
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isCurrentUser = message.sender_id === user?.id;
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2 my-2",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {getInitials(message.sender_name || 'User')}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={cn(
          "max-w-[70%] px-4 py-2 rounded-lg",
          isCurrentUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}
      >
        <p className="text-sm">{message.content}</p>
        <span className={cn(
          "text-xs block mt-1", 
          isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {format(new Date(message.created_at), 'h:mm a')}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
