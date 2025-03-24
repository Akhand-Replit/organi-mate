
// General types used throughout the application
export type UserRole = 'admin' | 'company' | 'branch_manager' | 'assistant_manager' | 'employee' | 'job_seeker';

export interface User {
  id: string;
  email: string;
  role?: UserRole;
  company_id?: string;
  branch_id?: string;
  name?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

export interface ChatConversation {
  user: User;
  lastMessage?: Message;
  unreadCount: number;
}
