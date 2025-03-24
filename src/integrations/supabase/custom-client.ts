
// This file provides a typed Supabase client for tables not included in the auto-generated types

import { supabase } from './client';
import { MessageRow, MessageInsert, MessageUpdate } from '@/lib/supabase-types';

export const messagesTable = {
  select: () => {
    return supabase.from('messages');
  },
  
  insert: (data: MessageInsert) => {
    return supabase.from('messages').insert(data);
  },
  
  update: (data: MessageUpdate) => {
    return supabase.from('messages').update(data);
  },
  
  delete: () => {
    return supabase.from('messages');
  },
};
