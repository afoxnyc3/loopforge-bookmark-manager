import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Public client — uses anon key, respects RLS policies.
 * Safe to use in browser and server-side reads.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin client — uses service role key, bypasses RLS.
 * MUST only be used in server-side API routes.
 */
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string;
          url: string;
          title: string;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          title: string;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          title?: string;
          tags?: string[];
          created_at?: string;
        };
      };
    };
  };
};
