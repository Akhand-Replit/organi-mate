
import React from 'react';
import { cn } from '@/lib/utils';
import { ChatConversation } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ChatConversationItemProps {
  conversation: ChatConversation;
  isActive: boolean;
  onClick: () => void;
}

const ChatConversationItem: React.FC<ChatConversationItemProps> = ({ 
  conversation, 
  isActive, 
  onClick 
}) => {
  const { user, lastMessage, unreadCount } = conversation;
  
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
        "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
        isActive && "bg-muted"
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarFallback>{getInitials(user.name || 'User')}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{user.name}</h3>
          {lastMessage && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(lastMessage.created_at), 'MMM d')}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
            {lastMessage ? lastMessage.content : 'No messages yet'}
          </p>
          
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatConversationItem;
