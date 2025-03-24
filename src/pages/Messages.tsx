
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Messages: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {!user ? (
          <div className="text-center py-10">
            <p>Please log in to view your messages</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow">
            <ChatInterface 
              userId={user.id} 
              conversationUser={selectedUser}
              onBack={handleBack}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
