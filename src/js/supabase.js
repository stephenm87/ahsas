// Re-export supabase client from auth module for backward compatibility
// Auth module is the single source of truth for the Supabase client
export { supabase } from './auth.js';
