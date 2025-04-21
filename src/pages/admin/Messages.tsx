import React, { useState, useEffect, useRef } from 'react';
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
  const realtimeChannel = useRef<any>(null);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, user_id')
        .order('name');

      if (companiesError) throw companiesError;

      const conversationsData: ChatConversation[] = await Promise.all(
        companies.map(async (company) => {
          const { data: lastMessages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .or(`sender_id.eq.${company.user_id},receiver_id.eq.${company.user_id}`)
            .order('created_at', { ascending: false })
            .limit(1);

          const { count: unreadCount, error: countError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', company.user_id)
            .eq('receiver_id', user.id)
            .eq('read', false);

          if (msgError) {
            console.error('Error fetching last message:', msgError);
            return null;
          }
          if (countError) {
            console.error('Error fetching unread count:', countError);
            return null;
          }

          let profileName = company.name;
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', company.user_id)
            .maybeSingle();
          if (profile && profile.name) profileName = profile.name;

          return {
            user: {
              id: company.user_id,
              name: profileName,
              email: '',
              company_id: company.id
            } as User,
            lastMessage: lastMessages && lastMessages.length > 0 ? lastMessages[0] as Message : undefined,
            unreadCount: unreadCount || 0
          } as ChatConversation;
        })
      );

      const validConversations = conversationsData.filter(Boolean) as ChatConversation[];
      validConversations.sort((a, b) => {
        if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
        if (a.lastMessage && b.lastMessage) {
          return new Date(b.lastMessage.created_at).getTime() -
                 new Date(a.lastMessage.created_at).getTime();
        }
        return a.user.name.localeCompare(b.user.name);
      });

      setConversations(validConversations);
    } catch (error: any) {
      console.error('Error fetching companies/conversations:', error);
      toast({
        title: 'Error loading messages',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    if (!user) return;

    if (realtimeChannel.current) {
      supabase.removeChannel(realtimeChannel.current);
    }

    const channel = supabase
      .channel('admin-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // listen to INSERT/UPDATE/DELETE
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          fetchConversations();
        }
      )
      .subscribe();

    realtimeChannel.current = channel;

    return () => {
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current);
      }
    };
  }, [user]);

  const handleSelectUser = (user: User) => {
    setSelectedUser({
      id: user.id,
      name: user.name || user.email || 'Unknown User'
    });
  };

  const handleBack = () => {
    setSelectedUser(null);
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
