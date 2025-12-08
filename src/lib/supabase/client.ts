import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey, getApiUrl } from './info';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${projectId}.supabase.co`;

// Singleton instance
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey);
  }
  return supabaseInstance;
}

// API helper for server calls
export const API_URL = getApiUrl();

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = getApiUrl(endpoint);
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}
