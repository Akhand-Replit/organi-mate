
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  
  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <Layout>
      {user && (
        <ChatInterface 
          userId={user.id} 
          conversationUser={selectedUser}
          onBack={handleBack}
        />
      )}
    </Layout>
  );
};

export default Messages;
