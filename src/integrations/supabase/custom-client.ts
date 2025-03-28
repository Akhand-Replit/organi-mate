
// This file provides a typed Supabase client for tables not included in the auto-generated types

import { supabase } from './client';
import { MessageRow, MessageInsert, MessageUpdate } from '@/lib/supabase-types';

export const messagesTable = {
  select: () => {
    return supabase.from('messages').select();
  },
  
  selectByParticipants: (userId1: string, userId2: string) => {
    return supabase
      .from('messages')
      .select()
      .or(`sender_id.eq.${userId1},receiver_id.eq.${userId1}`)
      .or(`sender_id.eq.${userId2},receiver_id.eq.${userId2}`)
      .order('created_at', { ascending: true });
  },
  
  selectLatestByParticipants: (userId1: string, userId2: string) => {
    return supabase
      .from('messages')
      .select()
      .or(`sender_id.eq.${userId1},receiver_id.eq.${userId1}`)
      .or(`sender_id.eq.${userId2},receiver_id.eq.${userId2}`)
      .order('created_at', { ascending: false })
      .limit(1);
  },
  
  insert: (data: MessageInsert) => {
    return supabase.from('messages').insert(data);
  },
  
  update: (data: MessageUpdate) => {
    return supabase.from('messages').update(data);
  },
  
  markAsRead: (receiverId: string, senderId: string) => {
    return supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', receiverId)
      .eq('sender_id', senderId);
  },
  
  delete: (messageId: string) => {
    return supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
  },
  
  getUnreadCount: (userId: string) => {
    return supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('receiver_id', userId)
      .eq('read', false);
  },
  
  getConversationParticipants: (userId: string) => {
    // Fix the TypeScript error by directly calling rpc without type checking
    return supabase.rpc('get_unique_conversation_participants', { 
      user_id: userId 
    }) as unknown as ReturnType<typeof supabase.from>;
  }
};
