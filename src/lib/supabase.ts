import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hecoopajntqcycoiqpwh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xrBdQIy9nl4QBSdIp1qWOA_QtPoOzbH';

// Database types for the contact_signals table
export interface ContactSignal {
  id?: number;
  created_at?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Insert a new contact signal into the Supabase "contact_signals" table.
 * Returns { success: true } or { success: false, error: string }.
 */
export async function transmitSignal(
  signal: Omit<ContactSignal, 'id' | 'created_at'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_signals')
      .insert([
        {
          name: signal.name,
          email: signal.email,
          subject: signal.subject || 'Direct Portfolio Inquiry',
          message: signal.message,
        },
      ]);

    if (error) {
      console.error('[Supabase] Insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Supabase] Unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown transmission error',
    };
  }
}
