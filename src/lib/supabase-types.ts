
// This file provides custom type definitions for Supabase tables that 
// don't appear in the auto-generated types.
// Use this for tables created after the initial setup or for local development.

import { Database } from "@/integrations/supabase/types";

// Extend the Database type to include our custom tables
export interface CustomDatabase extends Database {
  public: Database["public"] & {
    Tables: Database["public"]["Tables"] & {
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          created_at: string;
          sender_name: string | null;
          receiver_name: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
          sender_name?: string | null;
          receiver_name?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
          sender_name?: string | null;
          receiver_name?: string | null;
        };
      };
    };
  };
}

// Custom client types for Supabase operations
export type MessageRow = CustomDatabase["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = CustomDatabase["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = CustomDatabase["public"]["Tables"]["messages"]["Update"];
