
// This file provides a typed Supabase client for tables not included in the auto-generated types

import { supabase } from './client';
import { MessageRow, MessageInsert, MessageUpdate } from '@/lib/supabase-types';

export const messagesTable = {
  select: () => 
    supabase.from('messages'),
  
  insert: (data: MessageInsert) => 
    supabase.from('messages').insert(data),
  
  update: (data: MessageUpdate) => 
    supabase.from('messages').update(data),
  
  delete: () => 
    supabase.from('messages'),
};
