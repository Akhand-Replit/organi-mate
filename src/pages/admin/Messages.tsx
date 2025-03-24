import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Message, ChatConversation } from '@/lib/types';
import ChatInterface from '@/components/chat/ChatInterface';
import ChatConversationItem from '@/components/chat/ChatConversationItem';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Search,
  MessagesSquare,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AdminMessages: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data: companies, error } = await supabase
          .from('companies')
          .select('id, name, user_id')
          .order('name');
          
        if (error) throw error;
        
        if (companies) {
          const conversationsWithUnread = await Promise.all(companies.map(async (company) => {
            const { data: messages, error: msgError } = await supabase
              .from('messages')
              .select('*')
              .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
              .or(`sender_id.eq.${company.user_id},receiver_id.eq.${company.user_id}`)
              .order('created_at', { ascending: false })
              .limit(1);
              
            if (msgError) {
              console.error('Error fetching messages:', msgError);
              return null;
            }
            
            const { count, error: countError } = await supabase
              .from('messages')
              .select('*', { count: 'exact' })
              .eq('sender_id', company.user_id)
              .eq('receiver_id', user.id)
              .eq('read', false);
              
            if (countError) {
              console.error('Error fetching unread count:', countError);
              return null;
            }
            
            return {
              user: {
                id: company.user_id,
                name: company.name,
                email: '',
                company_id: company.id
              } as User,
              lastMessage: messages && messages.length > 0 ? messages[0] as Message : undefined,
              unreadCount: count || 0
            } as ChatConversation;
          }));
          
          const validConversations = conversationsWithUnread.filter(c => c !== null) as ChatConversation[];
          validConversations.sort((a, b) => {
            if (b.unreadCount !== a.unreadCount) {
              return b.unreadCount - a.unreadCount;
            }
            if (a.lastMessage && b.lastMessage) {
              return new Date(b.lastMessage.created_at).getTime() - 
                     new Date(a.lastMessage.created_at).getTime();
            }
            return a.user.name.localeCompare(b.user.name);
          });
          
          setConversations(validConversations);
        }
      } catch (error: any) {
        console.error('Error fetching companies:', error);
        toast({
          title: 'Error loading companies',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, [user, toast]);
  
  const handleSelectUser = (user: User) => {
    setSelectedUser({
      id: user.id,
      name: user.name || user.email || 'Unknown User'
    });
  };
  
  const handleBack = () => {
    setSelectedUser(null);
    if (user) {
      setIsLoading(true);
      supabase
        .from('companies')
        .select('id, name, user_id')
        .order('name')
        .then(({ data, error }) => {
          if (!error && data) {
            setIsLoading(false);
          }
        });
    }
  };
  
  const filteredConversations = searchQuery
    ? conversations.filter(c => 
        c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;
  
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        <div className={`
          w-full md:w-80 border-r bg-background
          ${selectedUser ? 'hidden md:block' : 'block'}
        `}>
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessagesSquare className="h-5 w-5" />
              Messages
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Communicate with companies
            </p>
            
            <div className="relative mt-4">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-12rem)]">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchQuery ? 'No conversations matching your search' : 'No conversations yet'}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ChatConversationItem
                  key={conversation.user.id}
                  conversation={conversation}
                  onClick={() => handleSelectUser(conversation.user)}
                  isActive={selectedUser?.id === conversation.user.id}
                />
              ))
            )}
          </div>
        </div>
        
        <div className="flex-1">
          {user && (
            <ChatInterface 
              userId={user.id} 
              conversationUser={selectedUser}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
